"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { validateEmail } from "@/lib/validators";
import { safeRedirect } from "@/lib/format";
import { Field, PasswordInput } from "@/components/Field";
import SocialLogin from "@/components/SocialLogin";

function LoginForm() {
  const router = useRouter();
  const redirectTo = safeRedirect(useSearchParams().get("redirect"));
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const change = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {
      email: validateEmail(form.email),
      password: form.password ? "" : "Password is required",
    };
    setErrors(found);
    if (found.email || found.password) {
      toast.error(found.email || found.password);
      return;
    }
    setLoading(true);
    const { error } = await authClient.signIn.email({ email: form.email, password: form.password });
    setLoading(false);
    if (error) {
      toast.error(error.message || "Invalid email or password");
      return;
    }
    toast.success("Welcome back! Login successful.");
    router.replace(redirectTo);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <Field label="Email" error={errors.email}>
        <input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com" autoComplete="email" className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`} />
      </Field>
      <Field label="Password" error={errors.password}>
        <PasswordInput value={form.password} onChange={change} autoComplete="current-password" />
      </Field>
      <button type="submit" disabled={loading} className="btn-main w-full">
        {loading && <span className="loading loading-spinner loading-sm" />} Login
      </button>
      <div className="divider text-sm text-base-content/50">or</div>
      <SocialLogin redirectTo={redirectTo} />
      <p className="text-center text-sm text-base-content/70">
        New here?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
      </p>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-mesh">
      <div className="container-x grid min-h-[75vh] items-center gap-12 py-14 lg:grid-cols-2">
        <div className="hidden space-y-4 lg:block">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
            Welcome back, <span className="text-primary">changemaker</span>.
          </h1>
          <p className="max-w-md text-lg text-base-content/70">
            Log in to join events, track your volunteering and host new service drives in your area.
          </p>
        </div>
        <div className="card-soft mx-auto w-full max-w-md p-6 shadow-xl sm:p-8">
          <h2 className="mb-6 text-2xl font-extrabold">Login to your account</h2>
          <Suspense fallback={<div className="skeleton h-64 w-full" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
