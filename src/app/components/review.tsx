import { AnimatedTestimonials } from "../UI/animated-testimonial";
import Header from "./header";

const testimonials = [
  {
    quote: "They work very fast and professionally.",
    name: "Sarah Chen",
    designation: "Almere",
    rating: 5,
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote: "Reliable, fast and keep to time.",
    name: "Michael Rodriguez",
    designation: "Amsterdam",
    rating: 5,
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote: "Deliver in time and keep to time.",
    name: "Emily Watson",
    designation: "Hilversum",
    rating: 4,
    src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote: "Cheaper and keep to time.",
    name: "James Kim",
    designation: "Lelystad",
    rating: 5,
    src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "The whole experience was seamless. The crew was efficient and looked after every item.",
    name: "Lisa Thompson",
    designation: "Amersfoort",
    rating: 5,
    src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function Review() {
  return (
    <section id="testimonials" className="py-12" data-aos="fade-up">
      <Header title="Customer Reviews" />
      <AnimatedTestimonials testimonials={testimonials} />
    </section>
  );
}
