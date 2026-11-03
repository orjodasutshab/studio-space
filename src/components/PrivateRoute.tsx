"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { Aperture } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Wrap any private page with this. While the server is still checking who is logged in
// (for example right after a reload) we show a loader instead of kicking the user to Login.
export default function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      toast.info("Please log in to continue");
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [loading, user, router, pathname]);

  if (loading || !user) {
    return (
      <div className="grid min-h-[50vh] place-items-center" role="status" aria-label="Checking your session">
        <Aperture className="animate-spin text-primary" size={40} style={{ animationDuration: "1.6s" }} />
      </div>
    );
  }
  return <>{children}</>;
}
