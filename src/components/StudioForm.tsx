"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Plus } from "lucide-react";
import { CATEGORIES, type Studio, type StudioCategory, type StudioInput } from "@/lib/types";
import { IMGBB_ENABLED, uploadToImgbb } from "@/lib/upload";

const PRESET_AMENITIES = [
  "Free WiFi", "Parking", "Air conditioning", "Power backup", "Green screen", "Lighting kit",
  "Soundproofing", "Changing room", "Makeup station", "Props", "Tea and coffee", "Equipment storage",
];

interface Props {
  initial?: Studio;
  owner: { name: string; email: string };
  submitLabel: string;
  busy: boolean;
  onSubmit: (data: StudioInput) => void;
}

// Used by both Add Studio and Edit Studio so the two forms always look the same.
export default function StudioForm({ initial, owner, submitLabel, busy, onSubmit }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState<StudioCategory>(initial?.category ?? CATEGORIES[0]);
  const [hourlyRate, setHourlyRate] = useState(initial ? String(initial.hourlyRate) : "");
  const [securityDeposit, setSecurityDeposit] = useState(initial ? String(initial.securityDeposit) : "");
  const [capacity, setCapacity] = useState(initial ? String(initial.capacity) : "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? "");
  const [overview, setOverview] = useState(initial?.overview ?? "");
  const [selected, setSelected] = useState<string[]>(initial?.amenities ?? []);
  const [options, setOptions] = useState<string[]>(() => [
    ...PRESET_AMENITIES,
    ...(initial?.amenities ?? []).filter((a) => !PRESET_AMENITIES.includes(a)),
  ]);
  const [custom, setCustom] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const toggle = (a: string) => setSelected((s) => (s.includes(a) ? s.filter((x) => x !== a) : [...s, a]));

  function addCustom() {
    const value = custom.trim();
    if (!value) return;
    if (!options.includes(value)) setOptions([...options, value]);
    if (!selected.includes(value)) setSelected([...selected, value]);
    setCustom("");
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      setImageUrl(await uploadToImgbb(file));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    const rate = Number(hourlyRate);
    const deposit = Number(securityDeposit);
    const people = Number(capacity);
    if (!title.trim() || !location.trim() || !overview.trim()) return void toast.error("Please fill in the title, location and overview");
    if (!imageUrl.trim()) return void toast.error("Please add an image link or upload a picture");
    if (!(rate > 0)) return void toast.error("Hourly rate must be more than 0");
    if (!(deposit >= 0) || securityDeposit === "") return void toast.error("Please enter a security deposit (0 or more)");
    if (!(people >= 1)) return void toast.error("Capacity must be at least 1 person");
    onSubmit({
      title: title.trim(), category, hourlyRate: rate, securityDeposit: deposit, capacity: Math.floor(people),
      location: location.trim(), imageUrl: imageUrl.trim(), amenities: selected, overview: overview.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-box border border-base-300 bg-base-100 p-6 sm:p-8" noValidate>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="mb-1 block text-sm font-semibold">Studio title</span>
          <input className="input w-full" placeholder="e.g. Northlight Cyc Wall Studio" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Category</span>
          <select className="select w-full" value={category} onChange={(e) => setCategory(e.target.value as StudioCategory)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Location / address</span>
          <input className="input w-full" placeholder="Area and city" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Hourly rate ($)</span>
          <input type="number" min="1" className="input w-full" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Security deposit ($)</span>
          <input type="number" min="0" className="input w-full" value={securityDeposit} onChange={(e) => setSecurityDeposit(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Max capacity (people)</span>
          <input type="number" min="1" className="input w-full" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
        </label>

        <div className="block">
          <span className="mb-1 block text-sm font-semibold">Image</span>
          <div className="flex gap-2">
            <input type="url" className="input w-full" placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            {IMGBB_ENABLED && (
              <>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                <button type="button" className="btn btn-outline" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? <span className="loading loading-spinner loading-sm" /> : <ImagePlus size={18} />}
                  Upload
                </button>
              </>
            )}
          </div>
        </div>

        {imageUrl && (
          <div className="md:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt="Preview" className="h-48 w-full rounded-box object-cover md:w-72" />
          </div>
        )}
      </div>

      <div>
        <span className="mb-2 block text-sm font-semibold">Amenities</span>
        <div className="flex flex-wrap gap-2">
          {options.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => toggle(a)}
              className={`btn btn-sm ${selected.includes(a) ? "btn-primary" : "btn-outline border-base-300"}`}
              aria-pressed={selected.includes(a)}
            >
              {a}
            </button>
          ))}
        </div>
        <div className="mt-3 flex max-w-sm gap-2">
          <input
            className="input input-sm w-full"
            placeholder="Add your own"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
          />
          <button type="button" className="btn btn-sm btn-outline" onClick={addCustom}>
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold">Detailed overview</span>
        <textarea className="textarea w-full" rows={5} placeholder="Describe the space, the gear, the rules and who it suits best." value={overview} onChange={(e) => setOverview(e.target.value)} />
      </label>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Host name</span>
          <input className="input w-full opacity-70" value={owner.name} readOnly />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold">Host email</span>
          <input className="input w-full opacity-70" value={owner.email} readOnly />
        </label>
      </div>

      <button type="submit" className="btn btn-primary" disabled={busy || uploading}>
        {busy && <span className="loading loading-spinner loading-sm" />}
        {submitLabel}
      </button>
    </form>
  );
}
