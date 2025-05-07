'use client';

import { useState, useEffect, useCallback } from 'react';

// Constant
import { API_ROUTES, FAQ_BANNER_LINK } from '@/utils/constant';

// library support
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from '@/lib/utils';

// types
import { IFaqApiResponse, IFaqData } from '../admin/faqs/types';

// Services
import { apiCall } from '@/utils/services/request';

// Custom component
import { Skeleton } from '@/components/ui/skeleton';


export default function FAQPage() {
  const [loading, setLoading] = useState(false);
  const [faqData, setFaqData] = useState<IFaqData[]>([])

  const fetchFaqsData = useCallback(async () => {
      setLoading(true);
      try {
        const response: IFaqApiResponse = await apiCall({
          endPoint: API_ROUTES.FAQs,
          method: 'GET'
        });
  
        if (response && response.success) {
          const receivedArray = response.data
          setFaqData(receivedArray)
        }
      } catch (err) {
        console.error('Error fetching chart data', err);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchFaqsData()
  },[fetchFaqsData])

  return (
    <section className="p-8">

      <div className="grid grid-cols-12 gap-10 py-16 px-4 md:px-4">
              {/* Left Side: Office Info */}
              <div className="col-span-12 lg:col-span-6 space-y-6">
                <img
                  src={FAQ_BANNER_LINK}
                  alt="FAq"
                  className="w-full h-auto rounded-lg object-contain"
                />
              </div>
      
              {/* Right Side: Contact Form */}
              <div className="col-span-12 lg:col-span-6">
                {/* Insert your form here */}
                  {loading ? <Skeleton className='w-full h-60'/> : <div className="mx-auto bg-white shadow-md rounded-md py-8">
                    <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">Frequently Asked Questions</h1>
                    <div className="space-y-4 p-3">
                          <Accordion type="single" collapsible className="w-full">
                            {faqData.map((faq, index) => (
                              <AccordionItem
                                key={index}
                                value={`item-${index}`}
                                className={cn(
                                  `cursor-pointer px-5 py-2`,
                                  index !== faqData.length - 1 && 'border-b-2 border-gray-200'
                                )}
                              >
                                <AccordionTrigger className="text-lg text-gray-700 font-semibold">{faq.question}</AccordionTrigger>
                                <AccordionContent className='text-md'>
                                  {faq.answer}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                    </div>
                  </div>}
              </div>
            </div>
    </section>
  );
}
