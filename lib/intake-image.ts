// Downscale and re-encode a citation photo in the browser so the upload stays
// well under Vercel's 4.5MB request-body limit even for large phone photos,
// and small enough to survive in localStorage across the Stripe redirect.
export async function compressCitationImage(file: File): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new window.Image();
    el.onload = () => resolve(el);
    el.onerror = reject;
    el.src = dataUrl;
  });

  const MAX_DIMENSION = 2000;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));

  // Already small enough - keep the original bytes
  if (scale === 1 && file.size < 1.5 * 1024 * 1024) return dataUrl;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}

// Strip the data:image/...;base64, prefix for upload payloads
export function toBase64Payload(dataUrl: string): string {
  const comma = dataUrl.indexOf(",");
  return comma >= 0 ? dataUrl.slice(comma + 1) : dataUrl;
}
