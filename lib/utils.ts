export { cn } from "cn";

export function formatRelativeTime(iso: string, now = new Date()) {
  const then = new Date(iso);
  const diff = Math.max(0, now.getTime() - then.getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return then.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
