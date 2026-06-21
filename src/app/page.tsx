import Link from "next/link";
import Review from "./components/review";
import Services from "./components/services";
import BookButton from "./components/booking/book-button";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="container mx-auto flex flex-col-reverse items-center justify-between gap-12 px-6 py-16 md:flex-row md:py-24">
        <div
          className="flex max-w-xl flex-col items-center text-center md:items-start md:text-left"
          data-aos="fade-up"
        >
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Move your home{" "}
            <span className="bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-strong)] bg-clip-text text-transparent">
              with pace
            </span>
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--color-ink-muted)]">
            Success in logistics isn&apos;t just about on-time delivery — it&apos;s
            about doing it safely, reliably and at a fair price. Let us carry
            your load from one home to the next.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <BookButton />
            <Link href="/pricing" className="btn-ghost">
              View Pricing
            </Link>
          </div>
        </div>
        <img
          src="/images/bus1.png"
          alt="MovingPace transportation bus"
          className="w-72 sm:w-96 md:w-[440px] lg:w-[540px]"
          data-aos="fade-left"
        />
      </section>

      <Services />

      <Review />
    </>
  );
}
