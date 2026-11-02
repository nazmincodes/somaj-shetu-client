import Link from "next/link";
import { FaHandHoldingHeart } from "react-icons/fa6";
import { SITE_NAME } from "@/lib/constants";

export default function Logo({ light = false }) {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/30">
        <FaHandHoldingHeart className="text-lg" />
      </span>
      <span className={`text-xl font-extrabold tracking-tight ${light ? "text-neutral-content" : ""}`}>
        {SITE_NAME}
      </span>
    </Link>
  );
}
