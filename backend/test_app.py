
import pytest
from app import app


@pytest.fixture
def client():
    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client


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
