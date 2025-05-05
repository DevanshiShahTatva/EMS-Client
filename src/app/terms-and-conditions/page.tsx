"use client"
import React from 'react';

// Constant imports
import { ROUTES, TERMS_DATA } from '@/utils/constant';
import Link from 'next/link';

const TermsAndConditions = () => {
  return (
    <div className="bg-gray-100 p-10">
      <div className="mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Terms & Conditions</h1>

        {/* Map through the terms array to generate the sections */}
        {TERMS_DATA.map((term, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{term.title}</h2>
            <p className="text-lg text-gray-700">{term.content}</p>
          </div>
        ))}

        <div className="text-lg text-gray-700 mt-6">
          <p>
            If you have any questions about these Terms & Conditions, please feel free to <Link href={ROUTES.CONTACT_US} className="text-indigo-600 hover:underline">contact us</Link>.
          </p>
        </div>
      </div>

    </div>
  );
}

export default TermsAndConditions;
