"use client";

import { useEffect, useState } from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { api } from "@/lib/api";
import { EVENT_TYPES } from "@/lib/constants";
import PageHeader from "@/components/PageHeader";
import EventCard from "@/components/EventCard";
import { EventGridSkeleton } from "@/components/Skeletons";

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState("asc");

  useEffect(() => {
    setEvents(null);
    setError("");
    // small debounce so we do not call the API on every keystroke
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ sort, type });
      if (search.trim()) params.set("search", search.trim());
      api(`/events?${params}`).then(setEvents).catch((e) => setError(e.message));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, type, sort]);

  return (
    <>
      <PageHeader title="Upcoming Events" subtitle="Browse service events that are still to come and find one that matches your time and interest." />
      <section className="section-y">
        <div className="container-x">
          <div className="mb-10 grid gap-3 md:grid-cols-[1fr_auto_auto]">
            <label className="input input-bordered flex w-full items-center gap-3">
              <FaMagnifyingGlass className="text-base-content/50" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by title or location" className="grow" />
            </label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="select select-bordered">
              <option value="all">All event types</option>
              {EVENT_TYPES.map((t) => (<option key={t} value={t}>{t}</option>))}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="select select-bordered">
              <option value="asc">Soonest first</option>
              <option value="desc">Latest first</option>
            </select>
          </div>

          {error ? (
            <div role="alert" className="alert alert-error alert-soft">{error}</div>
          ) : !events ? (
            <EventGridSkeleton />
          ) : events.length === 0 ? (
            <div className="card-soft p-12 text-center">
              <p className="text-lg font-semibold">No upcoming events match your search</p>
              <p className="mt-1 text-base-content/70">Try a different keyword or event type.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((e) => (<EventCard key={e._id} event={e} />))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
