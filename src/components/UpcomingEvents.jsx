"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import { api } from "@/lib/api";
import EventCard from "./EventCard";
import { EventGridSkeleton } from "./Skeletons";

export default function UpcomingEvents() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/events?limit=6").then(setEvents).catch((e) => setError(e.message));
  }, []);

  return (
    <section className="section-y">
      <div className="container-x">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="section-title">Upcoming events near you</h2>
            <p className="section-sub">The soonest service events that still need volunteers.</p>
          </div>
          <Link href="/events" className="btn btn-outline rounded-full px-6 font-semibold">
            View all events <FaArrowRight />
          </Link>
        </div>

        {error ? (
          <div role="alert" className="alert alert-error alert-soft">{error}</div>
        ) : !events ? (
          <EventGridSkeleton />
        ) : events.length === 0 ? (
          <div className="card-soft p-10 text-center">
            <p className="text-lg font-semibold">No upcoming events yet</p>
            <p className="mt-1 text-base-content/70">Be the first to host one in your neighbourhood.</p>
            <Link href="/create-event" className="btn-main mt-5">Create an Event</Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (<EventCard key={event._id} event={event} />))}
          </div>
        )}
      </div>
    </section>
  );
}
