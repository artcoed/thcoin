import React, {useState, useEffect} from 'react';
import styles from './RouletteRegistrationBlock.module.css';
import { ReactComponent as ToastIcon } from '../assets/regstration/toastIcon.svg';
import buxImage from '../assets/regstration/bux.png';
import BaseInput from "./BaseInput";
import { useAppContext } from '../context/AppContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { registerUser } from '../store/slices/userSlice';
import { telegramUtils } from '../lib/telegram';
import { useTranslation } from '../lib/i18n';

function RouletteRegistrationBlock() {
  const { t } = useTranslation();
  const [toast, setToast] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const { navigateTo } = useAppContext();
  const dispatch = useAppDispatch();
  const { loading, error, user } = useAppSelector(state => state.user);
  
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    city: '',
    phone: '',
    iban: ''
  });

  // Проверяем, есть ли уже пользователь
  useEffect(() => {
    if (user) {
      navigateTo('main');
    }
  }, [user, navigateTo]);

  // Показываем ошибку как toast
  useEffect(() => {
    if (error) {
      setToast(error);
      setTimeout(() => setToast(null), 3000);
    }
  }, [error]);

  // Инициализируем Telegram WebApp и получаем отладочную информацию
  useEffect(() => {
    telegramUtils.initWebApp();
    
    // Получаем отладочную информацию
    const info = telegramUtils.getDebugInfo();
    setDebugInfo(info);
    console.log('Telegram debug info on mount:', info);
  }, []);

  const handleRegistration = () => {
    // Валидация
    if (!formData.fullName || !formData.age || !formData.city || !formData.phone || !formData.iban) {
      setToast(t('registration-error-fields'));
      setTimeout(() => setToast(null), 3000);
      return;
    }

    // Проверяем, запущено ли приложение в Telegram
    if (!telegramUtils.isTelegramWebApp()) {
      setToast('Приложение должно быть запущено в Telegram');
      setTimeout(() => setToast(null), 3000);
      return;
    }

    // Получаем telegramId из Telegram
    const telegramId = telegramUtils.getTelegramId();
    console.log('Telegram ID:', telegramId); // Для отладки
    
    if (!telegramId) {
      // Проверяем, есть ли данные пользователя
      const user = telegramUtils.getUser();
      console.log('Telegram user data:', user); // Для отладки
      
      if (!user) {
        setToast('Не удалось получить данные пользователя из Telegram. Убедитесь, что приложение запущено в Telegram WebApp.');
      } else {
        setToast('Не удалось получить ID пользователя из Telegram.');
      }
      setTimeout(() => setToast(null), 5000);
      return;
    }

    // Отправляем запрос на регистрацию
    dispatch(registerUser({
      telegramId,
      fullName: formData.fullName,
      age: parseInt(formData.age),
      city: formData.city,
      contact: formData.phone,
      accountNumber: formData.iban
    }));
  };

  return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          {toast && (
              <div className={styles.toastContainer}>
                <ToastIcon className={styles.toastIcon} />
                <div className={styles.toastText}>
                  { toast }
                </div>
              </div>
          )}

          {/* Отладочная информация (только в development) */}
          {process.env.NODE_ENV === 'development' && debugInfo && (
            <div style={{ 
              background: '#f0f0f0', 
              padding: '10px', 
              margin: '10px', 
              fontSize: '12px',
              border: '1px solid #ccc'
            }}>
              <strong>Debug Info:</strong><br/>
              Is Telegram WebApp: {debugInfo.isTelegramWebApp.toString()}<br/>
              Has User: {debugInfo.hasUser.toString()}<br/>
              Has InitData: {debugInfo.hasInitData.toString()}<br/>
              User Data: {JSON.stringify(debugInfo.userData, null, 2)}<br/>
              InitData: {debugInfo.initData ? 'Available' : 'Not available'}<br/>
              <button 
                onClick={() => {
                  const newInfo = telegramUtils.getDebugInfo();
                  setDebugInfo(newInfo);
                  console.log('Updated debug info:', newInfo);
                }}
                style={{ marginTop: '5px', padding: '2px 5px' }}
              >
                Refresh Debug Info
              </button>
            </div>
          )}

          <img
              className={styles.buxImage}
              src={buxImage}
              alt="bux image"
          />

          <div className={styles.registrationTitle}>
            {t('registration-title')}
          </div>

          <div className={styles.inputsContainer}>
            <div className={styles.inputTitle}>
              {t('registration-fullname')}
            </div>
            <BaseInput
              placeholder={t('registration-fullname')}
              value={formData.fullName}
              onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
            />
            <div className={styles.inputTitle}>
              {t('registration-age')}
            </div>
            <BaseInput
              placeholder={t('registration-age')}
              value={formData.age}
              onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
            />
            <div className={styles.inputTitle}>
              {t('registration-city')}
            </div>
            <BaseInput
              placeholder={t('registration-city')}
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            />
            <div className={styles.inputTitle}>
              {t('registration-phone')}
            </div>
            <BaseInput
              placeholder={t('registration-phone')}
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            />
            <div className={styles.inputTitle}>
              {t('registration-iban')}
            </div>
            <BaseInput
              placeholder={t('registration-iban')}
              value={formData.iban}
              onChange={(e) => setFormData(prev => ({ ...prev, iban: e.target.value }))}
            />
          </div>

          <button
            className={styles.registrationButton}
            onClick={handleRegistration}
            disabled={loading}
          >
            {loading ? t('registration-loading') : t('registration-button')}
          </button>
        </div>
      </div>
  );
}

export default RouletteRegistrationBlock;