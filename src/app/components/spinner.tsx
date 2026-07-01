import { IconLoader2 } from "@tabler/icons-react";

export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <IconLoader2
      className={`h-4 w-4 animate-spin ${className}`}
      aria-hidden="true"
    />
  );
}
