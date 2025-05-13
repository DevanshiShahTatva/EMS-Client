"use client";

import { useEffect, useState, useRef } from 'react';

// Next js library support
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Custom compponents
import { API_ROUTES, ROUTES, USER_HEADER_ITEMS } from '@/utils/constant';

// Custom helpers
import { getAuthToken, getUserLogo, setUserLogo, setUserName, getUserName } from '@/utils/helper';

// Other library
import Cookie from 'js-cookie'
import { TicketsIcon, UserCircle, LogOut, Calendar } from 'lucide-react';

// images path
import CrossIconPath from "../../../public/assets/CrossIcon.svg"
import { apiCall } from '@/utils/services/request';
import { setUserLatLong } from '@/app/events/event-helper';



interface HeaderPageProps {
  toggleSidebar?: () => void,
  isAdmiRole?: boolean
  activeLink? : string
}

const Header: React.FC<HeaderPageProps> = ({ toggleSidebar, isAdmiRole = false, activeLink = "" }) => {

  const [authToken, setAuthToken] = useState("")
  const [logo, setLogo] = useState("")
  const [name, setName] = useState("");
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

  const navToCalender = () => {
    setIsDropdownOpen(false);
    router.push(ROUTES.USER_MY_CALENDER);
  }

  const navToRewardPoint = () => {
    setIsDropdownOpen(false);
    router.push(ROUTES.USER_REWARDED_HISTORY);
  }

  const fetchUserInfo = async () => {
    const result = await apiCall({
       method: "GET",
       endPoint: API_ROUTES.USER.USER_DETAILS,
       withToken: true
    })

    if(result?.success) {
      const receivedObj = result.data[0]

      const userInfo = {
        "_id": receivedObj._id,
        "name": receivedObj.name,
        "email": receivedObj.email,
        "country": receivedObj.country,
        "state": receivedObj.state,
        "city": receivedObj.city,
        "address": receivedObj.address !== null ? receivedObj.address : "",
        "profileimage": receivedObj.profileimage === null ? "" : receivedObj.profileimage.url,
        "latitude": receivedObj.latitude,
        "longitude": receivedObj.longitude
      }

      setUserLogo(userInfo.profileimage);
      setUserName(userInfo.name);
      setUserLatLong(userInfo.latitude, userInfo.longitude);
      setLogo(userInfo.profileimage);
      setName(userInfo.name);
    }
  }

  useEffect(() => {
    const token = getAuthToken()
    if (token !== "") {
      setAuthToken(token)
    }
  }, [authToken])

  useEffect(() => {
    const handleLogoUpdate = () => {
      const updatedLogo = getUserLogo();
      setLogo(updatedLogo);
    };
  
    window.addEventListener("userLogoUpdated", handleLogoUpdate);
  
    return () => {
      window.removeEventListener("userLogoUpdated", handleLogoUpdate);
    };
  }, []);

  useEffect(() => {
    const logoUrl = getUserLogo()
    if (logoUrl !== "") {
      setLogo(logoUrl)
    }
  }, [logo])

  useEffect(() => {
    const name = getUserName();
    name && setName(name);
  }, [name]);

  useEffect(() => {
    const token = getAuthToken()
    if (!isAdmiRole && token !== "") {
      fetchUserInfo()
    }
  }, [isAdmiRole])

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
        <div className="mx-auto flex flex-wrap py-3 flex-row items-center justify-between px-2 md:px-10">
          <button
            onClick={() => {
              isAdmiRole
              ? toggleSidebar?.()
              : setIsMobileMenuOpen(!isMobileMenuOpen)
            }}
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
                <div ref={menuRef} className='relative'>
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center p-2 bg-white rounded-md w-max cursor-pointer space-x-2 md:space-x-4"
                  >
                    {logo !== "" ?
                      <Image
                        height={30}
                        width={30}
                        src={logo}
                        alt="Logo"
                        className="rounded-full h-[30px] w-[30px] object-cover"
                      />
                      :
                      <button className='h-10 w-10 rounded-full bg-indigo-600 text-white font-bold relative cursor-pointer'>
                        {isAdmiRole ? "A" : name.charAt(0).toUpperCase()}
                      </button>
                    }
                    <div className='hidden md:block'>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{isAdmiRole ? "Admin" : name}</div>
                      <div className="text-xs text-gray-500">{isAdmiRole ? "Admin" : "User"}</div>
                    </div>
                    </div>
                    <button className="ml-auto focus:outline-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                  </div>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 top-[43px] bg-white rounded-[8px] shadow-lg border border-gray-200 py-2 z-50 w-[195px]">
                      {!isAdmiRole && (
                        <>
                          <button onClick={navToProfile} className="flex items-center w-full px-4 py-2 font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer">
                            <UserCircle className="w-5 h-5 mr-3" />
                            Profile
                          </button>
                          <button onClick={navToMyEvents} className="flex items-center w-full px-4 py-2 font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer">
                            <TicketsIcon className="w-5 h-5 mr-3" />
                            My Events
                          </button>
                          <button onClick={navToCalender} className="flex items-center w-full px-4 py-2 font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer">
                            <Calendar className="w-5 h-5 mr-3" />
                            My Calender
                          </button>
                          <button onClick={navToRewardPoint} className="flex items-center w-full px-4 py-2 font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer">
                            <Calendar className="w-5 h-5 mr-3" />
                            My Reward Point
                          </button>
                        </>
                      )}
                      <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 font-semibold text-gray-500 hover:bg-gray-100 cursor-pointer">
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
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