"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaCalendarDays, FaLocationDot, FaUsers, FaCircleCheck } from "react-icons/fa6";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { formatDate, isPast } from "@/lib/format";
import Avatar from "@/components/Avatar";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api(`/events/${id}`).then(setEvent).catch((e) => setError(e.message));
  }, [id]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!session) { setJoined(false); return; }
    api(`/joins/status/${id}`, { auth: true }).then((r) => setJoined(r.joined)).catch(() => {});
  }, [session, id]);

  const handleJoin = async () => {
    if (!session) {
      toast.error("Please log in to join this event");
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setBusy(true);
    try {
      const res = await api(`/joins/${id}`, { method: "POST", auth: true });
      toast.success(res.message);
      setJoined(true);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleLeave = async () => {
    const confirm = await Swal.fire({
      title: "Leave this event?",
      text: "You can join again any time before it starts.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, leave",
      confirmButtonColor: "#d9534f",
    });
    if (!confirm.isConfirmed) return;
    setBusy(true);
    try {
      const res = await api(`/joins/${id}`, { method: "DELETE", auth: true });
      toast.success(res.message);
      setJoined(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (error) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-2xl font-bold">{error}</h1>
        <Link href="/events" className="btn-main mt-6">Browse Events</Link>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container-x space-y-6 py-12">
        <div className="skeleton h-80 w-full" />
        <div className="skeleton h-8 w-1/2" />
        <div className="skeleton h-24 w-full" />
      </div>
    );
  }

  const ended = isPast(event.eventDate);

  return (
    <div className="container-x py-10">
      <div className="overflow-hidden rounded-[2rem] border border-base-300 bg-base-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.thumbnail} alt={event.title} className="h-64 w-full object-cover sm:h-96" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="badge badge-primary font-semibold">{event.eventType}</span>
            {ended && <span className="badge badge-error badge-soft font-semibold">Event ended</span>}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{event.title}</h1>
          <p className="whitespace-pre-line text-lg leading-relaxed text-base-content/80">{event.description}</p>

          <div className="flex items-center gap-3 border-t border-base-300 pt-5">
            <Avatar user={{ name: event.creatorName, image: event.creatorImage }} />
            <div>
              <p className="text-sm text-base-content/60">Organised by</p>
              <p className="font-semibold">{event.creatorName || event.creatorEmail}</p>
            </div>
          </div>
        </div>

        <aside className="card-soft h-fit space-y-5 p-6 shadow-lg lg:sticky lg:top-24">
          <ul className="space-y-4">
            <li className="flex items-start gap-3"><FaCalendarDays className="mt-1 text-primary" /><div><p className="text-xs text-base-content/60">Date and time</p><p className="font-semibold">{formatDate(event.eventDate)}</p></div></li>
            <li className="flex items-start gap-3"><FaLocationDot className="mt-1 text-primary" /><div><p className="text-xs text-base-content/60">Location</p><p className="font-semibold">{event.location}</p></div></li>
            <li className="flex items-start gap-3"><FaUsers className="mt-1 text-primary" /><div><p className="text-xs text-base-content/60">Volunteers</p><p className="font-semibold">{event.participants || 0} joined</p></div></li>
          </ul>

          {ended ? (
            <button disabled className="btn w-full rounded-full">This event has ended</button>
          ) : joined ? (
            <div className="space-y-2">
              <button disabled className="btn btn-success w-full rounded-full"><FaCircleCheck /> You have joined</button>
              <button onClick={handleLeave} disabled={busy} className="btn btn-ghost btn-sm w-full text-error">Leave event</button>
            </div>
          ) : (
            <button onClick={handleJoin} disabled={busy || isPending} className="btn-main w-full">
              {busy && <span className="loading loading-spinner loading-sm" />} Join Event
            </button>
          )}
          {!session && !isPending && !ended && (
            <p className="text-center text-xs text-base-content/60">You need to log in before joining.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
