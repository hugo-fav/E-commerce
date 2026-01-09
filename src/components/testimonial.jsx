"use client";

import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Aisha Bello",
    role: "Verified Customer",
    image: "/profilepicture/p1.jfif",
    message:
      "The quality exceeded my expectations. Delivery was fast and the packaging was clean. I’ll definitely shop again.",
  },
  {
    id: 2,
    name: "Daniel Okorie",
    role: "Returning Customer",
    image: "/profilepicture/p2.jfif",
    message:
      "Very smooth shopping experience. The product images were accurate and customer support was helpful.",
  },
  {
    id: 3,
    name: "Fatima Yusuf",
    role: "First-time Buyer",
    image: "/profilepicture/p3.jfif",
    message:
      "I was impressed by how easy everything was. Checkout was seamless and my order arrived on time.",
  },
  {
    id: 4,
    name: "Samuel Ade",
    role: "Loyal Customer",
    image: "/profilepicture/p4.jfif",
    message:
      "Everything from browsing to payment felt polished. This store clearly pays attention to detail.",
  },
];

const TestimonialSection = () => {
  return (
    <section className="mt-32 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-16">
      {/* Header */}
      <div className="mb-16 max-w-xl">
        <h2 className="text-4xl md:text-5xl font-medium tracking-wide uppercase">
          Testimonials
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          Trusted by customers who value quality and simplicity
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-y-16 gap-x-12 md:grid-cols-2">
        {testimonials.map((item) => (
          <div key={item.id} className="border-t border-gray-200 pt-8">
            {/* Quote */}
            <p className="text-xl md:text-2xl leading-relaxed text-gray-700 italic font-serif">
              “{item.message}”
            </p>

            {/* Author */}
            <div className="mt-6 flex items-center gap-4">
              <Image
                src={item.image}
                alt={item.name}
                width={48}
                height={48}
                className="rounded-full object-cover grayscale"
              />

              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialSection;
