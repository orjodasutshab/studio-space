// Uploads a picture to imgbb and returns its public link.
// Needs a free key from https://api.imgbb.com in NEXT_PUBLIC_IMGBB_KEY (see .env.local).
export const IMGBB_ENABLED = Boolean(process.env.NEXT_PUBLIC_IMGBB_KEY);

export async function uploadToImgbb(file: File): Promise<string> {
  const key = process.env.NEXT_PUBLIC_IMGBB_KEY;
  if (!key) throw new Error("Image upload is not set up yet. Paste an image link instead.");
  const body = new FormData();
  body.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || !json?.success) throw new Error(json?.error?.message || "Image upload failed");
  return json.data.url as string;
}
