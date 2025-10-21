import Review from "../components/review";

export default function About() {
  return (
    <section className="bg-black text-white grid md:flex-col justify-center py-16 px-6">
      <div className=" container mx-auto flex  flex-col sm:grid md:flex md:flex-row   items-center justify-between gap-10 ">
        <img
          src="/images/man.png"
          alt="Professional logistics expert"
          className="w-64 sm:w-80 md:w-[400px] lg:w-[500px] xl:w-[600px] rounded-2xl"
        />
        <div className="flex flex-col space-y-6 text-center md:text-left max-w-lg">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold">
            Our Vision
          </h1>
          <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
            Our mission is to provide reliable and efficient relocation
            services, ensuring the safe transfer of your belongings from your
            current residence to your new home.
          </p>
        </div>
      </div>
      <div>
        <Review />
      </div>
    </section>
  );
}
