import type { BookingStatus } from "@/lib/types";

const STYLES: Record<BookingStatus, string> = {
  Pending: "badge-warning",
  Confirmed: "badge-success",
  Completed: "badge-info",
  Cancelled: "badge-error",
};

export default function StatusBadge({ status }: { status: BookingStatus }) {
  return <span className={`badge font-semibold ${STYLES[status]}`}>{status}</span>;
}
