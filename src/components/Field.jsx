"use client";

import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

export function Field({ label, error, children }) {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-sm font-semibold">{label}</label>
      {children}
      {error && <p className="mt-1.5 text-sm font-medium text-error">{error}</p>}
    </div>
  );
}

export function PasswordInput({ value, onChange, placeholder = "Your password", name = "password", autoComplete }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="input input-bordered w-full pr-11"
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 hover:text-primary"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
}
