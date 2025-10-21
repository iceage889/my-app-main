import Image from "next/image";

export default function Footer() {
  return (
    <div>
      <section className="bg-red-600 text-white py-12 px-6 flex flex-col md:flex-row justify-between items-center">
        {/* Left side */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">How can we help you?</h2>
          <p className="text-lg">Get in touch.</p>

          <div>
            <p className="text-xl font-semibold">Albert Hugo</p>
            <p className="text-sm text-gray-200">Logistics Expert</p>
          </div>

          <div className="flex items-center gap-3">
            <span>📞</span>
            <p className="text-lg">+31681059122</p>
          </div>

          <div className="flex items-center gap-3">
            <span>📧</span>
            <p className="text-lg">Movingpace48@gmail.com</p>
          </div>
        </div>

        {/* Right side (icon or map graphic) */}
        {/* <div className="mt-8 md:mt-0">
          <img src="/images/bus.jpg" alt="Map Icon" className="w-48 h-48" />
        </div> */}
      </section>
      <a
        href="https://wa.me/31681059122"
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center items-center fixed bottom-5 right-5 z-50"
      >
        <Image
          className="bg-blue-500 w-[50px] h-[50px] rounded-full"
          src="/images/whatapp.png"
          alt="whatsapp-logo"
          width={100}
          height={100}
        />
      </a>
    </div>
  );
}
