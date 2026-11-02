"use client";

import toast from "react-hot-toast";
import { FaPaperPlane } from "react-icons/fa6";

export default function Newsletter() {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Thank you! You are on the list for new events.");
    e.currentTarget.reset();
  };

  return (
    <section className="section-y">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2rem] bg-neutral px-6 py-14 text-center text-neutral-content sm:px-12">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-secondary/30 blur-3xl" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Never miss a chance to help</h2>
            <p className="mx-auto mt-3 max-w-xl text-neutral-content/70">
              Get a short weekly note with the newest service events in your city. No spam, ever.
            </p>
            <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row">
              <input type="email" required placeholder="Your email address" className="input input-bordered w-full rounded-full bg-base-100 text-base-content" />
              <button type="submit" className="btn-main shrink-0">
                Subscribe <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
