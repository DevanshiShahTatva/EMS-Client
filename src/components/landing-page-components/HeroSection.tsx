import React, { useRef, useEffect } from "react";

// Next Support
import { useRouter } from "next/navigation";

// Constsnt imports
import { ROUTES } from "@/utils/constant";

import { motion } from "framer-motion";

const HeroSection = () => {
  const router = useRouter();
  const heroWrapperRef = useRef<HTMLDivElement>(null);
  const imageLayersRef = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!heroWrapperRef.current) return;

      const { left, top, width, height } = heroWrapperRef.current.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      targetX = (x / width - 0.5) * 2;
      targetY = (y / height - 0.5) * 2;
    };

    const animate = () => {
      imageLayersRef.current.forEach((img) => {
        if (!img) return;
        const speed = parseFloat(img.dataset.speed || "0.1");

        // Smooth interpolation
        const moveX = targetX * 100 * speed;
        const moveY = targetY * 100 * speed;

        img.style.transform = `translate(${moveX}px, ${moveY}px)`;
      });

      requestAnimationFrame(animate);
    };

    const wrapper = heroWrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener("mousemove", handleMouseMove);
    }

    animate();

    return () => {
      if (wrapper) {
        wrapper.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  const navToEvents = () => {
    router.push(ROUTES.USER_EVENTS);
  };

  return (
    <>
      <section
        ref={heroWrapperRef}
        id="home-hero-section-wrapper"
        className="relative flex items-center justify-center bg-[#F5F7FC]  py-12 md:py-20">
        <img
          ref={(el) => {
            imageLayersRef.current[0] = el;
          }}
          className="absolute hero-image z-20 p3 hidden md:block"
          data-speed="0.3"
          src="https://res.cloudinary.com/dv2n0s4mh/image/upload/v1746600519/hero-layer-3_w15q1u.png"
          alt="Background layer 3"
          style={{
            height: "auto",
            transition: "transform 0.1s ease-out",
          }}
        />

        <img
          ref={(el) => {
            imageLayersRef.current[1] = el;
          }}
          className="absolute hero-image z-10 p2 hidden md:block"
          data-speed="0.2"
          src="https://res.cloudinary.com/dv2n0s4mh/image/upload/v1746600518/hero-layer-2_qmoxxt.png"
          alt="Background layer 2"
          style={{
            height: "auto",
            transition: "transform 0.1s ease-out",
          }}
        />

        <img
          ref={(el) => {
            imageLayersRef.current[2] = el;
          }}
          className="absolute hero-image z-30 p1 hidden md:block"
          data-speed="0.1"
          src="https://res.cloudinary.com/dv2n0s4mh/image/upload/v1746600519/hero-layer-1_xponnu.png"
          alt="Background layer 1"
          style={{
            height: "auto",
            transition: "transform 0.1s ease-out",
          }}
        />

        {/* Content overlay */}
        <motion.div
          className="relative z-40 text-center px-6 pt-24 pb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}>
          <motion.h1
            className="text-3xl md:text-3xl lg:text-3xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}>
            Discover, Book, and Enjoy <span className="text-[#007EFF]">Events</span> with Ease
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}>
            Your gateway to the best events is here. Whether you're a sports enthusiast, a music lover, or an art
            aficionado, our platform makes it simple to find, book, and enjoy unforgettable experiences.
          </motion.p>

          <motion.a
            onClick={navToEvents}
            className="inline-block px-8 py-4 bg-[#007EFF] text-white font-medium rounded-lg hover:bg-[#0066cc] transition shadow-lg mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}>
            Start Exploring
          </motion.a>
        </motion.div>
      </section>

      <section className="bg-[#F5F7FC] py-12 md:py-20">
        <div className="relative">
          <div className="max-w-6xl mx-[20px] md:mx-auto flex flex-col md:flex-row items-center gap-10 bg-white rounded-2xl shadow-lg p-12 relative z-10">
            <div className="md:w-1/2 z-20">
              <span className="text-sm font-semibold text-[#007EFF] uppercase block mb-2">
                Find Events That Suit You
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">For Excitement & Engagement</h3>
              <div className="text-gray-700 leading-relaxed mb-4">
                <p>
                  From music festivals to mindfulness retreats — your next unforgettable experience is just a click
                  away. We bring you curated events across interests, cities, and moods — so you can focus on making
                  memories.
                </p>
                <h3 className="font-extrabold text-[#340D7A] mt-6 mb-0">Plan Less. Enjoy More.</h3>
              </div>

              <a
                onClick={navToEvents}
                className="inline-block mt-6 px-6 py-3 border border-[#007EFF] text-[#007EFF] rounded-md font-medium hover:bg-[#E6F2FF] transition">
                Choose Your Next Experience
              </a>
            </div>

            <div className="md:w-1/2 relative w-full">
              <img
                src="https://res.cloudinary.com/dv2n0s4mh/image/upload/v1746600663/card-2_abz5nv.png"
                alt="Reach life goals faster"
                className="md:absolute md:bottom-[-208px] md:right-4 z-10"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
