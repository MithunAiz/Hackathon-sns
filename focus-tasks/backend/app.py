"""
app.py — Application entry point for FocusTasks backend.

Configures the Flask app, initialises the SQLite database via SQLAlchemy,
and registers the task routes blueprint.
"""

import os
from flask import Flask
from flask_cors import CORS
from models import db
from routes import tasks_bp

# ── App factory ──────────────────────────────────────────────────────────────
app = Flask(__name__)

# Allow the React dev server (default port 5173) to call the API
CORS(app)

# SQLite database stored alongside the application
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(BASE_DIR, 'database.db')}"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Initialise extensions & register blueprints
db.init_app(app)
app.register_blueprint(tasks_bp)

# Create tables on first run
with app.app_context():
    db.create_all()


@app.route("/")
def index():
    return {"message": "FocusTasks API is running 🚀"}


if __name__ == "__main__":
    app.run(debug=True, port=5000)
