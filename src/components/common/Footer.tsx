import React from 'react'

// Next Library support
import Image from 'next/image'

// Image Paths
import Instagram from "../../../public/assets/instagram.png"
import Facebook from "../../../public/assets/facebook.png"
import Twitter from "../../../public/assets/twitter.png"
import Link from 'next/link'
import { ROUTES } from '@/utils/constant'


function Footer() {
    return (
        <div>
            <footer className="bg-gray-900 text-white py-8 px-6">
                <div className="m-0 md:mx-auto md:text-start text-center flex items-center flex-col md:flex-row md:justify-between gap-4 md:gap-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">Evently</h3>
                        <p className="text-gray-300">Experience more, worry less.</p>
                    </div>
                    <div className="flex flex-col">
                        <h4 className="font-semibold mb-2">Quick Links</h4>
                        <Link href={ROUTES.HOME} className="text-gray-300 hover:underline">Home</Link>
                        <Link href={ROUTES.USER_EVENTS} className="text-gray-300 hover:underline">Browse Events</Link>
                        <Link href={ROUTES.CONTACT_US} className="text-gray-300 hover:underline">Contact Us</Link>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-2">Follow Us</h4>
                        <div className="flex gap-4">
                            <Link href={ROUTES.HOME} className="text-gray-300 hover:text-white">
                                <Image
                                    src={Instagram}
                                    height={24}
                                    width={24}
                                    alt='instaIcons'
                                    className='bg-transparent'
                                />
                            </Link>
                            <Link href={ROUTES.HOME} className="text-gray-300 hover:text-white">
                                <Image
                                    src={Facebook}
                                    height={24}
                                    width={24}
                                    alt='instaIcons'
                                    className='bg-transparent'
                                />
                            </Link>
                            <Link href={ROUTES.HOME} className="text-gray-300 hover:text-white">
                                <Image
                                    src={Twitter}
                                    height={24}
                                    width={24}
                                    alt='instaIcons'
                                    className='bg-transparent'
                                />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="text-center text-gray-400 mt-8 text-sm">
                    © {new Date().getFullYear()} Evently. All rights reserved. || &nbsp;
                    <span className='hover:text-white hover:underline cursor-pointer'>
                        <Link href={ROUTES.TERMS_AND_CONDITIONS}>Terms & Condiotions</Link>
                    </span>
                </div>
            </footer>
        </div>
    )
}

export default Footer