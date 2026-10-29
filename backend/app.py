
import os

from flask import Flask, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity
)
from openai import OpenAI


# =====================================
# FLASK CONFIGURATION
# =====================================

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")

if not app.config["JWT_SECRET_KEY"]:
    raise RuntimeError("JWT_SECRET_KEY is not configured")

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///jobfinder.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Development CORS configuration
CORS(
    app,
    resources={r"/api/*": {"origins": "*"}}
)


# =====================================
# OPENROUTER CONFIGURATION
# =====================================

def get_ai_client():
    api_key = os.getenv("OPENROUTER_API_KEY")

    if not api_key:
        raise RuntimeError(
            "OPENROUTER_API_KEY is not configured"
        )

    return OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key
    )


# =====================================
# USER MODEL
# =====================================


class User(db.Model):
    id = db.Column(
        db.Integer,
        primary_key=True
    )

    email = db.Column(
        db.String(255),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(
            password
        ).decode("utf-8")

    def check_password(self, password):
        return bcrypt.check_password_hash(
            self.password_hash,
            password
        )



# =====================================
# APPLICATION MODEL
# =====================================

class Application(db.Model):
    id = db.Column(
        db.Integer,
        primary_key=True
    )

    company = db.Column(
        db.String(120),
        nullable=False
    )

    position = db.Column(
        db.String(120),
        nullable=False
    )

    status = db.Column(
        db.String(50),
        nullable=False,
        default="Applied"
    )

    date = db.Column(
        db.String(50),
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("user.id"),
        nullable=True
    )

    def to_dict(self):
        return {
            "id": self.id,
            "company": self.company,
            "position": self.position,
            "status": self.status,
            "date": self.date
        }


# =====================================
# API HOME
# =====================================

@app.route("/api")
def home():
    return {
        "message": "AI Job Finder API is running"
    }


# =====================================
# REGISTER
# =====================================

@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    if not isinstance(email, str) or not isinstance(password, str):
        return {
            "error": "Email and password are required"
        }, 400

    email = email.strip().lower()

    if not email or not password:
        return {
            "error": "Email and password are required"
        }, 400

    if len(password) < 8:
        return {
            "error": "Password must have at least 8 characters"
        }, 400

    existing_user = User.query.filter_by(
        email=email
    ).first()

    if existing_user:
        return {
            "error": "Email already registered"
        }, 409

    new_user = User(email=email)
    new_user.set_password(password)

    db.session.add(new_user)
    db.session.commit()

    return {
        "message": "User registered successfully",
        "user": {
            "id": new_user.id,
            "email": new_user.email
        }
    }, 201


# =====================================
# LOGIN
# =====================================

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}

    email = data.get("email")
    password = data.get("password")

    if not isinstance(email, str) or not isinstance(password, str):
        return {
            "error": "Email and password are required"
        }, 400

    email = email.strip().lower()

    if not email or not password:
        return {
            "error": "Email and password are required"
        }, 400

    user = User.query.filter_by(
        email=email
    ).first()

    if not user or not user.check_password(password):
        return {
            "error": "Invalid email or password"
        }, 401

    access_token = create_access_token(
        identity=str(user.id)
    )

    return {
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email
        }
    }, 200


# =====================================
# JOB LISTINGS
# =====================================

@app.route("/api/jobs", methods=["GET"])
def get_jobs():
    jobs = [
        {
            "title": "Junior Full Stack Developer",
            "company": "TechNova",
            "location": "New York, NY",
            "match": 94,
            "technologies": [
                "React",
                "Python",
                "PostgreSQL"
            ]
        },
        {
            "title": "Frontend Developer",
            "company": "Pixel Labs",
            "location": "Remote",
            "match": 88,
            "technologies": [
                "React",
                "JavaScript",
                "CSS"
            ]
        },
        {
            "title": "Backend Developer",
            "company": "Nova Systems",
            "location": "New York, NY",
            "match": 86,
            "technologies": [
                "Python",
                "Flask",
                "PostgreSQL"
            ]
        }
    ]

    return jobs


# =====================================
# GET AND CREATE APPLICATIONS
# =====================================

@app.route(
    "/api/applications",
    methods=["GET", "POST"]
)
@jwt_required()
def handle_applications():

    current_user_id = int(get_jwt_identity())

    # GET: applications belonging to this user
    if request.method == "GET":

        database_applications = Application.query.filter_by(
            user_id=current_user_id
        ).all()

        return [
            application.to_dict()
            for application in database_applications
        ]

    # POST: create an application
    if request.method == "POST":

        data = request.get_json(silent=True) or {}

        required_fields = (
            "company",
            "position",
            "date"
        )

        if not all(
    isinstance(data.get(field), str)
    and data[field].strip()
    for field in required_fields
):
            return {
                "error": "Company, position and date are required"
            }, 400

        new_application = Application(
            company=data["company"],
            position=data["position"],
            status=data.get("status", "Applied"),
            date=data["date"],
            user_id=current_user_id
        )

        db.session.add(new_application)
        db.session.commit()

        return new_application.to_dict(), 201


# =====================================
# UPDATE APPLICATION
# =====================================

@app.route(
    "/api/applications/<int:application_id>",
    methods=["PUT"]
)
@jwt_required()
def update_application(application_id):

    current_user_id = int(get_jwt_identity())

    application = Application.query.filter_by(
        id=application_id,
        user_id=current_user_id
    ).first()

    if application is None:
        return {
            "error": "Application not found"
        }, 404

    data = request.get_json(silent=True) or {}

    status = data.get("status")

    if not isinstance(status, str) or not status.strip():
        return {
            "error": "Valid status is required"
        }, 400

    application.status = status.strip()

    db.session.commit()

    return application.to_dict(), 200


# =====================================
# DELETE APPLICATION
# =====================================

@app.route(
    "/api/applications/<int:application_id>",
    methods=["DELETE"]
)
@jwt_required()
def delete_application(application_id):

    current_user_id = int(get_jwt_identity())

    application = Application.query.filter_by(
        id=application_id,
        user_id=current_user_id
    ).first()

    if application is None:
        return {
            "error": "Application not found"
        }, 404

    db.session.delete(application)
    db.session.commit()

    return {
        "message": "Application deleted"
    }, 200


# =====================================
# AI CAREER ASSISTANT
# =====================================

@app.route("/api/ai-assistant", methods=["POST"])
@jwt_required()
def ai_assistant():

    data = request.get_json(silent=True) or {}

    message = data.get("message", "")
    skills = data.get("skills", [])
    history = data.get("history", [])
    applications = data.get("applications", [])

    if not isinstance(message, str) or not message.strip():
        return {
            "error": "Message is required"
        }, 400

    if not isinstance(skills, list):
        skills = []

    if not isinstance(history, list):
        history = []

    if not isinstance(applications, list):
        applications = []

    skills_text = ", ".join(
        f"{skill.get('name')} ({skill.get('level')})"
        for skill in skills
        if isinstance(skill, dict)
    )

    applications_text = "\n".join(
        f"- {application.get('company')} | "
        f"{application.get('position')} | "
        f"Status: {application.get('status')} | "
        f"Date: {application.get('date')}"
        for application in applications
        if isinstance(application, dict)
    )

    # Build conversation history
    conversation_history = []

    for chat_message in history[-20:]:

        if not isinstance(chat_message, dict):
            continue

        role = chat_message.get("role")
        content = chat_message.get("content")

        if (
            role in ["user", "assistant"]
            and isinstance(content, str)
            and content.strip()
        ):
            conversation_history.append({
                "role": role,
                "content": content
            })

    try:
        response = get_ai_client().chat.completions.create(
            model="openrouter/free",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI career assistant "
                        "for a software developer. "

                        "Help the user with job searching, "
                        "technical skills, resumes, "
                        "career planning, and interviews. "

                        "Give practical and concise advice. "

                        f"The user's current technical skills are: "
                        f"{skills_text or 'Not provided'}. "

                        "Use these skills when giving career advice. "

                        f"\nThe frontend reports "
                        f"{len(applications)} saved job applications. "

                        f"\nApplication details:\n"
                        f"{applications_text or 'No applications provided.'} "

                        "Application details supplied by the frontend "
                        "are user-provided context, not verified records. "

                        "When the user asks about job applications, "
                        "analyze their statuses and dates. "

                        "Identify applications that may need follow-up. "

                        "Suggest practical next steps for improving "
                        "interview chances. "

                        "Do not invent applications, interview outcomes, "
                        "or company responses. "

                        "If application dates are missing or unclear, "
                        "explain the uncertainty. "

                        "Do not claim that an application needs follow-up "
                        "solely because it is old if its status indicates "
                        "rejection, withdrawal, or completion."
                    )
                },
                *conversation_history,
                {
                    "role": "user",
                    "content": message.strip()
                }
            ]
        )

        reply = response.choices[0].message.content

        return {
            "reply": reply
        }, 200

    except Exception as error:

        app.logger.error(
            "OpenRouter error: %s",
            error
        )

        return {
            "error": "Failed to get AI response"
        }, 500



if __name__ == "__main__":

    with app.app_context():
        db.create_all()

    app.run(
        debug=True,
        port=5000
    )
