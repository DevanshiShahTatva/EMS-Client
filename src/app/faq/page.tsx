'use client';

import { useState, useEffect, useCallback } from 'react';

// library support
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// custom components
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// types 
import { IFaqApiResponse, IFaqData } from '../admin/faqs/types';

// constatnt
import { API_ROUTES, FAQ_BANNER_LINK } from '@/utils/constant';

// service
import { apiCall } from '@/utils/services/request';

export default function FAQPage() {
  const [loading, setLoading] = useState(false);
  const [faqData, setFaqData] = useState<IFaqData[]>([]);

  const fetchFaqsData = useCallback(async () => {
    setLoading(true);
    try {
      const response: IFaqApiResponse = await apiCall({
        endPoint: API_ROUTES.FAQs,
        method: 'GET'
      });

      if (response && response.success) {
        setFaqData(response.data);
      }
    } catch (err) {
      console.error('Error fetching FAQ data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqsData();
  }, [fetchFaqsData]);

  return (
    <section className="bg-gray-100 py-10 px-4 sm:px-6 md:px-8">
      <div className="mx-auto flex flex-col lg:flex-row gap-10 items-start">
        {/* Left Side: Banner Image */}
        <div className="w-full lg:w-1/2">
          <img
            src={FAQ_BANNER_LINK}
            alt="FAQ banner"
            className="w-full h-auto rounded-xl object-contain"
          />
        </div>

        {/* Right Side: FAQs */}
        <div className="w-full lg:w-1/2">
          {loading ? (
            <Skeleton className="w-full h-60 aspect-square rounded-md" />
          ) : (
            <div className="bg-white shadow-md rounded-md p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-6">
                Frequently Asked Questions
              </h1>
              <Accordion type="single" collapsible className="w-full space-y-2">
                {faqData.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className={cn(
                      "cursor-pointer px-3 py-2",
                      index !== faqData.length - 1 && "border-b border-gray-200"
                    )}
                  >
                    <AccordionTrigger className="text-base sm:text-lg text-gray-900 font-semibold aria-expanded:text-blue-500">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm sm:text-base text-gray-600">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
