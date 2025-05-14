import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDiff(targetTimestamp: number): string {
  const now = Math.floor(Date.now() / 1000);
  const diff = targetTimestamp - now;
  const absDiff = Math.abs(diff);

  const suffix = diff >= 0 ? "from now" : "ago";

  if (absDiff < 60) return `a few seconds ${suffix}`;
  if (absDiff < 3600) return `${Math.floor(absDiff / 60)} minute${absDiff < 120 ? '' : 's'} ${suffix}`;
  if (absDiff < 86400) return `${Math.floor(absDiff / 3600)} hour${absDiff < 7200 ? '' : 's'} ${suffix}`;
  if (absDiff < 2592000) return `${Math.floor(absDiff / 86400)} day${absDiff < 172800 ? '' : 's'} ${suffix}`;
  if (absDiff < 31536000) return `${Math.floor(absDiff / 2592000)} month${absDiff < 5184000 ? '' : 's'} ${suffix}`;

  return `${Math.floor(absDiff / 31536000)} year${absDiff < 63072000 ? '' : 's'} ${suffix}`;
}
