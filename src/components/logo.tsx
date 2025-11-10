import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn("fill-current", className)}
    >
      <title>Blak Whyte Studio Logo</title>
      <path d="M20 20 H 80 V 80 H 20 Z" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M20 50 H 80" stroke="currentColor" strokeWidth="4" />
      <path d="M50 20 V 80" stroke="currentColor" strokeWidth="4" />
      <circle cx="50" cy="50" r="10" />
    </svg>
  );
}
