import Link from "next/link";
import { FaXTwitter, FaFacebookF, FaInstagram, FaLinkedinIn, FaGithub, FaLocationDot, FaEnvelope, FaPhone } from "react-icons/fa6";
import Logo from "./Logo";

const socials = [
  { icon: FaXTwitter, label: "X", href: "https://x.com" },
  { icon: FaFacebookF, label: "Facebook", href: "https://facebook.com" },
  { icon: FaInstagram, label: "Instagram", href: "https://instagram.com" },
  { icon: FaLinkedinIn, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: FaGithub, label: "GitHub", href: "https://github.com" },
];

export default function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden bg-neutral text-neutral-content">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />

      <div className="container-x relative grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Logo light />
          <p className="text-sm leading-relaxed text-neutral-content/70">
            A neighbourhood-first platform where people organise and join social service events
            — from winter clothes drives to tree plantation days.
          </p>
          <div className="flex gap-2">
            {socials.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition hover:-translate-y-1 hover:bg-primary hover:text-primary-content"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-white">Explore</h3>
          <ul className="space-y-2 text-sm text-neutral-content/70">
            <li><Link className="hover:text-primary" href="/">Home</Link></li>
            <li><Link className="hover:text-primary" href="/events">Upcoming Events</Link></li>
            <li><Link className="hover:text-primary" href="/create-event">Create an Event</Link></li>
            <li><Link className="hover:text-primary" href="/joined-events">Joined Events</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-white">Event Types</h3>
          <ul className="space-y-2 text-sm text-neutral-content/70">
            <li>Cleanup Drives</li>
            <li>Plantation Days</li>
            <li>Food and Clothes Donation</li>
            <li>Blood and Health Camps</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-lg font-bold text-white">Contact</h3>
          <ul className="space-y-3 text-sm text-neutral-content/70">
            <li className="flex items-start gap-3"><FaLocationDot className="mt-1 text-primary" /> House 12, Road 5, Mirpur 10, Dhaka</li>
            <li className="flex items-center gap-3"><FaEnvelope className="text-primary" /> hello@shomajsetu.org</li>
            <li className="flex items-center gap-3"><FaPhone className="text-primary" /> +880 1700-000000</li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/10 py-5 text-center text-sm text-neutral-content/60">
        © {new Date().getFullYear()} Shomaj Setu. Made with care for our communities.
      </div>
    </footer>
  );
}
