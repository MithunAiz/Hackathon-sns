/**
 * Home.jsx — Main page that orchestrates tasks:
 *   - Fetches tasks on mount
 *   - Handles create / edit / delete / toggle
 *   - Filters tasks by status
 */

import { useState, useEffect } from "react";
import {
    fetchTasks,
    createTask,
    updateTask,
    toggleComplete,
    deleteTask,
} from "../api";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import FilterBar from "../components/FilterBar";
import { HiClipboardDocumentList } from "react-icons/hi2";

export default function Home() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState("all");
    const [editing, setEditing] = useState(null); // task being edited
    const [loading, setLoading] = useState(true);

    // ── Fetch on mount ──────────────────────────────────────────────────
    useEffect(() => {
        fetchTasks()
            .then(setTasks)
            .finally(() => setLoading(false));
    }, []);

    // ── CRUD handlers ────────────────────────────────────────────────────
    async function handleCreate(data) {
        const created = await createTask(data);
        setTasks((prev) => [created, ...prev]);
    }

    async function handleUpdate(data) {
        const updated = await updateTask(editing.id, data);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setEditing(null);
    }

    async function handleToggle(id) {
        const updated = await toggleComplete(id);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    }

    async function handleDelete(id) {
        await deleteTask(id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
    }

    // ── Derived filtered list ───────────────────────────────────────────
    const filtered = tasks.filter((t) => {
        if (filter === "completed") return t.completed;
        if (filter === "pending") return !t.completed;
        return true;
    });

    // ── Task counts for stats ───────────────────────────────────────────
    const totalCount = tasks.length;
    const completedCount = tasks.filter((t) => t.completed).length;
    const pendingCount = totalCount - completedCount;

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            {/* ── Task input / edit form ────────────────────────────────────── */}
            {editing ? (
                <TaskForm
                    key={editing.id}
                    initial={editing}
                    onSubmit={handleUpdate}
                    onCancel={() => setEditing(null)}
                />
            ) : (
                <TaskForm onSubmit={handleCreate} />
            )}

            {/* ── Stats bar ─────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <FilterBar current={filter} onChange={setFilter} />
                <p className="text-xs text-gray-400 tabular-nums hidden sm:block">
                    {completedCount}/{totalCount} done · {pendingCount} left
                </p>
            </div>

            {/* ── Task list ─────────────────────────────────────────────────── */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="inline-block w-6 h-6 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin" />
                    <p className="mt-3 text-sm text-gray-400">Loading tasks…</p>
                </div>
            ) : filtered.length === 0 ? (
                /* Empty state */
                <div className="text-center py-16 space-y-3">
                    <HiClipboardDocumentList className="mx-auto text-5xl text-gray-200" />
                    <p className="text-gray-400 text-sm">
                        {filter === "all"
                            ? "No tasks yet — add one above!"
                            : `No ${filter} tasks.`}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onToggle={handleToggle}
                            onEdit={setEditing}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
