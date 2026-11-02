"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { FaPenToSquare, FaTrashCan, FaCirclePlus } from "react-icons/fa6";
import { api } from "@/lib/api";
import { formatDate, isPast } from "@/lib/format";
import PrivateRoute from "@/components/PrivateRoute";
import PageHeader from "@/components/PageHeader";
import { TableSkeleton } from "@/components/Skeletons";

function ManageList() {
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api("/events/mine", { auth: true }).then(setEvents).catch((e) => setError(e.message));
  }, []);

  const handleDelete = async (event) => {
    const result = await Swal.fire({
      title: "Delete this event?",
      text: `"${event.title}" and its volunteer list will be removed permanently.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      confirmButtonColor: "#d9534f",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await api(`/events/${event._id}`, { method: "DELETE", auth: true });
      toast.success(res.message);
      setEvents((list) => list.filter((e) => e._id !== event._id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (error) return <div role="alert" className="alert alert-error alert-soft">{error}</div>;
  if (!events) return <TableSkeleton />;

  if (events.length === 0) {
    return (
      <div className="card-soft p-12 text-center">
        <p className="text-lg font-semibold">You have not created any events yet</p>
        <p className="mt-1 text-base-content/70">Your events will appear here so you can update or delete them.</p>
        <Link href="/create-event" className="btn-main mt-5"><FaCirclePlus /> Create an Event</Link>
      </div>
    );
  }

  return (
    <div className="card-soft overflow-x-auto">
      <table className="table">
        <thead>
          <tr><th>Event</th><th>Type</th><th>Date</th><th>Volunteers</th><th className="text-right">Actions</th></tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e._id} className="hover:bg-base-200/60">
              <td>
                <div className="flex items-center gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={e.thumbnail} alt="" className="h-12 w-16 rounded-lg object-cover" />
                  <div>
                    <Link href={`/events/${e._id}`} className="font-bold hover:text-primary">{e.title}</Link>
                    <p className="text-xs text-base-content/60">{e.location}</p>
                  </div>
                </div>
              </td>
              <td><span className="badge badge-primary badge-soft">{e.eventType}</span></td>
              <td className="whitespace-nowrap text-sm">
                {formatDate(e.eventDate)}
                {isPast(e.eventDate) && <span className="badge badge-ghost badge-sm ml-2">Ended</span>}
              </td>
              <td>{e.participants || 0}</td>
              <td>
                <div className="flex justify-end gap-2">
                  <Link href={`/manage-events/${e._id}`} className="btn btn-sm btn-outline btn-primary rounded-full"><FaPenToSquare /> Update</Link>
                  <button onClick={() => handleDelete(e)} className="btn btn-sm btn-outline btn-error rounded-full"><FaTrashCan /> Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ManageEventsPage() {
  return (
    <PrivateRoute>
      <PageHeader title="Manage Events" subtitle="Update the details of your events or remove the ones you no longer need.">
        <Link href="/create-event" className="btn-main"><FaCirclePlus /> New Event</Link>
      </PageHeader>
      <section className="section-y">
        <div className="container-x"><ManageList /></div>
      </section>
    </PrivateRoute>
  );
}
