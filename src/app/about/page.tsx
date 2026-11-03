import Link from "next/link";

export const metadata = { title: "About Us | StudioSpace" };

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      <h1 className="section-title mb-6">About StudioSpace</h1>
      <div className="space-y-4 leading-relaxed text-base-content/80">
        <p>
          StudioSpace is a peer-to-peer marketplace for creative spaces. Photographers, filmmakers,
          podcasters and musicians find the right room, and studio owners turn quiet hours into income.
        </p>
        <p>
          We believe great work needs the right setting. That is why every listing shows honest photos,
          clear hourly pricing, a refundable deposit and a full list of amenities before you book.
        </p>
        <p>
          Whether you need a white cyc wall for a product shoot or a quiet lounge for your next episode,
          you can discover it, book it and start creating in minutes.
        </p>
      </div>
      <div className="mt-8 flex gap-3">
        <Link href="/studios" className="btn btn-primary">
          Explore Studios
        </Link>
        <Link href="/add-studio" className="btn btn-outline">
          Host Your Space
        </Link>
      </div>
    </section>
  );
}
