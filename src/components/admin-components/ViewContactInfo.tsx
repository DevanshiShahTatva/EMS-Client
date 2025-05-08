import React from 'react';

// library support
import { XMarkIcon } from "@heroicons/react/24/solid";

// types
import { IRequestType } from '@/app/admin/contact-us/types';
import DisabledTextField from './DisabledTextFileds';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactInfo : IRequestType
}



const ContactModal: React.FC<ContactModalProps> = ({
  contactInfo,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-45 flex items-center justify-center bg-black/60 bg-opacity-40">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-xl relative">
        {/* Title Section Start */}
        <div className="flex justify-between items-center border-b-1 px-6 py-5 border-b-gray-300">
          <p className="font-bold text-2xl">Contact Info</p>
          <XMarkIcon onClick={onClose} className="h-6 w-6 cursor-pointer" />
        </div>
        {/* Title Section End */}

        <div className="max-h-[500px] overflow-auto scrollbar-none px-6 py-2">
          {/* Content UI Start */}

                  <DisabledTextField
                      name='name'
                      label='Name'
                      value={contactInfo.name}
                      type='text'
                  />

                  <DisabledTextField
                      name='email'
                      label='Email Address'
                      value={contactInfo.email}
                      type='email'
                  />

                  <DisabledTextField
                      name='subject'
                      label='Subject'
                      value={contactInfo.subject}
                      type='text'
                  />

                  <DisabledTextField
                      name='message'
                      label='Message'
                      value={contactInfo.message}
                      type='textarea'
                  />

          {/* Content UI End*/}
        </div>

      </div>
    </div>
  );
};

export default ContactModal;
