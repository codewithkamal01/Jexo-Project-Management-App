"use client";

import Autoplay from "embla-carousel-autoplay";
import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "./ui/carousel";
import companies from "@/data/companies.json";
import Image from "next/image";

export default function CompanyCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className="w-full"
    >
      <CarouselContent className="flex gap-5 sm:gap-10 items-center ">
        {companies.map((company) => (
          <CarouselItem
            key={company.id}
            className="basis-1/3 lg:basis-1/6"
          >
            <div className="flex items-center justify-center p-4">
              <Image
                src={company.path}
                alt={company.name}
                width={200}
                height={56}
                className="h-10 sm:h-14 w-auto object-contain"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
