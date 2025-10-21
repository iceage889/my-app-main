import Link from "next/link";
import Review from "./components/review";

export default function Hero() {
  return (
    <section className="bg-black text-white grid md:flex  flex-col justify-center py-16 px-6">
      <div className=" container mx-auto flex  flex-col sm:grid md:flex md:flex-row   items-center justify-between gap-10 ">
        <div className="flex flex-col space-y-6 text-center items-center md:items-start md:text-left max-w-lg">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold">
            MOVINGPACE
          </h1>
          <p className="text-base sm:text-lg lg:text-xl leading-relaxed">
            Success in logistics is not just about on-time delivery, but also
            ensuring operational costs remain efficient
          </p>
          <button className="bg-red-500 hover:bg-red-600 text-white w-[130px] h-[45px] flex items-center justify-center rounded-2xl font-medium transition ">
            <Link href="/contact" className="text-center">
              Reach Us
            </Link>
          </button>
        </div>
        <img
          src="/images/bus1.png"
          alt="Moving Pace transportation bus"
          className="w-64 sm:w-80 md:w-[400px] lg:w-[500px] xl:w-[600px]"
        />
      </div>
      <Review />
    </section>
  );
}
