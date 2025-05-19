"use client"
import React, { useState , useEffect, useCallback, useMemo } from 'react';

// Next library
import Link from 'next/link';

// Custom Components
import { Skeleton } from '@/components/ui/skeleton';

// Constant imports
import { ROUTES } from '@/utils/constant';

// types
import { ITermsResponse } from '../admin/terms-and-conditions/types';

// Services
import { apiCall } from '@/utils/services/request'

// Constants
import { API_ROUTES } from '@/utils/constant'

// library
import he from 'he';

// CSS
import "../termsContent.css"

const TermsAndConditions = () => {

  const [termsContent, setTermsContent] = useState("")
  const [loader, setLoader] = useState(false)

  const getTermsContent = useCallback(async () => {
    setLoader(true);
    try {
      const response: ITermsResponse = await apiCall({
        endPoint: API_ROUTES.TERMS_AND_CONDITIONS,
        method: 'GET'
      });

      if (response && response.success) {
        const receivedObject = response.data
        setTermsContent(receivedObject.content)
      }
    } catch (err) {
      console.error('Error fetching chart data', err);
    } finally {
      setLoader(false);
    }
  }, []);

  useEffect(() => {
    getTermsContent()
  }, [getTermsContent])

   const decodedHTML = useMemo(()=>he.decode(termsContent),[termsContent]);

  return (
    <div>

      <section className="bg-gray-100 py-10 px-4 sm:px-6 md:px-8">
        <div className="mx-auto h-full flex justify-center ">
            {loader ?
              <Skeleton className='max-h-[auto] lg:max-h-[650px] w-full aspect-square' /> :
              <div className=" bg-white p-6 w-full rounded-lg shadow-lg">
                <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Terms & Conditions</h1>

                <div className='terms-and-conditions' dangerouslySetInnerHTML={{ __html: decodedHTML }} />

                <div className="text-lg text-gray-700 mt-6">
                  <p>
                    If you have any questions about these Terms & Conditions, please feel free to <Link href={ROUTES.CONTACT_US} className="text-indigo-600 hover:underline">contact us</Link>.
                  </p>
                </div>
              </div>
            }
        </div>
      </section>
    </div>
  );
}

export default TermsAndConditions;
