import { useCallback, useState } from 'react';

export const useModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const openModal = useCallback((title = '') => {
    setModalTitle(title);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalTitle('');
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    modalTitle,
    openModal,
    closeModal,
  };
};
