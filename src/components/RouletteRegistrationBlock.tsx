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

  // Инициализируем Telegram WebApp
  useEffect(() => {
    telegramUtils.initWebApp();
  }, []);

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
                    onClick={() => {
                      // Валидация
                      if (!formData.fullName || !formData.age || !formData.city || !formData.phone || !formData.iban) {
                        setToast(t('registration-error-fields'));
                        setTimeout(() => setToast(null), 3000);
                        return;
                      }

                      // Получаем telegramId из Telegram
                      const telegramId = telegramUtils.getTelegramId();
                      if (!telegramId) {
                        setToast(t('registration-error-telegram'));
                        setTimeout(() => setToast(null), 3000);
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
                    }}
                    disabled={loading}
                  >
                    {loading ? t('registration-loading') : t('registration-button')}
                  </button>
        </div>
      </div>
  );
}

export default RouletteRegistrationBlock;