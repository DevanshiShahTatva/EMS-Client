"use client"

import React, { useState } from "react";

import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/solid";

const testimonialsData = [
  {
    name: "Ava Williams",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    text: "Booking my concert tickets was so easy. Highly recommend!",
  },
  {
    name: "Liam Brown",
    image: "https://randomuser.me/api/portraits/men/33.jpg",
    text: "Loved the variety of events available. Found a festival I didn't even know about!",
  },
  {
    name: "Sophia Davis",
    image: "https://randomuser.me/api/portraits/women/69.jpg",
    text: "Instant tickets delivered to my phone — super convenient.",
  },
  {
    name: "Noah Johnson",
    image: "https://randomuser.me/api/portraits/men/21.jpg",
    text: "The best event booking platform. Smooth and reliable!",
  },
  {
    name: "Isabella Garcia",
    image: "https://randomuser.me/api/portraits/women/56.jpg",
    text: "Got my theater tickets in minutes. Amazing experience!",
  },
  {
    name: "Mason Lee",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    text: "Huge collection of events. Already booked for next month!",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 3 + testimonialsData.length) % testimonialsData.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 3) % testimonialsData.length);
  };

  const visibleTestimonials = testimonialsData.slice(currentIndex, currentIndex + 3);

  return (
    <section className="py-16 px-8 bg-gray-50">
      <div className="mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          Hear from Happy Attendees
        </h2>

        {/* Container for buttons + testimonials */}
        <div className="flex items-center justify-center gap-6">
          {/* Prev Button */}
          <button
            onClick={handlePrev}
            className="p-4 bg-gray-300 text-black font-bold rounded-full hover:bg-gray-400"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {visibleTestimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg text-center w-72"
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-20 h-20 rounded-full mx-auto mb-4"
                />
                <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
              </div>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={handleNext}
            className="p-4 bg-gray-300 text-black rounded-full hover:bg-gray-400"
          >
            <ChevronRightIcon className="w-6 h-6" /> 
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
