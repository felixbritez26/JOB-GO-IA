from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///jobfinder.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

CORS(
    app,
    resources={r"/api/*": {"origins": "*"}}
)

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company = db.Column(db.String(120), nullable=False)
    position = db.Column(db.String(120), nullable=False)
    status = db.Column(db.String(50), nullable=False, default="Applied")
    date = db.Column(db.String(50), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "company": self.company,
            "position": self.position,
            "status": self.status,
            "date": self.date,
        }

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


@app.route("/api/applications", methods=["GET", "POST"])
def handle_applications():
    if request.method == "GET":
        database_applications = Application.query.all()

        return [
            application.to_dict()
            for application in database_applications
        ]

    if request.method == "POST":
        data = request.get_json()

        new_application = Application(
            company=data["company"],
            position=data["position"],
            status=data.get("status", "Applied"),
            date=data["date"]
        )

        db.session.add(new_application)
        db.session.commit()

        return new_application.to_dict(), 201


@app.route("/api/applications/<int:application_id>", methods=["PUT"])
def update_application(application_id):
    data = request.get_json()

    for application in applications:
        if application["id"] == application_id:
            application["status"] = data.get(
                "status",
                application["status"]
            )

            return application

    return {"error": "Application not found"}, 404


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True, port=5000)
    