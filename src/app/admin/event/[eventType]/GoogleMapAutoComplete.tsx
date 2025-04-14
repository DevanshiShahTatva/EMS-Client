"use client"

import React from 'react'
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-google-places-autocomplete'
import { LocationField } from './helper'



interface Props {
  getLocationData: (locationData: LocationField) => void
  label: string,
  name: string,
  required: boolean
  placeholder?: string;
  errorMsg?: string;
  errorKey?: boolean
}

const GoogleAutoComplete: React.FC<Props> = ({
  getLocationData,
  label,
  name,
  required,
  errorKey,
  errorMsg,
  placeholder = "Enter event location"
}) => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY as string;

  return (
    <div className='mb-4'>
      <label
        htmlFor={name}
        className="block text-sm font-bold text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      <GooglePlacesAutocomplete
        apiKey={apiKey}
        debounce={100}
        selectProps={{
          isClearable: false,
          classNamePrefix: "locationField",
          placeholder: placeholder,
          noOptionsMessage: () => null,
          styles: {
            input: (provided) => ({
              ...provided,
              fontSize: "18px",
              fontWeight: "400",
              color: "#667085",
              fontFamily: "Plus Jakarta Sans",
            }),
            control: (provided) => ({
              ...provided,
              background: "white",
              borderRadius: "6px",
              margin: "5px 0",
              height: "48px",
              border : errorKey ? "1px solid #ef4444" : "1px solid #d1d5db"
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: "#fff",
              border: "1px solid #CBD5E1",
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isFocused ? "#ddd" : "#fff",
              color: "#23395D",
              padding: "10px",
              fontSize: "18px",
              fontWeight: "500",
              fontFamily: "Plus Jakarta Sans",
            }),
          },
          onChange: async (event: any) => {
            const location = event?.value?.description ?? "";
            if (!location) return;

            try {
              const results = await geocodeByAddress(location);
              const { lat, lng } = await getLatLng(results[0]);

              const locationData: LocationField = {
                latitude: lat,
                longitude: lng,
                location,
              };

              getLocationData(locationData);
            } catch (err) {
              console.error("Failed to get location data:", err);
            }
          },
        }}
      />

      {errorKey && <p className="text-red-500 text-sm mt-1">{errorMsg}</p>}
    </div>
  )
}

export default GoogleAutoComplete
