import os
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY")
)

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

    application = db.session.get(Application, application_id)

    if application is None:
        return {"error": "Application not found"}, 404

    application.status = data.get(
        "status",
        application.status
    )

    db.session.commit()

    return application.to_dict()

@app.route("/api/applications/<int:application_id>", methods=["DELETE"])
def delete_application(application_id):
    application = db.session.get(Application, application_id)

    if application is None:
        return {"error": "Application not found"}, 404

    db.session.delete(application)
    db.session.commit()

    return {"message": "Application deleted"}


@app.route("/api/ai-assistant", methods=["POST"])
def ai_assistant():
    data = request.get_json() or {}

    message = data.get("message", "")
    skills = data.get("skills", [])
    history = data.get("history", [])

    if not message:
        return {"error": "Message is required"}, 400

    skills_text = ", ".join(
        f"{skill.get('name')} ({skill.get('level')})"
        for skill in skills
    )

    conversation_history = []

    for chat_message in history:
        role = chat_message.get("role")
        content = chat_message.get("content")

        if role in ["user", "assistant"] and content:
            conversation_history.append({
                "role": role,
                "content": content
            })

    try:
        response = client.chat.completions.create(
            model="openrouter/free",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI career assistant for a software developer. "
                        "Help the user with job searching, technical skills, "
                        "resumes, career planning, and interviews. "
                        "Give practical and concise advice. "
                        f"The user's current technical skills are: {skills_text}. "
                        "Use these skills when giving career advice."
                    )
                },
                *conversation_history,
                {
                    "role": "user",
                    "content": message
                }
            ]
        )

        return {
            "reply": response.choices[0].message.content
        }

    except Exception as error:
        print("OpenRouter error:", error)

        return {
            "error": "Failed to get AI response"
        }, 500


if __name__ == "__main__":
    with app.app_context():
        db.create_all()

    app.run(debug=True, port=5000)
    