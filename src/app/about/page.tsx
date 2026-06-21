import Review from "../components/review";
import BookButton from "../components/booking/book-button";

export default function About() {
  return (
    <>
      <section className="container mx-auto flex flex-col items-center justify-between gap-12 px-6 py-16 md:flex-row md:py-24">
        <img
          src="/images/man.png"
          alt="Professional logistics expert"
          className="w-72 rounded-2xl object-cover sm:w-96 md:w-[440px] lg:w-[500px]"
          data-aos="fade-right"
        />
        <div
          className="flex max-w-xl flex-col items-center text-center md:items-start md:text-left"
          data-aos="fade-up"
        >
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Our Vision
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-[var(--color-ink-muted)]">
            Our mission is to provide reliable and efficient relocation
            services, ensuring the safe transfer of your belongings from your
            current residence to your new home — with care, speed and honesty.
          </p>
          <div className="mt-8">
            <BookButton />
          </div>
        </div>
      </section>

      <Review />
    </>
  );
}
