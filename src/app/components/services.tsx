import {
  IconTruck,
  IconBoxSeam,
  IconStairsUp,
  IconTool,
  IconPlane,
} from "@tabler/icons-react";
import Header from "./header";

const services = [
  {
    icon: IconTruck,
    title: "Hourly Moving",
    description:
      "A professional driver and crew move your home, charged by the hour based on your city.",
  },
  {
    icon: IconBoxSeam,
    title: "Loading & Unloading",
    description:
      "Extra hands to load and unload the van so the heavy lifting isn't on you.",
  },
  {
    icon: IconStairsUp,
    title: "Stairs Carrying",
    description:
      "No elevator? We carry your belongings up and down, floor by floor.",
  },
  {
    icon: IconTool,
    title: "Furniture Disassembly & Reassembly",
    description:
      "We take apart and rebuild beds, wardrobes and tables at both ends of the move.",
  },
  {
    icon: IconPlane,
    title: "Airport & Transfer",
    description:
      "Flat-rate luggage transport between Almere, Schiphol, Amsterdam and more — courtesy ride included.",
  },
];

export default function Services() {
  return (
    <section className="container mx-auto px-6 py-12" data-aos="fade-up">
      <Header
        title="Our Services"
        subtitle="Pick exactly what you need — pay only for what you use."
      />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <div
            key={service.title}
            className="card flex flex-col p-6"
            data-aos="fade-up"
            data-aos-delay={i * 100}
          >
            <service.icon className="h-8 w-8 text-[var(--color-accent)]" />
            <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
