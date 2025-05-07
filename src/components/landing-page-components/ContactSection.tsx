import React from "react";

// Next Support
import { useRouter } from "next/navigation";

// Constsnt imports
import { ROUTES } from "@/utils/constant";

const ContactSection = () => {
  const router = useRouter();
  const navToFAQs = () => {
    router.push(ROUTES.FAQs);
  };

  const navToContact = () => {
    router.push(ROUTES.CONTACT_US);
  };

  return (
    <>
      <section className="bg-[#F5F7FC]  py-12 md:py-20 md:pb-40">
        <div className="max-w-4xl mx-[20px] md:mx-auto text-center  rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Have any questions? We've got your back.</h2>
          <p className="text-gray-600 mb-6">
            Our support team is always ready to help you navigate, answer your queries, and ensure you have a smooth and
            enjoyable experience. Don’t hesitate to reach out — we’ve got your back!
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              onClick={navToFAQs}
              className="inline-block px-6 py-3 border border-[#007EFF] text-[#007EFF] font-medium rounded-md hover:bg-[#E6F2FF]  transition cursor-pointer">
              View our FAQs
            </a>
            <a
              onClick={navToContact}
              className="inline-block px-6 py-3 bg-[#007EFF] text-white font-medium rounded-md hover:bg-[#0066cc] transition cursor-pointer">
              Contact us
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactSection;
