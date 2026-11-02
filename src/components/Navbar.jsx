"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaBars, FaCirclePlus, FaListCheck, FaCalendarCheck, FaRegUser, FaRightFromBracket } from "react-icons/fa6";
import { authClient } from "@/lib/auth-client";
import Logo from "./Logo";
import Avatar from "./Avatar";
import ThemeToggle from "./ThemeToggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Upcoming Events" },
];

const privateLinks = [
  { href: "/create-event", label: "Create Event", icon: FaCirclePlus },
  { href: "/manage-events", label: "Manage Events", icon: FaListCheck },
  { href: "/joined-events", label: "Joined Events", icon: FaCalendarCheck },
  { href: "/profile", label: "My Profile", icon: FaRegUser },
];

const closeMenu = () => document.activeElement?.blur();

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("You have been logged out");
          router.push("/");
        },
      },
    });
  };

  const linkClass = (href) =>
    `rounded-full px-4 py-2 text-sm font-semibold transition ${
      pathname === href ? "bg-primary/15 text-primary" : "hover:bg-base-200"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-base-300/70 bg-base-100/80 backdrop-blur-lg">
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle" aria-label="Open menu">
              <FaBars />
            </div>
            <ul tabIndex={0} className="menu dropdown-content z-10 mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={closeMenu} className={pathname === l.href ? "menu-active" : ""}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Logo />
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={linkClass(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isPending ? (
            <div className="skeleton h-10 w-24 rounded-full" />
          ) : !user ? (
            <Link href="/login" className="btn-main btn-sm h-10 min-h-10">
              Login
            </Link>
          ) : (
            <>
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="tooltip tooltip-bottom block"
                  data-tip={user.name}
                  aria-label="Account menu"
                >
                  <Avatar user={user} />
                </div>
                <ul tabIndex={0} className="menu dropdown-content z-10 mt-4 w-60 rounded-box border border-base-300 bg-base-100 p-2 shadow-xl">
                  <li className="menu-title truncate">{user.email}</li>
                  {privateLinks.map(({ href, label, icon: Icon }) => (
                    <li key={href}>
                      <Link href={href} onClick={closeMenu} className={pathname === href ? "menu-active" : ""}>
                        <Icon /> {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={handleLogout} className="btn btn-outline btn-sm h-10 min-h-10 rounded-full">
                <FaRightFromBracket />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
