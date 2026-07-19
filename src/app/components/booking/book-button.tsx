import Link from "next/link";

export default function BookButton({
  className = "",
  children = "Book a Move",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Link href="/book" className={className || "btn-accent"}>
      {children}
    </Link>
  );
}
