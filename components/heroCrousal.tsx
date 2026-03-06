"use client"

import useEmblaCarousel from "embla-carousel-react"
import { useEffect, useCallback } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

const slides = [
  {
    image: "/hero1.jpg",
    label: "Winter 2026",
    headline: "Silhouettes in Black",
  },
  {
    image: "/hero2.jpg",
    label: "New Collection",
    headline: "Refined Essentials",
  },
  {
    image: "/hero3.jpg",
    label: "The Edit",
    headline: "Modern Icons",
  },
]

export default function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    duration: 40,
  })

  const autoplay = useCallback(() => {
    if (!emblaApi) return
    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, 7000)
    return () => clearInterval(interval)
  }, [emblaApi])

  useEffect(() => {
    const cleanup = autoplay()
    return cleanup
  }, [autoplay])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className="relative flex-[0_0_100%] h-full"
            >
              {/* Image */}
              <Image
                src={slide.image}
                alt={slide.headline}
                fill
                priority
                className="object-cover scale-105 animate-[slowZoom_8s_linear_forwards]"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-xs tracking-[0.5em] uppercase mb-6"
                >
                  {slide.label}
                </motion.p>

                <motion.h1
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2 }}
                  className="text-4xl md:text-6xl font-light tracking-wide"
                >
                  {slide.headline}
                </motion.h1>

                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-12 border border-white px-12 py-4 text-xs tracking-[0.4em] uppercase hover:bg-white hover:text-black transition duration-500"
                >
                  Discover
                </motion.button>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Minimal Arrows */}
      <div className="absolute bottom-10 right-10 flex gap-6 text-white text-sm tracking-widest uppercase">
        <button
          onClick={() => emblaApi?.scrollPrev()}
          className="hover:opacity-60 transition"
        >
          Prev
        </button>
        <button
          onClick={() => emblaApi?.scrollNext()}
          className="hover:opacity-60 transition"
        >
          Next
        </button>
      </div>
    </section>
  )
}