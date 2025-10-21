import Review from "../components/review";

export default function Contact() {
  return (
    <section className="bg-black text-white grid md:flex-col justify-center py-16 px-6">
      <div className=" container mx-auto flex  flex-col sm:grid md:flex md:flex-row   items-center justify-between gap-10 ">
        <div className="flex flex-col space-y-6 text-center md:text-left max-w-lg">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold">
            Get In Touch
          </h1>
          <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
            ALOG – Moving made simple. From heavy fridges to everyday
            essentials, we safely carry your load from one home to the next with
            care, speed, and reliability.
          </p>
        </div>
        <img
          src="/images/Group 17.png"
          alt="Contact information illustration"
          className="w-64 sm:w-80 md:w-[300px] lg:w-[400px] xl:w-[500px] rounded-2xl"
        />
      </div>
      <div>
        <Review />
      </div>
    </section>
  );
}
