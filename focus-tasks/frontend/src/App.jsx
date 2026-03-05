/**
 * App.jsx — Root shell: Navbar + Home page.
 */

import Home from "./pages/Home";
import { HiCheckBadge } from "react-icons/hi2";

export default function App() {
  return (
    <div className="min-h-dvh bg-surface">
      {/* ── Navbar ───────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-2">
          <HiCheckBadge className="text-primary-600 text-2xl" />
          <span className="text-lg font-bold tracking-tight text-gray-800">
            FocusTasks
          </span>
        </div>
      </nav>

      {/* ── Page content ─────────────────────────────────────────────── */}
      <Home />
    </div>
  );
}
