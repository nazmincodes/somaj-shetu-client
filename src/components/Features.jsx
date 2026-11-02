import { FaCirclePlus, FaHandHoldingHeart, FaCalendarCheck, FaMagnifyingGlass, FaShieldHalved, FaPalette } from "react-icons/fa6";

const features = [
  { icon: FaCirclePlus, title: "Create in minutes", text: "Set a title, location, date and photo and your service event is live for everyone nearby." },
  { icon: FaHandHoldingHeart, title: "Join with one click", text: "Found something meaningful? Join instantly and let the organiser know you are coming." },
  { icon: FaCalendarCheck, title: "Track what you joined", text: "Your joined events are listed in date order so you never miss a day of service." },
  { icon: FaMagnifyingGlass, title: "Search and filter", text: "Look up events by area or type, such as cleanup, plantation or donation drives." },
  { icon: FaShieldHalved, title: "Secure by design", text: "Protected actions use signed tokens, and only you can edit or delete your own events." },
  { icon: FaPalette, title: "Light and dark mode", text: "Switch themes any time. The whole platform adapts to your eyes and your device." },
];

export default function Features() {
  return (
    <section className="section-y bg-base-200/60">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Everything you need to serve together</h2>
          <p className="section-sub mx-auto">From the first idea to the last volunteer, the platform keeps every event simple and organised.</p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card-soft h-full space-y-4 p-6 hover:-translate-y-1 hover:shadow-lg">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-xl text-primary">
                <Icon />
              </span>
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="leading-relaxed text-base-content/70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
