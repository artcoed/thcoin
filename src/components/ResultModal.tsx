import React, { useEffect, useState } from 'react';
import { ReactComponent as WinIcon } from '../assets/roulette/winIcon.svg';
import { ReactComponent as LoseIcon } from '../assets/roulette/loseIcon.svg';
import { useTranslation } from '../lib/i18n';
import styles from './ResultModal.module.css';

interface ResultModalProps {
  isOpen: boolean;
  isWin: boolean;
  amount: number;
  timeRemaining?: number; // в секундах
  onClose: () => void;
  gameType: 'trading' | 'roulette';
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  isWin,
  amount,
  timeRemaining,
  onClose,
  gameType
}) => {
  const { t } = useTranslation();
  const [timeLeft, setTimeLeft] = useState(timeRemaining || 0);

  // Обратный отсчет времени
  useEffect(() => {
    if (!isOpen || !timeRemaining) return;

    setTimeLeft(timeRemaining);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, timeRemaining]);

  // Форматирование времени
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.content}>
          {/* Иконка результата */}
          <div className={`${styles.iconContainer} ${isWin ? styles.win : styles.lose}`}>
            {isWin ? (
              <WinIcon className={styles.icon} />
            ) : (
              <LoseIcon className={styles.icon} />
            )}
          </div>

          {/* Заголовок */}
          <h2 className={`${styles.title} ${isWin ? styles.winText : styles.loseText}`}>
            {isWin ? t('result-win-title') : t('result-lose-title')}
          </h2>

          {/* Сумма */}
          <div className={styles.amount}>
            {isWin 
              ? t('result-win-amount', { amount: amount.toFixed(2) })
              : t('result-lose-amount', { amount: amount.toFixed(2) })
            }
          </div>

          {/* Оставшееся время */}
          {timeLeft > 0 && (
            <div className={styles.timeRemaining}>
              {t('result-time-remaining', { time: formatTime(timeLeft) })}
            </div>
          )}

          {/* Кнопка продолжения */}
          <button 
            className={`${styles.continueButton} ${isWin ? styles.winButton : styles.loseButton}`}
            onClick={onClose}
          >
            {t('result-continue')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal; 