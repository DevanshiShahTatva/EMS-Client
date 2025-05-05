import React from 'react'

// Next Support 
import { useRouter } from 'next/navigation';

// Constsnt imports
import { ROUTES } from "@/utils/constant";


const HeroSection = () => {
    const router = useRouter()

    const navToEvents = () => {
        router.push(ROUTES.USER_EVENTS)
    }
    return (
        <section className="flex flex-col items-center justify-center flex-1 text-center bg-gradient-to-b from-indigo-50 to-white p-8">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-gray-800">
                Find and Book Your Next Event
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-2xl">
                Concerts, festivals, workshops, and more — explore unforgettable experiences.
            </p>
            <button onClick={navToEvents} className="px-8 py-3 bg-indigo-600 text-white rounded-full font-black cursor-pointer hover:bg-indigo-700 text-lg">
                Browse Events
            </button>
        </section>
    )
}

export default HeroSection