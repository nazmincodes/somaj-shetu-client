import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center py-20 text-center">
      <div>
        <p className="text-7xl font-extrabold text-primary">404</p>
        <h1 className="mt-4 text-2xl font-bold">This page could not be found</h1>
        <p className="mt-2 text-base-content/70">The link may be broken or the page may have been removed.</p>
        <Link href="/" className="btn-main mt-6">Back to Home</Link>
      </div>
    </div>
  );
}
