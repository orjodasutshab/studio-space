import { BadgeCheck, Headset, ShieldCheck, Wrench } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, title: "Liability protection", text: "Every booking is backed by clear house rules and a refundable security deposit." },
  { icon: BadgeCheck, title: "Verified profiles", text: "Hosts and creators have real profiles, so you always know who you are working with." },
  { icon: Wrench, title: "Equipment safety", text: "Hosts list their gear and amenities honestly, and we review reports quickly." },
  { icon: Headset, title: "24/7 host support", text: "Questions at midnight before a shoot? Our support team is always on." },
];

export default function HostGuarantee() {
  return (
    <section className="bg-neutral py-20 text-neutral-content">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-3 text-center">
          <h2 className="section-title">Host guarantee and creator support</h2>
          <p className="mx-auto max-w-2xl leading-relaxed opacity-75">
            Book and host with confidence. We look after the details so you can focus on the work.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex h-full flex-col gap-3 rounded-box border border-white/10 bg-white/5 p-6">
              <Icon className="text-primary" size={30} />
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm leading-relaxed opacity-75">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
