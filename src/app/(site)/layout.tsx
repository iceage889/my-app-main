import NavBar from "../components/navbar";
import Footer from "../components/footer";
import { BookingProvider } from "../components/booking/booking-context";
import { siteUrl, siteName, siteDescription } from "../lib/seo";
import { serviceCities } from "../lib/pricing";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  name: siteName,
  url: siteUrl,
  image: `${siteUrl}/opengraph-image`,
  logo: `${siteUrl}/icon.svg`,
  description: siteDescription,
  telephone: "+31685330836",
  email: "Movingpace48@gmail.com",
  priceRange: "€€",
  areaServed: serviceCities.map((city) => ({ "@type": "City", name: city })),
  sameAs: ["https://wa.me/31685330836"],
};

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BookingProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NavBar />
      <main className="overflow-x-hidden">{children}</main>
      <Footer />
    </BookingProvider>
  );
}
