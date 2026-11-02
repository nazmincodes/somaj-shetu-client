"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import PrivateRoute from "@/components/PrivateRoute";
import PageHeader from "@/components/PageHeader";
import EventForm from "@/components/EventForm";

export default function CreateEventPage() {
  const router = useRouter();

  const handleCreate = async (values) => {
    const res = await api("/events", { method: "POST", body: values, auth: true });
    toast.success(res.message);
    router.push("/events");
  };

  return (
    <PrivateRoute>
      <PageHeader title="Create an Event" subtitle="Tell volunteers what you are planning. Only future dates are allowed." />
      <section className="section-y">
        <div className="container-x">
          <EventForm onSubmit={handleCreate} submitLabel="Create Event" />
        </div>
      </section>
    </PrivateRoute>
  );
}
