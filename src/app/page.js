import Hero from "@/components/Hero";
import Features from "@/components/Features";
import UpcomingEvents from "@/components/UpcomingEvents";
import Gallery from "@/components/Gallery";
import Newsletter from "@/components/Newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <UpcomingEvents />
      <Features />
      <Gallery />
      <Newsletter />
    </>
  );
}
