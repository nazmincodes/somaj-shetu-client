import Link from "next/link";
import { FaArrowRight, FaCalendarDays, FaLocationDot, FaUsers, FaLeaf } from "react-icons/fa6";

export default function Hero() {
  return (
    <section className="bg-mesh relative overflow-hidden">
      <div className="container-x grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-2">
        <div className="space-y-6">
          <span className="badge badge-primary badge-outline gap-2 px-4 py-4 font-semibold">
            <FaLeaf /> Community-driven service events
          </span>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Small hands, <span className="text-primary">big change</span> for our neighbourhood.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-base-content/70">
            Find a winter clothes drive near you, organise a cleanup in your area, or join a
            blood donation camp. Shomaj Setu connects willing volunteers with the people who need them.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/events" className="btn-main">
              Explore Events <FaArrowRight />
            </Link>
            <Link href="/create-event" className="btn btn-outline rounded-full px-6 font-semibold">
              Host an Event
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 pt-2 text-sm font-medium text-base-content/70">
            <span>✔ Free to join</span>
            <span>✔ Local and verified organisers</span>
            <span>✔ One-click volunteering</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/20 blur-2xl" />
          <div className="float-slow card-soft space-y-4 p-6 shadow-2xl">
            <span className="badge badge-secondary font-semibold">Donation</span>
            <h3 className="text-xl font-bold">Winter Clothes Distribution</h3>
            <ul className="space-y-2 text-sm text-base-content/70">
              <li className="flex items-center gap-2"><FaLocationDot className="text-primary" /> Mirpur 10, Dhaka</li>
              <li className="flex items-center gap-2"><FaCalendarDays className="text-primary" /> Saturday, 10:00 AM</li>
              <li className="flex items-center gap-2"><FaUsers className="text-primary" /> 48 volunteers joined</li>
            </ul>
            <div className="h-2 overflow-hidden rounded-full bg-base-300">
              <div className="h-full w-4/5 rounded-full bg-primary" />
            </div>
            <p className="text-xs text-base-content/60">80% of volunteer spots filled</p>
          </div>
          <div className="float-slower card-soft absolute -bottom-8 -left-4 flex items-center gap-3 px-4 py-3 shadow-xl sm:-left-10">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-success/20 text-success">✔</span>
            <div>
              <p className="text-sm font-bold">You joined!</p>
              <p className="text-xs text-base-content/60">See you on Saturday</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
