import React from 'react';

// types
import { IRequestType } from '@/app/admin/contact-us/types';
import DisabledTextField from './DisabledTextFileds';
import ModalLayout from '../common/CommonModalLayout';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  contactInfo: IRequestType
}



const ContactModal: React.FC<ContactModalProps> = ({
  contactInfo,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <ModalLayout
      onClose={onClose}
      modalTitle='Contact Info'
      maxHeight='500px'
    >
      <div>
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
        <p className='h-5' />

        {/* Content UI End*/}
      </div>
    </ModalLayout>
  );
};

export default ContactModal;
