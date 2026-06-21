import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import NavBar from "./components/navbar";
import Footer from "./components/footer";
import { BookingProvider } from "./components/booking/booking-context";
import AOSInit from "./components/aos-init";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MovingPace",
  description: "Moving your property with pace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} antialiased`}>
        <AOSInit />
        <BookingProvider>
          <NavBar />
          <main className="overflow-x-hidden">{children}</main>
          <Footer />
        </BookingProvider>
      </body>
    </html>
  );
}
