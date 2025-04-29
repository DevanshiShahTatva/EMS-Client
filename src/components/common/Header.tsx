"use client";

import { useEffect, useState, useRef } from 'react';

// Next js library support
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Custom compponents
import { ROUTES, USER_HEADER_ITEMS } from '@/utils/constant';
import { Button } from "@/components/ui/button"

// Custom helpers
import { getAuthToken } from '@/utils/helper';

// Other library
import Cookie from 'js-cookie'
import { TicketsIcon, UserCircle } from 'lucide-react';

// images path
import CrossIconPath from "../../../public/assets/CrossIcon.svg"

interface HeaderPageProps {
  toggleSidebar?: () => void,
  isAdmiRole?: boolean
  activeLink? : string
}

const Header: React.FC<HeaderPageProps> = ({ toggleSidebar, isAdmiRole = false, activeLink = "" }) => {

  const [authToken, setAuthToken] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter()

  const navToLogIn = () => {
    router.push(ROUTES.LOGIN)
  }

  const navToSignUp = () => {
    router.push(ROUTES.SIGN_UP)
  }

  const handleLogout = () => {
    localStorage.clear()
    sessionStorage.clear()
    Cookie.remove("authToken")
    router.push(ROUTES.LOGIN)
  }

  const navToProfile = () => {
    setIsDropdownOpen(false)
    router.push(ROUTES.USER_PROFILE)
  }

  const navToMyEvents = () => {
    setIsDropdownOpen(false)
    router.push(ROUTES.USER_MY_EVENTS)
  }

  useEffect(() => {
    const token = getAuthToken()
    if (token !== "") {
      setAuthToken(token)

    }
  }, [authToken])

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <header className="text-gray-600 body-font border-b border-b-gray-200">
        <div className="mx-auto flex flex-wrap py-5 px-10 flex-row items-center justify-between">
          <div className="flex gap-2">
            <Link
              className="flex title-font font-medium items-center text-gray-900 md:mb-0"
              href={ROUTES.HOME}
            >
              <Image
                src={"/assets/eventlyLogo1.png"}
                alt='logo'
                className='object-contain'
                width={130}
                height={60}
              />
            </Link>

            {isAdmiRole && (
              <button
                onClick={toggleSidebar}
                className="text-gray-700 ml-3 md:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            )}
          </div>

          {!isAdmiRole &&
            <>
              <nav className="hidden md:flex gap-6 text-gray-700">
                {USER_HEADER_ITEMS.map(item =>
                  <Link key={item.id} href={item.route} className={`font-bold  ${activeLink === item.route ? "text-blue-500" : "text-gray-500"}`}>
                    {item.title}
                  </Link>
                )
                }
              </nav>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-gray-700 focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>

              {/* Mobile Navigation */}
              {isMobileMenuOpen && (
              <div className={`fixed z-40 top-0 left-0 w-full h-full bg-white shadow-md md:hidden transition-transform duration-300 ease-in-out transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${isMobileMenuOpen ? "block" : "hidden"
                    } md:hidden flex justify-end p-6`}
                >
                  <Image
                    src={CrossIconPath}
                    alt="cross-icon"
                    width={40}
                    height={40}
                    className="font-bold"
                  />
                </div>
                <div className='flex flex-col items-center gap-6 p-6'>
                  {USER_HEADER_ITEMS.map(item => (
                    <Link
                      key={item.id}
                      href={item.route}
                      className={`font-bold text-lg text-gray-500 ${activeLink.includes(item.route) && "text-blue-500"}`}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
                </div>
              )}
            </>
          }

          <div className="flex gap-4 items-center">
            {authToken !== "" ? (
              <div className="flex gap-4 items-center">
                {isAdmiRole ?
                  <div className='hover:underline cursor-pointer text-gray-500 font-semibold'>
                     admin@evently.com
                  </div>
                 : 
                  <div ref={menuRef}>
                    <Image
                      src={"/assets/ProfileIcon.svg"}
                      width={40}
                      height={40}
                      alt="Logo"
                      className="cursor-pointer relative"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    />

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute right-10 mt-2 top-15 bg-white rounded-[8px] shadow-lg border border-gray-200 py-2 z-50">
                        <button onClick={navToProfile} className="flex items-center w-full px-4 py-2 font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer">
                          <UserCircle className="w-5 h-5 mr-3" />
                          Profile
                        </button>
                        <button onClick={navToMyEvents} className="flex items-center w-full px-4 py-2 font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer">
                          <TicketsIcon className="w-5 h-5 mr-3" />
                          My Events
                        </button>
                      </div>
                    )}
                  </div>
                }

                <Button
                  variant="link"
                  onClick={handleLogout}
                  className="cursor-pointer text-base"
                >
                  Logout
                </Button>
              </div>
            ) : (
                <div className="flex gap-4">
                  <button onClick={navToLogIn} className="px-4 py-2 cursor-pointer border border-indigo-600 text-indigo-600 font-semibold rounded-lg hover:bg-indigo-50">
                    Login
                  </button>
                  <button onClick={navToSignUp} className="px-4 py-2 cursor-pointer font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                    Signup
                  </button>
                </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}

export default Header