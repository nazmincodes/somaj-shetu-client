"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { isValidUrl } from "@/lib/validators";
import PrivateRoute from "@/components/PrivateRoute";
import PageHeader from "@/components/PageHeader";
import Avatar from "@/components/Avatar";
import { Field } from "@/components/Field";

function ProfileForm() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [form, setForm] = useState({ name: "", image: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || "", image: user.image || "" });
  }, [user]);

  const change = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((er) => ({ ...er, [e.target.name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = {
      name: form.name.trim().length < 2 ? "Please enter your name" : "",
      image: isValidUrl(form.image.trim()) ? "" : "Please enter a valid photo URL",
    };
    setErrors(found);
    if (found.name || found.image) {
      toast.error(found.name || found.image);
      return;
    }
    setSaving(true);
    const { error } = await authClient.updateUser({ name: form.name.trim(), image: form.image.trim() });
    setSaving(false);
    if (error) toast.error(error.message || "Could not update your profile");
    else toast.success("Profile updated successfully");
  };

  return (
    <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
      <div className="card-soft flex flex-col items-center gap-3 p-8 text-center md:col-span-1">
        <Avatar user={{ name: form.name, image: isValidUrl(form.image) ? form.image : "" }} size="w-28" />
        <h2 className="mt-2 text-xl font-bold">{user?.name}</h2>
        <p className="break-all text-sm text-base-content/60">{user?.email}</p>
      </div>
      <form onSubmit={handleSubmit} noValidate className="card-soft space-y-5 p-6 sm:p-8 md:col-span-2">
        <Field label="Display name" error={errors.name}>
          <input name="name" value={form.name} onChange={change} className={`input input-bordered w-full ${errors.name ? "input-error" : ""}`} />
        </Field>
        <Field label="Profile photo URL" error={errors.image}>
          <input name="image" value={form.image} onChange={change} placeholder="https://..." className={`input input-bordered w-full ${errors.image ? "input-error" : ""}`} />
        </Field>
        <Field label="Email">
          <input value={user?.email || ""} disabled className="input input-bordered w-full" />
        </Field>
        <button type="submit" disabled={saving} className="btn-main">
          {saving && <span className="loading loading-spinner loading-sm" />} Save Changes
        </button>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <PrivateRoute>
      <PageHeader title="My Profile" subtitle="Update your name and profile picture." />
      <section className="section-y">
        <div className="container-x"><ProfileForm /></div>
      </section>
    </PrivateRoute>
  );
}
