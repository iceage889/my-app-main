import type { Metadata } from "next";
import {
  IconPhone,
  IconMail,
  IconBrandWhatsapp,
} from "@tabler/icons-react";
import Review from "../../components/review";
import BookButton from "../../components/booking/book-button";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with MovingPace by phone, WhatsApp or email — or book your move online. Serving Almere, Amsterdam and surrounding areas.",
};

export default function Contact() {
  return (
    <>
      <section className="container mx-auto flex flex-col items-center justify-between gap-12 px-6 py-16 md:flex-row md:py-24">
        <div
          className="flex max-w-xl flex-col items-center text-center md:items-start md:text-left"
          data-aos="fade-up"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Get In Touch
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--color-ink-muted)]">
            From heavy fridges to everyday essentials, we safely carry your load
            from one home to the next with care, speed and reliability. Reach out
            or book your move below.
          </p>

          <div className="mt-8 flex flex-col gap-4">
            <a
              href="tel:+31681059122"
              className="flex items-center gap-3 text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
            >
              <IconPhone className="h-5 w-5 text-[var(--color-accent)]" />
              +31 6 8105 9122
            </a>
            <a
              href="https://wa.me/31681059122"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
            >
              <IconBrandWhatsapp className="h-5 w-5 text-[var(--color-accent)]" />
              Chat on WhatsApp
            </a>
            <a
              href="mailto:Movingpace48@gmail.com"
              className="flex items-center gap-3 break-all text-[var(--color-ink-muted)] transition hover:text-[var(--color-accent)]"
            >
              <IconMail className="h-5 w-5 text-[var(--color-accent)]" />
              Movingpace48@gmail.com
            </a>
          </div>

          <div className="mt-8">
            <BookButton />
          </div>
        </div>
        <img
          src="/images/Group 17.png"
          alt="Contact MovingPace"
          className="w-72 rounded-2xl sm:w-96 md:w-[400px] lg:w-[460px]"
          data-aos="fade-left"
        />
      </section>

      <Review />
    </>
  );
}
