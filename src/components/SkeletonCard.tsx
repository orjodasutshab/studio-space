// Placeholder with the same size as a StudioCard, shown while data loads.
export default function SkeletonCard() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-box border border-base-300 bg-base-100">
      <div className="skeleton h-52 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="skeleton h-5 w-4/5" />
        <div className="skeleton h-5 w-2/5" />
        <div className="skeleton h-4 w-3/5" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="skeleton h-8 w-20" />
          <div className="skeleton h-8 w-24" />
        </div>
      </div>
    </div>
  );
}
