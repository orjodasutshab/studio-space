import { CalendarClock, Clapperboard, Search, Zap } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Discover spaces", text: "Search by category, price and location to find a studio that fits your project." },
  { icon: CalendarClock, title: "Select shoot hours", text: "Pick a date and your start and end time. The total cost is shown upfront." },
  { icon: Zap, title: "Book instantly", text: "Send your request in one click. Your host confirms and you get a clear status." },
  { icon: Clapperboard, title: "Create and produce", text: "Show up, set up and make something great. Cancel pending slots any time." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 space-y-3 text-center">
        <h2 className="section-title">How booking works</h2>
        <p className="section-subtitle mx-auto">From idea to the first take in four simple steps.</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map(({ icon: Icon, title, text }, i) => (
          <div key={title} className="relative flex h-full flex-col gap-3 rounded-box border border-base-300 bg-base-100 p-6">
            <span className="logo-text absolute right-5 top-4 text-5xl text-base-content/10">{i + 1}</span>
            <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-content">
              <Icon size={22} />
            </span>
            <h3 className="text-lg font-bold">
              {i + 1}. {title}
            </h3>
            <p className="text-sm leading-relaxed text-base-content/70">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
