/**
 * FilterBar.jsx — Filter toggle for All / Pending / Completed tasks.
 */

const FILTERS = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "completed", label: "Completed" },
];

export default function FilterBar({ current, onChange }) {
    return (
        <div className="flex gap-2">
            {FILTERS.map(({ key, label }) => (
                <button
                    key={key}
                    onClick={() => onChange(key)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
            ${current === key
                            ? "bg-primary-600 text-white shadow-md shadow-primary-300/40"
                            : "bg-white text-gray-500 hover:text-primary-600 hover:bg-primary-50 border border-gray-200"
                        }`}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
