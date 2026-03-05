/**
 * TaskCard.jsx — Displays a single task with actions.
 *
 * Props:
 *   task          — the task object
 *   onToggle(id)  — toggle completion
 *   onEdit(task)  — enter edit mode
 *   onDelete(id)  — delete task
 */

import { HiOutlinePencilSquare, HiOutlineTrash, HiCalendarDays } from "react-icons/hi2";

/* Priority badge colour map */
const BADGE = {
    High: "bg-red-50 text-red-600 ring-red-200",
    Medium: "bg-amber-50 text-amber-600 ring-amber-200",
    Low: "bg-emerald-50 text-emerald-600 ring-emerald-200",
};

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
    const { id, title, priority, due_date, completed } = task;

    return (
        <div
            className={`card-lift group bg-card rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-4
        ${completed ? "opacity-50" : ""}`}
        >
            {/* Checkbox */}
            <button
                onClick={() => onToggle(id)}
                aria-label="Toggle complete"
                className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border-2 transition-all duration-200 cursor-pointer
          ${completed
                        ? "bg-primary-600 border-primary-600"
                        : "border-gray-300 hover:border-primary-400"
                    }`}
            >
                {completed && (
                    <svg viewBox="0 0 12 10" className="w-3 h-3 mx-auto text-white">
                        <path
                            d="M1 5.5l3 3L11 1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                )}
            </button>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <p
                    className={`text-sm font-medium leading-snug ${completed ? "line-through text-gray-400" : "text-gray-800"
                        }`}
                >
                    {title}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    {/* Priority badge */}
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-semibold ring-1 ring-inset ${BADGE[priority] || BADGE.Medium}`}
                    >
                        {priority}
                    </span>

                    {/* Due date */}
                    {due_date && (
                        <span className="inline-flex items-center gap-1 text-gray-400">
                            <HiCalendarDays className="text-sm" />
                            {new Date(due_date + "T00:00:00").toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                            })}
                        </span>
                    )}
                </div>
            </div>

            {/* Action buttons — visible on hover */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                    onClick={() => onEdit(task)}
                    aria-label="Edit"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition cursor-pointer"
                >
                    <HiOutlinePencilSquare className="text-lg" />
                </button>
                <button
                    onClick={() => onDelete(id)}
                    aria-label="Delete"
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                >
                    <HiOutlineTrash className="text-lg" />
                </button>
            </div>
        </div>
    );
}
