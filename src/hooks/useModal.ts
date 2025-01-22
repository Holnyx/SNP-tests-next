import { useState } from 'react';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');

  const openModal = (modalTitle: string = '') => {
    setTitle(modalTitle);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTitle('');
  };

  return {
    isOpen,
    title,
    openModal,
    closeModal,
  };
};

export default useModal;