"use client";

import React, { useState, useEffect } from 'react'

// Next Library support
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import Cookie from 'js-cookie';
// Image Paths
import Instagram from "../../../public/assets/instagram.png"
import Facebook from "../../../public/assets/facebook.png"
import Twitter from "../../../public/assets/twitter.png"
import Link from 'next/link'
import { ROUTES } from '@/utils/constant'
import { getAuthToken } from '@/utils/helper'

function Footer() {
    const router = useRouter();

    const [authToken, setAuthToken] = useState("")

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        Cookie.remove("authToken");
        router.push(ROUTES.LOGIN);
    }

    useEffect(() => {
        const token = getAuthToken()
        if (token !== "") {
          setAuthToken(token)
        }
      }, [authToken])

    return (
        <div>
            <footer className="bg-gray-900 text-white py-8 px-10">
                <div className="m-0 md:mx-auto md:text-start text-center flex flex-col items-center md:items-start md:flex-row md:justify-between gap-4 md:gap-6">
                    <div>
                    <Link
                        className="flex title-font font-medium items-center text-gray-900 md:mb-0 w-fit"
                        href={ROUTES.HOME}
                        >
                        <Image
                            src={"/assets/eventlyLogo1.png"}
                            alt='logo'
                            width={130}
                            height={60}
                            style={{ backgroundColor: "white" }}
                        />
                    </Link>
                        {/* <h3 className="text-2xl font-bold mb-2">Evently</h3> */}
                        <p className="text-gray-300">Experience more, worry less.</p>
                    </div>
                    <div className="flex flex-col">
                        <h4 className="font-semibold mb-2">Quick Links</h4>
                        <Link href={ROUTES.HOME} className="text-gray-300 hover:underline">Home</Link>
                        <Link href={ROUTES.USER_EVENTS} className="text-gray-300 hover:underline">Browse Events</Link>
                        {authToken !== "" && (
                            <>
                                <Link href={ROUTES.USER_MY_EVENTS} className="text-gray-300 hover:underline">My Events</Link>
                                <Link href={ROUTES.USER_PROFILE} className="text-gray-300 hover:underline">Profile</Link>
                                <Link href="#" onClick={handleLogout} className="text-gray-300 hover:underline">Logout</Link>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <h4 className="font-semibold mb-2">Support</h4>
                        <Link href={ROUTES.CONTACT_US} className="text-gray-300 hover:underline">Contact Us</Link>
                        <Link href={ROUTES.FAQs} className="text-gray-300 hover:underline">FAQs</Link>
                        <Link href={ROUTES.TERMS_AND_CONDITIONS} className="text-gray-300 hover:underline">Terms & Conditions</Link>
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
                    Copyright © {new Date().getFullYear()} All Rights Reserved. 
                </div>
            </footer>
        </div>
    )
}

export default Footer