'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { FAQs_DATA } from '@/utils/constant';


export default function FAQPage() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 px-8">
      <div className="mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {FAQs_DATA.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg border-2 border-gray-100 overflow-hidden transition-all">
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full p-6 text-left cursor-pointer"
              >
                <span className="text-lg font-bold text-gray-600">{faq.question}</span>
                {activeIndex === index ? (
                  <ChevronUpIcon className="h-6 w-6 text-gray-700" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6 text-gray-700" />
                )}
              </button>
              <div
                className={`px-6 pb-6 text-gray-600 transition-all duration-300 ${
                  activeIndex === index ? 'block' : 'hidden'
                }`}
              >
                {faq.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
