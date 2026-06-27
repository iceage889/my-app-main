import { AnimatedTestimonials } from "../UI/animated-testimonial";
import Header from "./header";
import { createPublicClient } from "../lib/supabase/public";

type ReviewRow = {
  name: string;
  city: string | null;
  rating: number;
  comment: string;
  image_url: string | null;
};

export default async function Review() {
  const supabase = createPublicClient();

  let rows: ReviewRow[] = [];
  if (supabase) {
    const { data } = await supabase
      .from("reviews")
      .select("name, city, rating, comment, image_url")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(12);
    rows = data ?? [];
  }

  if (rows.length === 0) return null;

  const testimonials = rows.map((r) => ({
    quote: r.comment,
    name: r.name,
    designation: r.city ?? "",
    rating: r.rating,
    src: r.image_url ?? "",
  }));

  return (
    <section id="testimonials" className="py-12" data-aos="fade-up">
      <Header title="Customer Reviews" />
      <AnimatedTestimonials testimonials={testimonials} />
    </section>
  );
}
