import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const slides = [

    {
        image:
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2000&q=80",
        badge: "LIMITED EDITION",
        title: "Where Style\nMeets Perfection",
        description:
          "Experience a curated shopping journey featuring exclusive apparel, luxury accessories, and trend-setting collections from the world's finest brands.",
      },

  {
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=2000&q=80",
    badge: "NEW ARRIVALS 2026",
    title: "Luxury Fashion\nDesigned For Modern Living",
    description:
      "Discover handpicked collections crafted with premium quality, timeless elegance, and effortless style. Elevate your wardrobe with pieces that define confidence and sophistication.",
  },

  {
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52?auto=format&fit=crop&w=2000&q=80",
    badge: "PREMIUM COLLECTION",
    title: "Redefine Your\nEveryday Look",
    description:
      "Because exceptional style begins with exceptional choices. Shop timeless designs made to inspire confidence every single day.",
  },
];

const Hero = () => {
  return (
    <section className="relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        loop
        className="h-[90vh]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative h-[90vh] bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />

              {/* Decorative Blur */}
              <div className="absolute left-20 top-24 h-72 w-72 rounded-full bg-orange-500/20 blur-[120px]" />

              <div className="relative mx-auto flex h-full max-w-7xl items-center px-6">
                <div className="max-w-2xl">

                  {/* Badge */}
                  <span className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold uppercase tracking-[3px] text-white backdrop-blur-md">
                    {slide.badge}
                  </span>

                  {/* Heading */}
                  <h1 className="mt-8 whitespace-pre-line text-5xl font-black leading-tight text-white md:text-7xl">
                    {slide.title}
                  </h1>

                  {/* Description */}
                  <p className="mt-6 max-w-xl text-lg leading-8 text-gray-200">
                    {slide.description}
                  </p>

                  {/* Buttons */}
                  <div className="mt-10 flex flex-wrap gap-5">
                    <button className="group flex items-center gap-3 rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition-all duration-300 hover:bg-orange-600 hover:shadow-2xl hover:shadow-orange-500/40">
                      Shop Collection
                      <ArrowRight
                        size={20}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>

                    <button className="rounded-full border border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition hover:bg-white hover:text-black">
                      Explore Lookbook
                    </button>
                  </div>

                  {/* Statistics */}
                  <div className="mt-16 grid grid-cols-3 gap-8 border-t border-white/20 pt-8">

                    <div>
                      <h2 className="text-4xl font-bold text-white">50K+</h2>
                      <p className="mt-2 text-gray-300">
                        Happy Customers
                      </p>
                    </div>

                    <div>
                      <h2 className="text-4xl font-bold text-white">500+</h2>
                      <p className="mt-2 text-gray-300">
                        Premium Brands
                      </p>
                    </div>

                    <div>
                      <h2 className="text-4xl font-bold text-white">4.9★</h2>
                      <p className="mt-2 text-gray-300">
                        Customer Rating
                      </p>
                    </div>

                  </div>

                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;