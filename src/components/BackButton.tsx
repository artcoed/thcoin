import React from 'react';
import { ReactComponent as BackArrowIcon } from '../assets/roulette/backArrow.svg';
import { useAppContext } from '../context/AppContext';
import styles from './BackButton.module.css';

interface BackButtonProps {
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ className }) => {
  const { goBack } = useAppContext();

  return (
    <button 
      className={`${styles.backButton} ${className || ''}`}
      onClick={goBack}
    >
      <BackArrowIcon className={styles.backIcon} />
      Назад
    </button>
  );
};

export default BackButton; 