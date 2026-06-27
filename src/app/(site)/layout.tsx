import NavBar from "../components/navbar";
import Footer from "../components/footer";
import { BookingProvider } from "../components/booking/booking-context";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BookingProvider>
      <NavBar />
      <main className="overflow-x-hidden">{children}</main>
      <Footer />
    </BookingProvider>
  );
}
