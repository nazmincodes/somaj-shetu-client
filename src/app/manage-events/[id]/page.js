"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import PrivateRoute from "@/components/PrivateRoute";
import PageHeader from "@/components/PageHeader";
import EventForm from "@/components/EventForm";

function EditEvent() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api(`/events/${id}`).then(setEvent).catch((e) => setError(e.message));
  }, [id]);

  const handleUpdate = async (values) => {
    const res = await api(`/events/${id}`, { method: "PUT", body: values, auth: true });
    toast.success(res.message);
    router.push("/manage-events");
  };

  if (error) return <div role="alert" className="alert alert-error alert-soft">{error}</div>;
  if (!event) return <div className="skeleton h-96 w-full" />;

  if (event.creatorEmail !== session?.user?.email) {
    return (
      <div className="card-soft p-10 text-center">
        <p className="text-lg font-semibold">You can only update events that you created</p>
        <Link href="/manage-events" className="btn-main mt-5">Back to my events</Link>
      </div>
    );
  }

  return <EventForm initial={event} onSubmit={handleUpdate} submitLabel="Save Changes" />;
}

export default function EditEventPage() {
  return (
    <PrivateRoute>
      <PageHeader title="Update Event" subtitle="Change any detail below. The new date must still be in the future." />
      <section className="section-y">
        <div className="container-x"><EditEvent /></div>
      </section>
    </PrivateRoute>
  );
}
