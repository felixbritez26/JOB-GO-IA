
import pytest
from app import app, db


@pytest.fixture
def client(tmp_path):
    app.config["TESTING"] = True

    with app.app_context():
        # Create a separate SQLite database for testing.
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


def test_create_application(client):
    response = client.post(
        "/api/applications",
        json={
            "company": "Test Company",
            "position": "Junior Developer",
            "status": "Applied",
            "date": "2026-10-11"
        }
    )

    assert response.status_code == 201
    assert response.get_json()["company"] == "Test Company"


def test_get_applications(client):
    client.post(
        "/api/applications",
        json={
            "company": "Google",
            "position": "Frontend Developer",
            "date": "2026-10-11"
        }
    )

    response = client.get("/api/applications")

    assert response.status_code == 200
    assert len(response.get_json()) == 1


def test_update_application(client):
    created = client.post(
        "/api/applications",
        json={
            "company": "TechNova",
            "position": "Full Stack Developer",
            "date": "2026-10-11"
        }
    ).get_json()

    response = client.put(
        f"/api/applications/{created['id']}",
        json={"status": "Interview"}
    )

    assert response.status_code == 200
    assert response.get_json()["status"] == "Interview"


def test_delete_application(client):
    created = client.post(
        "/api/applications",
        json={
            "company": "Pixel Labs",
            "position": "Frontend Developer",
            "date": "2026-10-11"
        }
    ).get_json()

    response = client.delete(
        f"/api/applications/{created['id']}"
    )

    assert response.status_code == 200
    assert client.get("/api/applications").get_json() == []
