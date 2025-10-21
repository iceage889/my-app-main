"use client";
import Link from "next/link";
import React, { useState } from "react";
export default function NavBar() {
  const [narOpen, setNarOpen] = useState(false);
  return (
    <section className="bg-black text-white w-full ">
      <div className=" container mx-auto  flex justify-between items-center  py-4 px-6">
        <div className="flex items-center gap-2">
          <Link href="/" className=" transition">
            <img src="/images/Logo.png" alt="Logo" className="w-[40px]" />
          </Link>
          <p className="font-bold ">MovingPace</p>
        </div>
        <div className="hidden md:flex gap-8 md:mx-auto font-medium items-center ">
          <Link href="/" className="hover:text-red-400 transition">
            Home
          </Link>

          <Link href="/about" className="hover:text-red-400 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-red-400 transition">
            Contact
          </Link>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setNarOpen(!narOpen)}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={narOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
      </div>
      {narOpen && (
        <div className="md:hidden flex flex-col items-center gap-4 py-4 bg-gray-900">
          <Link href="/" className="hover:text-red-400 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-red-400 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-red-400 transition">
            Contact
          </Link>
        </div>
      )}
    </section>
  );
}
