"use client";

import React from 'react';
import "./ConfirmationModal.css"; // Use CSS Modules for styling

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className='modal-overlay'>
      <div className='modal-container'>
        <h3>{message}</h3>
        <div className='modal-actions'>
          <button onClick={onConfirm}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;