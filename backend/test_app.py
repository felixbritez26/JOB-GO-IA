
import pytest
from flask_jwt_extended import create_access_token
from app import app, db, User
from app import app, db, User, bcrypt


@pytest.fixture
def client(tmp_path):
    app.config["TESTING"] = True

    with app.app_context():
        # Use a separate SQLite database for testing.
        test_engine = db.create_engine(
            f"sqlite:///{tmp_path / 'test_jobfinder.db'}"
        )

        original_engine = db.engines[None]
        db.engines[None] = test_engine

        try:
            db.create_all()

            with app.test_client() as test_client:
                yield test_client
        finally:
            db.session.remove()
            db.drop_all()
            db.engines[None] = original_engine
            test_engine.dispose()


@pytest.fixture
def auth_headers(client):
    # Create a user in the isolated test database.
    with app.app_context():
        user = User(
    email="testuser@example.com",
    password_hash=bcrypt.generate_password_hash(
        "test-password"
    ).decode("utf-8")
)
        db.session.add(user)
        db.session.commit()

        token = create_access_token(identity=str(user.id))

    return {"Authorization": f"Bearer {token}"}


def test_api_home(client):
    response = client.get("/api")

    assert response.status_code == 200
    assert response.get_json() == {
        "message": "AI Job Finder API is running"
    }


def test_get_jobs(client):
    response = client.get("/api/jobs")

    assert response.status_code == 200

    jobs = response.get_json()

    assert isinstance(jobs, list)
    assert len(jobs) > 0


def test_create_application(client, auth_headers):
    response = client.post(
        "/api/applications",
        headers=auth_headers,
        json={
            "company": "Test Company",
            "position": "Junior Developer",
            "status": "Applied",
            "date": "2026-10-11"
        }
    )

    assert response.status_code == 201
    assert response.get_json()["company"] == "Test Company"


def test_get_applications(client, auth_headers):
    created = client.post(
        "/api/applications",
        headers=auth_headers,
        json={
            "company": "Google",
            "position": "Frontend Developer",
            "date": "2026-10-11"
        }
    )

    assert created.status_code == 201

    response = client.get(
        "/api/applications",
        headers=auth_headers
    )

    assert response.status_code == 200
    assert len(response.get_json()) == 1


def test_update_application(client, auth_headers):
    created_response = client.post(
        "/api/applications",
        headers=auth_headers,
        json={
            "company": "TechNova",
            "position": "Full Stack Developer",
            "date": "2026-10-11"
        }
    )

    assert created_response.status_code == 201
    created = created_response.get_json()

    response = client.put(
        f"/api/applications/{created['id']}",
        headers=auth_headers,
        json={"status": "Interview"}
    )

    assert response.status_code == 200
    assert response.get_json()["status"] == "Interview"


def test_delete_application(client, auth_headers):
    created_response = client.post(
        "/api/applications",
        headers=auth_headers,
        json={
            "company": "Pixel Labs",
            "position": "Frontend Developer",
            "date": "2026-10-11"
        }
    )

    assert created_response.status_code == 201
    created = created_response.get_json()

    response = client.delete(
        f"/api/applications/{created['id']}",
        headers=auth_headers
    )

    assert response.status_code == 200

    remaining = client.get(
        "/api/applications",
        headers=auth_headers
    )

    assert remaining.status_code == 200
    assert remaining.get_json() == []


def test_applications_require_login(client):
    response = client.get("/api/applications")

    assert response.status_code == 401


def test_users_cannot_see_other_applications(client, auth_headers):
    # User A creates an application.
    created = client.post(
        "/api/applications",
        headers=auth_headers,
        json={
            "company": "Google",
            "position": "Full Stack Developer",
            "date": "2026-10-29"
        }
    )

    assert created.status_code == 201

    # Create a token for a different user.
    with app.app_context():
        other_user = User(
            email="seconduser@example.com",
            password_hash=bcrypt.generate_password_hash(
                "TestPassword123!"
            ).decode("utf-8")
        )

        db.session.add(other_user)
        db.session.commit()

        other_token = create_access_token(
            identity=str(other_user.id)
        )

    # User B should not see User A's applications.
    response = client.get(
        "/api/applications",
        headers={
            "Authorization": f"Bearer {other_token}"
        }
    )

    assert response.status_code == 200
    assert response.get_json() == []


def test_users_cannot_see_other_applications(client, auth_headers):
    # User A creates an application.
    created = client.post(
        "/api/applications",
        headers=auth_headers,
        json={
            "company": "Google",
            "position": "Full Stack Developer",
            "date": "2026-10-29"
        }
    )

    assert created.status_code == 201

    # Create a token for a different user.
    with app.app_context():
        other_user = User(
            email="seconduser@example.com",
            password_hash=bcrypt.generate_password_hash(
                "TestPassword123!"
            ).decode("utf-8")
        )

        db.session.add(other_user)
        db.session.commit()

        other_token = create_access_token(
            identity=str(other_user.id)
        )

    # User B should not see User A's applications.
    response = client.get(
        "/api/applications",
        headers={
            "Authorization": f"Bearer {other_token}"
        }
    )

    assert response.status_code == 200
    assert response.get_json() == []

