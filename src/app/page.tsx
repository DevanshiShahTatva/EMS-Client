"use client"
import { useRouter, usePathname } from "next/navigation";

// Custom components
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Testimonials from "@/components/common/Testimonials";

// Constsnt imports
import { FEATURES_DATA, ROUTES } from "@/utils/constant";


const Home = () => {
  const router = useRouter()
  const currentPath = usePathname()

  const navToEvents = () => {
    router.push(ROUTES.USER_EVENTS)
  } 

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header activeLink={currentPath} />

      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="py-16 px-8 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Why Choose Evently?
          </h2>
          <div className="grid md:grid-cols-1 gap-10">
            {FEATURES_DATA.map((feature, index) => (
              <div key={index} className="flex flex-col md:flex-row space-x-8 p-6 border rounded-lg shadow-lg bg-white border-gray-200">
                {index % 2 === 0 ?
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div> :
                  <div className="flex-1 mt-4 md:mt-0">
                    <img
                      src={feature.imageUrl}
                      alt={feature.title}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                }

                {index % 2 === 0 ?
                  <div className="flex-1 mt-4 md:mt-0">
                    <img
                      src={feature.imageUrl}
                      alt={feature.title}
                      className="w-full h-auto max-h-90 rounded-lg"
                    />
                  </div>
                  :
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                }
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;