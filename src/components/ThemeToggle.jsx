"use client";

import { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

export default function ThemeToggle() {
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme") || "civic");
  }, []);

  const toggle = () => {
    const next = theme === "civic" ? "civicdark" : "civic";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle light and dark theme"
      className="btn btn-ghost btn-circle"
    >
      {theme === "civicdark" ? <FaSun className="text-lg text-secondary" /> : <FaMoon className="text-lg" />}
    </button>
  );
}
