"use client";

import React, { useEffect, useState } from 'react';
import CustomTextField from '../admin-components/InputField';

interface ICoinRedeemCardProps {
  totalUserCoins: number;
  conversionRate: number;
  totalAmount: number;
  setUsedPoints: (value: number) => void;
}

const CoinRedeemCard = ({
  totalUserCoins,
  totalAmount,
  conversionRate,
  setUsedPoints
}: ICoinRedeemCardProps) => {

  const [toggleOn, setToggleOn] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const maxValue = Math.min(totalUserCoins, totalAmount * conversionRate);

  useEffect(() => {
    if (totalAmount * conversionRate < Number(inputValue)) {
      setUsedPoints(totalAmount * conversionRate);
      setInputValue((totalAmount * conversionRate).toString());
    }
  }, [totalAmount]);

  const handleToggle = () => {
    if (!toggleOn) {
      setInputValue('');
    } else {
      setUsedPoints(0);
    }
    setToggleOn(!toggleOn);
  };

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && Number(value) <= maxValue) {
      setInputValue(value);
      setUsedPoints(value);
    }
  };

  const coinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="32" height="32" aria-hidden="true">
      <g transform="translate(1.4 1.4) scale(2.8)">
        <circle cx="45" cy="45" r="42" style={{ fill: "#EFA500" }} />
        <path d="M52.856 71.387c-.845 0-1.685-.354-2.277-1.046L32.848 49.679c-.763-.89-.938-2.142-.449-3.207.49-1.064 1.554-1.747 2.726-1.747h10.075c4.492 0 8.146-3.654 8.146-8.146s-3.654-8.146-8.146-8.146H35.125c-1.657 0-3-1.343-3-3s1.343-3 3-3h10.075c7.801 0 14.146 6.346 14.146 14.146S53 50.725 45.199 50.725h-3.547l13.479 15.708c1.079 1.258.935 3.151-.322 4.23-.566.484-1.261.722-1.953.722z" style={{ fill: "#F68E00" }} />
        <path d="M62.876 28.432H35.125c-1.657 0-3-1.343-3-3s1.343-3 3-3h27.751c1.657 0 3 1.343 3 3s-1.343 3-3 3z" style={{ fill: "#F68E00" }} />
        <path d="M62.876 39.578H35.125c-1.657 0-3-1.343-3-3s1.343-3 3-3h27.751c1.657 0 3 1.343 3 3s-1.343 3-3 3z" style={{ fill: "#F68E00" }} />
        <path d="M46.732 83.853C26.752 82.186 11 65.403 11 45S26.752 7.814 46.732 6.147V.132C23.44 1.813 5 21.287 5 45c0 23.713 18.44 43.187 41.732 44.868v-6.015z" style={{ fill: "#F68E00" }} />
        <path d="M45 90C20.187 90 0 69.813 0 45S20.187 0 45 0s45 20.187 45 45-20.187 45-45 45zm0-84C23.495 6 6 23.495 6 45s17.495 39 39 39 39-17.495 39-39S66.505 6 45 6z" style={{ fill: "#FFDE50" }} />
        <path d="M48.856 71.387c-.845 0-1.685-.354-2.277-1.046L28.848 49.679c-.763-.89-.938-2.142-.449-3.207.49-1.064 1.554-1.747 2.726-1.747h10.075c4.492 0 8.146-3.654 8.146-8.146s-3.654-8.146-8.146-8.146H31.125c-1.657 0-3-1.343-3-3s1.343-3 3-3h10.075c7.801 0 14.146 6.346 14.146 14.146S49 50.725 41.199 50.725h-3.547l13.479 15.708c1.079 1.258.935 3.151-.322 4.23-.566.484-1.261.722-1.953.722z" style={{ fill: "#FFDE50" }} />
        <path d="M58.876 28.432H31.125c-1.657 0-3-1.343-3-3s1.343-3 3-3h27.751c1.657 0 3 1.343 3 3s-1.343 3-3 3z" style={{ fill: "#FFDE50" }} />
        <path d="M58.876 39.578H31.125c-1.657 0-3-1.343-3-3s1.343-3 3-3h27.751c1.657 0 3 1.343 3 3s-1.343 3-3 3z" style={{ fill: "#FFDE50" }} />
      </g>
    </svg>
  );

  return (
    <div className={`flex items-start gap-5 p-4 border bg-white shadow-lg rounded-lg w-full max-w-xl ${toggleOn ? 'pb-0' : ''}`}>
      <div className="flex items-center">
        <div className='pt-[6px]'>
          {coinIcon()}
        </div>
      </div>
      <div className='w-full'>
        <div className='flex justify-between'>
          <div>
            <div className="font-semibold text-gray-800">Redeem Coins</div>
            <div className="text-sm text-gray-500">
              Redeemable coins: {maxValue} | Total coins: {totalUserCoins}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="inline-flex relative items-center cursor-pointer">
              <span className="sr-only">Toggle coin redemption</span>
              <input
                type="checkbox"
                checked={toggleOn}
                className="sr-only peer"
                onChange={handleToggle}
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:left-[2px] after:top-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
          </div>
        </div>
        {toggleOn && (
          <div className='mt-2'>
            <CustomTextField
              label=""
              name="points"
              type="number"
              errorKey={false}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={`Max ${maxValue}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinRedeemCard;