/**
 * api.js — Axios instance pointing at the Flask backend.
 *
 * If the API is unreachable every call gracefully falls back to
 * localStorage so the app remains usable offline.
 */

import axios from "axios";

const API_BASE = "http://127.0.0.1:5000";

const api = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
    timeout: 5000,
});

/* ── LocalStorage helpers (fallback) ──────────────────────────────────── */
const LS_KEY = "focustasks_local";

function readLocal() {
    try {
        return JSON.parse(localStorage.getItem(LS_KEY)) || [];
    } catch {
        return [];
    }
}
function writeLocal(tasks) {
    localStorage.setItem(LS_KEY, JSON.stringify(tasks));
}

/* ── Public API functions ─────────────────────────────────────────────── */

export async function fetchTasks() {
    try {
        const { data } = await api.get("/tasks");
        writeLocal(data); // cache
        return data;
    } catch {
        console.warn("API unreachable — using local storage fallback");
        return readLocal();
    }
}

export async function createTask(task) {
    try {
        const { data } = await api.post("/tasks", task);
        return data;
    } catch {
        // Offline fallback – generate a temp id
        const tasks = readLocal();
        const newTask = {
            ...task,
            id: Date.now(),
            completed: false,
            created_at: new Date().toISOString(),
        };
        tasks.unshift(newTask);
        writeLocal(tasks);
        return newTask;
    }
}

export async function updateTask(id, updates) {
    try {
        const { data } = await api.put(`/tasks/${id}`, updates);
        return data;
    } catch {
        const tasks = readLocal().map((t) =>
            t.id === id ? { ...t, ...updates } : t
        );
        writeLocal(tasks);
        return tasks.find((t) => t.id === id);
    }
}

export async function toggleComplete(id) {
    try {
        const { data } = await api.patch(`/tasks/${id}/complete`);
        return data;
    } catch {
        const tasks = readLocal().map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
        );
        writeLocal(tasks);
        return tasks.find((t) => t.id === id);
    }
}

export async function deleteTask(id) {
    try {
        await api.delete(`/tasks/${id}`);
    } catch {
        const tasks = readLocal().filter((t) => t.id !== id);
        writeLocal(tasks);
    }
}
