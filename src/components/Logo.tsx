import Link from "next/link";
import { Aperture } from "lucide-react";

// Same logo everywhere (navbar and footer) so branding stays consistent.
export default function Logo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2" aria-label="StudioSpace home">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-content">
        <Aperture size={22} strokeWidth={2.2} />
      </span>
      <span className="logo-text text-xl">
        Studio<span className="text-primary">Space</span>
      </span>
    </Link>
  );
}
