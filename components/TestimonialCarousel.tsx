"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

const testimonials = [
  {
    quote:
      "The AI-powered mock interviews felt like the real thing. They gave me the confidence I never had before. I finally cracked my first big tech role!",
    author: "Sarah Chen",
    image: "https://randomuser.me/api/portraits/women/75.jpg",
    role: "Software Engineer",
    company: "Tech Giant Co.",
  },
  {
    quote:
      "The weekly industry updates helped me understand where I stand. I was able to switch from sales to product without feeling lost.",
    author: "Michael Rodriguez",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
    role: "Product Manager",
    company: "StartUp Inc.",
  },
  {
    quote:
      "My resume finally passed ATS bots! Within days, I started hearing back from companies I'd applied to months ago.",
    author: "Priya Patel",
    image: "https://randomuser.me/api/portraits/women/74.jpg",
    role: "Marketing Director",
    company: "Global Corp",
  },
  {
    quote:
      "I had no clue how to write a proper cover letter. The AI suggestions were a lifesaver — clean, relevant, and got replies!",
    author: "Ravi Mehra",
    image: "https://randomuser.me/api/portraits/men/77.jpg",
    role: "Recent Graduate",
    company: "Freelance Consultant",
  },
  {
    quote:
      "Honestly, I was burned out from job hunting. This platform gave structure to my prep and boosted my motivation.",
    author: "Ayesha Khan",
    image: "https://randomuser.me/api/portraits/women/76.jpg",
    role: "UX Designer",
    company: "DesignCraft",
  },
];


export function Testimonials() {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 4000, // 4 sec delay between slides
          stopOnInteraction: false,
        }),
      ]}
      className="w-full px-8 sm:px-16 lg:px-32 mx-auto"
    >
      <CarouselContent>
        {testimonials.map((item, index) => (
          <CarouselItem key={index} className="flex flex-col items-center p-4 py-6 bg-gradient-to-br from-black to-zinc-900 rounded-lg border border-gray-800 md:basis-1/2 lg:basis-1/3">
            <Image
              src={item.image}
              alt={item.author}
              width={64}
              height={64}
              className="rounded-full mb-4"
            />
            <p className="text-center text-muted-foreground italic max-w-lg">
              “{item.quote}”
            </p>
            <div className="mt-6 text-end w-full">
              <p className="font-semibold">{item.author}</p>
              <p className="text-xs text-gray-500">
                {item.role} @ {item.company}
              </p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
