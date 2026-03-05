/**
 * TaskForm.jsx — Input form for creating & editing tasks.
 *
 * Props:
 *   onSubmit(taskData)  — called with { title, priority, due_date }
 *   initial             — optional object to pre-fill fields (edit mode)
 *   onCancel            — if provided, shows a Cancel button (edit mode)
 */

import { useState, useEffect } from "react";
import { HiPlus, HiPencil } from "react-icons/hi2";

const PRIORITIES = ["Low", "Medium", "High"];

export default function TaskForm({ onSubmit, initial = null, onCancel }) {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");

    // Pre-fill values when editing
    useEffect(() => {
        if (initial) {
            setTitle(initial.title || "");
            setPriority(initial.priority || "Medium");
            setDueDate(initial.due_date || "");
        }
    }, [initial]);

    function handleSubmit(e) {
        e.preventDefault();
        if (!title.trim()) return;
        onSubmit({
            title: title.trim(),
            priority,
            due_date: dueDate || null,
        });
        // Reset only in create mode
        if (!initial) {
            setTitle("");
            setPriority("Medium");
            setDueDate("");
        }
    }

    const isEdit = !!initial;

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-card rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col sm:flex-row gap-3 items-end"
        >
            {/* Title */}
            <div className="flex-1 w-full">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Task
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400
                     transition placeholder:text-gray-300"
                />
            </div>

            {/* Priority */}
            <div className="w-full sm:w-36">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Priority
                </label>
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm bg-white
                     focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400
                     transition cursor-pointer"
                >
                    {PRIORITIES.map((p) => (
                        <option key={p} value={p}>
                            {p}
                        </option>
                    ))}
                </select>
            </div>

            {/* Due date */}
            <div className="w-full sm:w-44">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Due Date
                </label>
                <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-primary-400/40 focus:border-primary-400
                     transition"
                />
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 bg-primary-600 hover:bg-primary-700
                     text-white rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md
                     shadow-primary-300/30 hover:shadow-lg hover:shadow-primary-400/30
                     transition-all duration-200 cursor-pointer whitespace-nowrap"
                >
                    {isEdit ? <HiPencil className="text-base" /> : <HiPlus className="text-base" />}
                    {isEdit ? "Save" : "Add Task"}
                </button>
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium
                       text-gray-500 hover:bg-gray-100 transition cursor-pointer"
                    >
                        Cancel
                    </button>
                )}
            </div>
        </form>
    );
}
