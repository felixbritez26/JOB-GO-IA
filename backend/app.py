from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api")
def home():
    return {"message": "AI Job Finder API is running"}


@app.route("/api/jobs")
def get_jobs():
    jobs = [
        {
            "title": "Junior Full Stack Developer",
            "company": "TechNova",
            "location": "New York, NY",
            "match": 94,
            "technologies": ["React", "Python", "PostgreSQL"]
        },
        {
            "title": "Frontend Developer",
            "company": "Pixel Labs",
            "location": "Remote",
            "match": 88,
            "technologies": ["React", "JavaScript", "CSS"]
        },
        {
            "title": "Backend Developer",
            "company": "Nova Systems",
            "location": "New York, NY",
            "match": 86,
            "technologies": ["Python", "Flask", "PostgreSQL"]
        }
    ]

    return jobs

applications = [
    {
        "id": 1,
        "company": "TechNova",
        "position": "Junior Full Stack Developer",
        "status": "Applied",
        "date": "Sep 18, 2026"
    }
]


@app.route("/api/applications")
def get_applications():
    return applications


if __name__ == "__main__":
    app.run(debug=True, port=5000)

    