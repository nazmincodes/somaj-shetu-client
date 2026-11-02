"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { validateEmail, validatePassword, isValidUrl } from "@/lib/validators";
import { Field, PasswordInput } from "@/components/Field";
import SocialLogin from "@/components/SocialLogin";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", photoURL: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {
      name: form.name.trim().length < 2 ? "Please enter your name" : "",
      email: validateEmail(form.email),
      photoURL: isValidUrl(form.photoURL.trim()) ? "" : "Please enter a valid photo URL",
      password: validatePassword(form.password),
    };
    setErrors(found);
    const firstError = Object.values(found).find(Boolean);
    if (firstError) {
      toast.error(firstError);
      return;
    }
    setLoading(true);
    const { error } = await authClient.signUp.email({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      image: form.photoURL.trim(),
    });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Registration failed. Please try again.");
      return;
    }
    toast.success("Account created! Welcome to Shomaj Setu.");
    router.replace("/");
  };

  const cls = (n) => `input input-bordered w-full ${errors[n] ? "input-error" : ""}`;

  return (
    <div className="bg-mesh">
      <div className="container-x grid min-h-[75vh] items-center gap-12 py-14 lg:grid-cols-2">
        <div className="hidden space-y-4 lg:block">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
            Start serving your <span className="text-primary">community</span> today.
          </h1>
          <p className="max-w-md text-lg text-base-content/70">
            Create a free account to host events, join drives and see the difference you make.
          </p>
        </div>
        <div className="card-soft mx-auto w-full max-w-md p-6 shadow-xl sm:p-8">
          <h2 className="mb-6 text-2xl font-extrabold">Create your account</h2>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Field label="Name" error={errors.name}>
              <input name="name" value={form.name} onChange={change} placeholder="Your full name" autoComplete="name" className={cls("name")} />
            </Field>
            <Field label="Email" error={errors.email}>
              <input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" autoComplete="email" className={cls("email")} />
            </Field>
            <Field label="Photo URL" error={errors.photoURL}>
              <input name="photoURL" value={form.photoURL} onChange={change} placeholder="https://..." className={cls("photoURL")} />
            </Field>
            <Field label="Password" error={errors.password}>
              <PasswordInput value={form.password} onChange={change} placeholder="Min 6 chars, upper and lower case" autoComplete="new-password" />
            </Field>
            <button type="submit" disabled={loading} className="btn-main w-full">
              {loading && <span className="loading loading-spinner loading-sm" />} Register
            </button>
            <div className="divider text-sm text-base-content/50">or</div>
            <SocialLogin />
            <p className="text-center text-sm text-base-content/70">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold text-primary hover:underline">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}