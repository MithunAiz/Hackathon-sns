"""
routes.py — RESTful API endpoints for FocusTasks.

Endpoints
---------
GET    /tasks              — Return all tasks (ordered newest first).
POST   /tasks              — Create a new task.
PUT    /tasks/<id>          — Update an existing task.
PATCH  /tasks/<id>/complete — Toggle the completed status.
DELETE /tasks/<id>          — Delete a task.
"""

from flask import Blueprint, request, jsonify
from models import db, Task
from datetime import date

tasks_bp = Blueprint("tasks", __name__)


# ---------------------------------------------------------------------------
# GET /tasks — list every task, newest first
# ---------------------------------------------------------------------------
@tasks_bp.route("/tasks", methods=["GET"])
def get_tasks():
    tasks = Task.query.order_by(Task.created_at.desc()).all()
    return jsonify([t.to_dict() for t in tasks]), 200


# ---------------------------------------------------------------------------
# POST /tasks — create a new task
# ---------------------------------------------------------------------------
@tasks_bp.route("/tasks", methods=["POST"])
def create_task():
    data = request.get_json()

    if not data or not data.get("title", "").strip():
        return jsonify({"error": "Title is required"}), 400

    task = Task(
        title=data["title"].strip(),
        priority=data.get("priority", "Medium"),
        due_date=date.fromisoformat(data["due_date"]) if data.get("due_date") else None,
    )
    db.session.add(task)
    db.session.commit()
    return jsonify(task.to_dict()), 201


# ---------------------------------------------------------------------------
# PUT /tasks/<id> — update title, priority, or due_date
# ---------------------------------------------------------------------------
@tasks_bp.route("/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    task = Task.query.get_or_404(task_id)
    data = request.get_json()

    if "title" in data:
        task.title = data["title"].strip()
    if "priority" in data:
        task.priority = data["priority"]
    if "due_date" in data:
        task.due_date = date.fromisoformat(data["due_date"]) if data["due_date"] else None

    db.session.commit()
    return jsonify(task.to_dict()), 200


# ---------------------------------------------------------------------------
# PATCH /tasks/<id>/complete — toggle completion
# ---------------------------------------------------------------------------
@tasks_bp.route("/tasks/<int:task_id>/complete", methods=["PATCH"])
def toggle_complete(task_id):
    task = Task.query.get_or_404(task_id)
    task.completed = not task.completed
    db.session.commit()
    return jsonify(task.to_dict()), 200


# ---------------------------------------------------------------------------
# DELETE /tasks/<id> — remove a task
# ---------------------------------------------------------------------------
@tasks_bp.route("/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    task = Task.query.get_or_404(task_id)
    db.session.delete(task)
    db.session.commit()
    return jsonify({"message": "Task deleted"}), 200
