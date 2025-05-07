import React from "react";

import { MapPinned, Ticket, PartyPopper, CircleArrowRight } from "lucide-react";

const FEATURES_DATA = [
  {
    icon: <MapPinned className="w-6 h-6 text-green-500" />,
    title: "Discovery & Exploration",
    description:
      "Explore local and national events tailored to your interests — sports, music, culture, and more. Never miss out on trending events. Discover what’s coming up next near you.",
    link: "#",
    hoverBg: "hover:bg-green-100",
    hoverTitleColor: "group-hover:text-green-600",
  },
  {
    icon: <PartyPopper className="w-6 h-6 text-red-500" />,
    title: "Personal Touch",
    description:
      "Explore events that match your vibe — from peaceful retreats to high-energy concerts. Find and attend events that turn ordinary days into unforgettable experiences.",
    link: "#",
    hoverBg: "hover:bg-red-100",
    hoverTitleColor: "group-hover:text-red-600",
  },
  {
    icon: <Ticket className="w-6 h-6 text-blue-500" />,
    title: "Simplicity & Convenience",
    description:
      "Say goodbye to FOMO — we make it easy to find and attend events that matter to you. From discovery to ticketing, manage your entire event experience effortlessly.",
    link: "#",
    hoverBg: "hover:bg-blue-100",
    hoverTitleColor: "group-hover:text-blue-600",
  },
];
const FeatureSection = () => {
  return (
    <>
      <section className="bg-[#F5F7FC] px-[20px] py-12 md:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Choose Evently?</h2>
          <p className="mb-8 text-gray-600 px-[0px] md:px-20">
            Evently is more than just an event listing site. We help you discover, explore, and enjoy events that match
            your interests — from concerts and food fests to sports, art, and wellness experiences. Whether you're
            planning your weekend or looking for something spontaneous, Evently makes it easy to find the right vibe and
            be part of the moment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES_DATA.map((feature, index) => (
              <div
                key={index}
                className={`group flex flex-col justify-between p-6 border rounded-lg shadow-lg bg-white border-gray-200 transition-all duration-300 ${feature.hoverBg}`}>
                <div>
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="w-6 h-6">{feature.icon}</div>
                    <h3
                      className={`text-xl font-semibold text-gray-800 transition-colors duration-300 ${feature.hoverTitleColor}`}>
                      {feature.title}
                    </h3>
                  </div>

                  <p className="text-left text-gray-600">{feature.description}</p>
                </div>

                <div className="mt-6">
                  <a href="#" className="flex items-center text-blue-600 font-medium hover:underline">
                    Learn more
                    <CircleArrowRight className="w-5 h-5 ml-2 text-blue-600 transition-transform group-hover:translate-x-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeatureSection;
