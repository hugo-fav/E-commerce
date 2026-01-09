"use client";

import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Aisha Bello",
    role: "Verified Customer",
    image:
      "https://i.pinimg.com/1200x/79/13/ea/7913ea60e14b704811fd503d68a8fd81.jpg",
    message:
      "The quality exceeded my expectations. Delivery was fast and the packaging was clean. I’ll definitely shop again.",
  },
  {
    id: 2,
    name: "Daniel Okorie",
    role: "Returning Customer",
    image:
      "https://i.pinimg.com/1200x/52/dd/52/52dd52923d7802051241e5ba19ddc26a.jpg",
    message:
      "Very smooth shopping experience. The product images were accurate and customer support was helpful.",
  },
  {
    id: 3,
    name: "Fatima Yusuf",
    role: "First-time Buyer",
    image:
      "https://i.pinimg.com/1200x/d1/6a/6f/d16a6f0ce24bd0d36e5370921f3128d1.jpg",
    message:
      "I was impressed by how easy everything was. Checkout was seamless and my order arrived on time.",
  },
  {
    id: 4,
    name: "Samuel Ade",
    role: "Loyal Customer",
    image:
      "https://i.pinimg.com/1200x/9a/b4/ec/9ab4ec859a51544fd1674121f4ee9499.jpg",
    message:
      "Everything from browsing to payment felt polished. This store clearly pays attention to detail.",
  },
];

const TestimonialSection = () => {
  return (
    <section className="mt-32 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-16">
      {/* Header */}
      <div className="mb-16 max-w-xl text-center md:text-left">
        <h2 className="text-4xl md:text-5xl font-semibold tracking-tight uppercase">
          Testimonials
        </h2>
        <p className="mt-3 text-sm text-gray-500">
          Trusted by customers who value quality and simplicity
        </p>
      </div>

      {/* Grid */}
      <div className="grid gap-12 md:grid-cols-2">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="border-t border-gray-200 pt-8 hover:border-purple-600 transition-colors duration-300"
          >
            {/* Quote */}
            <p className="text-lg md:text-xl leading-relaxed text-gray-700 italic font-serif">
              “{item.message}”
            </p>

            {/* Author */}
            <div className="mt-6 flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-1 ring-gray-300">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {item.name}
                </p>
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
