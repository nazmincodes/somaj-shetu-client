import Link from "next/link";
import { FaCalendarDays, FaLocationDot, FaUsers } from "react-icons/fa6";
import { formatDate } from "@/lib/format";

export default function EventCard({ event, extra }) {
  return (
    <article className="card-soft group flex h-full flex-col overflow-hidden hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 w-full overflow-hidden bg-base-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={event.thumbnail}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="badge badge-primary absolute left-4 top-4 font-semibold shadow">{event.eventType}</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="line-clamp-1 text-lg font-bold">{event.title}</h3>
        <ul className="space-y-2 text-sm text-base-content/70">
          <li className="flex items-center gap-2"><FaLocationDot className="shrink-0 text-primary" /><span className="line-clamp-1">{event.location}</span></li>
          <li className="flex items-center gap-2"><FaCalendarDays className="shrink-0 text-primary" />{formatDate(event.eventDate)}</li>
          <li className="flex items-center gap-2"><FaUsers className="shrink-0 text-primary" />{event.participants || 0} volunteers joined</li>
        </ul>
        <div className="mt-auto space-y-2 pt-3">
          <Link href={`/events/${event._id}`} className="btn-main w-full">
            View Event
          </Link>
          {extra}
        </div>
      </div>
    </article>
  );
}
