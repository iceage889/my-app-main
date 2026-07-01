-- Seed the original testimonials as approved reviews so the carousel isn't empty.
insert into public.reviews (name, city, rating, comment, image_url, approved) values
  ('Sarah Chen', 'Almere', 5, 'They work very fast and professionally.', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=400&auto=format&fit=crop', true),
  ('Michael Rodriguez', 'Amsterdam', 5, 'Reliable, fast and keep to time.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop', true),
  ('Emily Watson', 'Hilversum', 4, 'Deliver in time and keep to time.', 'https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=400&auto=format&fit=crop', true),
  ('James Kim', 'Lelystad', 5, 'Cheaper and keep to time.', 'https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=400&auto=format&fit=crop', true),
  ('Lisa Thompson', 'Amersfoort', 5, 'The whole experience was seamless. The crew was efficient and looked after every item.', 'https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=400&auto=format&fit=crop', true);
