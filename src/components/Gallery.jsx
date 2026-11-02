"use client";

import { useState } from "react";
import { FaImage } from "react-icons/fa6";

// Put your own photos in /public/gallery as g1.jpg ... g8.jpg
const items = [
  { src: "/gallery/g1.jpg", caption: "Winter clothes drive, Mirpur" },
  { src: "/gallery/g2.jpg", caption: "Lake cleanup volunteers" },
  { src: "/gallery/g3.jpg", caption: "Planting saplings together" },
  { src: "/gallery/g4.jpg", caption: "Blanket distribution night" },
  { src: "/gallery/g5.jpg", caption: "Free health checkup camp" },
  { src: "/gallery/g6.jpg", caption: "Teaching hour for children" },
  { src: "/gallery/g7.jpg", caption: "Blood donation camp" },
  { src: "/gallery/g8.jpg", caption: "Sharing hot meals" },
];

function Tile({ src, caption }) {
  const [failed, setFailed] = useState(false);
  return (
    <figure className="group relative aspect-square overflow-hidden rounded-box bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30">
      {failed ? (
        <div className="grid h-full w-full place-items-center text-4xl text-base-content/30"><FaImage /></div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={caption} onError={() => setFailed(true)} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
      )}
      <figcaption className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-4 text-sm font-medium text-white transition duration-300 group-hover:translate-y-0">
        {caption}
      </figcaption>
    </figure>
  );
}

export default function Gallery() {
  return (
    <section className="section-y bg-base-200/60">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-title">Moments of kindness</h2>
          <p className="section-sub mx-auto">A look at what our volunteers have done together, one neighbourhood at a time.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {items.map((item) => (<Tile key={item.src} {...item} />))}
        </div>
      </div>
    </section>
  );
}
