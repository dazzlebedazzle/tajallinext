'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import './Whatsappchatmodal.css';
import whataapimage from '../../../public/assets/WhatsApp_icon.webp'

const WhatsAppChatModal = ({ phoneNumber, message }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div>
      <button className="whatsapp-chat-button" onClick={openModal}>
        <Image
          src={whataapimage}
          width={100}
          height={100}
          alt="WhatsApp Chat"
          loading="lazy"
          style={{ width: '50px', height: '50px' }}
        />
      </button>

    </div>
  );
};

export default WhatsAppChatModal;
