"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { api } from "@/lib/api";
import PrivateRoute from "@/components/PrivateRoute";
import PageHeader from "@/components/PageHeader";
import EventCard from "@/components/EventCard";
import { EventGridSkeleton } from "@/components/Skeletons";

function JoinedList() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/joins/me", { auth: true }).then(setEvents).catch((e) => setError(e.message));
  }, []);

  const handleLeave = async (event) => {
    const result = await Swal.fire({
      title: "Leave this event?",
      text: `You will no longer be listed as a volunteer for "${event.title}".`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, leave",
      confirmButtonColor: "#d9534f",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await api(`/joins/${event._id}`, { method: "DELETE", auth: true });
      toast.success(res.message);
      setEvents((list) => list.filter((e) => e._id !== event._id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (error) return <div role="alert" className="alert alert-error alert-soft">{error}</div>;
  if (!events) return <EventGridSkeleton count={3} />;

  if (events.length === 0) {
    return (
      <div className="card-soft p-12 text-center">
        <p className="text-lg font-semibold">You have not joined any events yet</p>
        <p className="mt-1 text-base-content/70">Find an event that matters to you and join with one click.</p>
        <Link href="/events" className="btn-main mt-5">Browse Events</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={event}
          extra={
            <button onClick={() => handleLeave(event)} className="btn btn-ghost btn-sm w-full text-error">
              Leave event
            </button>
          }
        />
      ))}
    </div>
  );
}

export default function JoinedEventsPage() {
  return (
    <PrivateRoute>
      <PageHeader title="Joined Events" subtitle="Every event you volunteered for, sorted by date." />
      <section className="section-y">
        <div className="container-x"><JoinedList /></div>
      </section>
    </PrivateRoute>
  );
}
