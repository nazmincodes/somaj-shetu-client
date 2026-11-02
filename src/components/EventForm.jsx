"use client";

import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { EVENT_TYPES } from "@/lib/constants";
import { validateEvent, isValidUrl } from "@/lib/validators";
import { toLocalInput } from "@/lib/format";
import { Field } from "./Field";

export default function EventForm({ initial, onSubmit, submitLabel }) {
  const [values, setValues] = useState({
    title: initial?.title || "",
    description: initial?.description || "",
    eventType: initial?.eventType || "",
    thumbnail: initial?.thumbnail || "",
    location: initial?.location || "",
    eventDate: initial?.eventDate ? toLocalInput(initial.eventDate) : "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const minDate = useMemo(() => toLocalInput(new Date()), []);

  const change = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validateEvent(values);
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({ ...values, eventDate: new Date(values.eventDate).toISOString() });
    } catch (err) {
      if (err.errors) setErrors(err.errors);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const input = (name) =>
    `input input-bordered w-full ${errors[name] ? "input-error" : ""}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-5">
      <div className="card-soft space-y-5 p-6 sm:p-8 lg:col-span-3">
        <Field label="Event title" error={errors.title}>
          <input name="title" value={values.title} onChange={change} placeholder="e.g. Winter Clothes Distribution" className={input("title")} />
        </Field>

        <Field label="Description" error={errors.description}>
          <textarea
            name="description"
            value={values.description}
            onChange={change}
            rows={5}
            placeholder="What will volunteers do? What should they bring?"
            className={`textarea textarea-bordered w-full ${errors.description ? "textarea-error" : ""}`}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Event type" error={errors.eventType}>
            <select name="eventType" value={values.eventType} onChange={change} className={`select select-bordered w-full ${errors.eventType ? "select-error" : ""}`}>
              <option value="" disabled>Select a type</option>
              {EVENT_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
          </Field>
          <Field label="Date and time" error={errors.eventDate}>
            <input type="datetime-local" name="eventDate" min={minDate} value={values.eventDate} onChange={change} className={input("eventDate")} />
          </Field>
        </div>

        <Field label="Location" error={errors.location}>
          <input name="location" value={values.location} onChange={change} placeholder="e.g. Mirpur 10, Dhaka" className={input("location")} />
        </Field>

        <Field label="Thumbnail image URL" error={errors.thumbnail}>
          <input name="thumbnail" value={values.thumbnail} onChange={change} placeholder="https://..." className={input("thumbnail")} />
        </Field>

        <button type="submit" disabled={submitting} className="btn-main w-full sm:w-auto">
          {submitting && <span className="loading loading-spinner loading-sm" />}
          {submitLabel}
        </button>
      </div>

      <aside className="lg:col-span-2">
        <div className="card-soft sticky top-24 overflow-hidden">
          <div className="grid h-56 place-items-center bg-base-200 text-sm text-base-content/50">
            {isValidUrl(values.thumbnail) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={values.thumbnail} alt="Thumbnail preview" className="h-full w-full object-cover" />
            ) : (
              "Thumbnail preview appears here"
            )}
          </div>
          <div className="space-y-1 p-5">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">{values.eventType || "Event type"}</p>
            <h3 className="text-lg font-bold">{values.title || "Your event title"}</h3>
            <p className="text-sm text-base-content/70">{values.location || "Event location"}</p>
          </div>
        </div>
      </aside>
    </form>
  );
}
