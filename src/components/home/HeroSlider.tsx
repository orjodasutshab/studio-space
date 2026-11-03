"use client";

import Link from "next/link";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

// Replace the image links with your own pictures later (put them in /public and use "/name.jpg").
const SLIDES = [
  {
    image: "https://picsum.photos/seed/studiospace-hero1/1800/900",
    kicker: "Photo studios",
    title: "Your next shoot starts with the right light",
    text: "Cyc walls, natural-light lofts and fully lit sets, ready to book by the hour.",
  },
  {
    image: "https://picsum.photos/seed/studiospace-hero2/1800/900",
    kicker: "Sound stages and music suites",
    title: "Record, roll and rehearse in pro spaces",
    text: "From soundproof film stages to vocal booths, find rooms built for sound and picture.",
  },
  {
    image: "https://picsum.photos/seed/studiospace-hero3/1800/900",
    kicker: "Make money from your space",
    title: "Got a studio? Let creators fill the empty hours",
    text: "List your space, set your price and approve bookings with full control and clear payouts.",
  },
];

export default function HeroSlider() {
  return (
    <section aria-label="Featured" className="relative">
      <Swiper
        className="hero-swiper h-[34rem] sm:h-[38rem]"
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop
        autoplay={{ delay: 5500, disableOnInteraction: false }}
        pagination={{ clickable: true }}
      >
        {SLIDES.map((s) => (
          <SwiperSlide key={s.title}>
            <div className="relative h-full w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/10" />
              <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl space-y-5 pb-8 text-white">
                  <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary-content">
                    {s.kicker}
                  </span>
                  <h1 className="logo-text text-4xl leading-tight sm:text-5xl lg:text-6xl">{s.title}</h1>
                  <p className="text-base text-white/85 sm:text-lg">{s.text}</p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link href="/studios" className="btn btn-primary">
                      Explore Studios
                    </Link>
                    <Link
                      href="/studios"
                      className="btn border-white/60 bg-transparent text-white hover:bg-white hover:text-black"
                    >
                      Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
