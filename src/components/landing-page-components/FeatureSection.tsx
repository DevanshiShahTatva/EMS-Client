import React from 'react'

// Constsnt imports
import { FEATURES_DATA } from '@/utils/constant'

const FeatureSection = () => {
    return (
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
  )
}

export default FeatureSection