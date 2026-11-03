import { Aperture } from "lucide-react";

export default function Loading() {
  return (
    <div className="grid min-h-[50vh] place-items-center" role="status" aria-label="Loading">
      <div className="flex flex-col items-center gap-3">
        <Aperture className="animate-spin text-primary" size={44} style={{ animationDuration: "1.6s" }} />
        <p className="text-sm font-semibold text-base-content/70">Setting up the lights...</p>
      </div>
    </div>
  );
}
