import React, {useState} from 'react';
import styles from './Navbar.module.css';
import { ReactComponent as Withdraw } from '../assets/nav/withdraw.svg';
import { ReactComponent as Manager } from '../assets/nav/manager.svg';
import { ReactComponent as History } from '../assets/nav/history.svg';
import { ReactComponent as Success } from '../assets/withdraw/success.svg';
import { useAppContext } from '../context/AppContext';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { apiClient } from '../lib/api';

function Navbar() {
    const [isShowModal, setIsShowModal] = useState(false);
    const [isShowToast, setIsToast] = useState(false);
    const [withdrawLoading, setWithdrawLoading] = useState(false);
    const { navigateTo } = useAppContext();
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.user);

    const openWithdrawWindow = () => {
        setIsShowModal(true);
    }

    const cancelWithdraw = () => {
        setIsShowModal(false);
    }

    const withdraw = async () => {
        if (!user) return;
        
        setWithdrawLoading(true);
        try {
            await apiClient.requestWithdrawal({
                botId: 1, // Временно, будет получен из конфига
                userId: user.user_id,
                amount: user.balance,
                accountNumber: user.account_number || ''
            });
            
            setIsShowModal(false);
            setIsToast(true);
            setTimeout(() => {
                setIsToast(false);
            }, 2000);
        } catch (error) {
            console.error('Withdrawal failed:', error);
        } finally {
            setWithdrawLoading(false);
        }
    }

  return (
      <>
          <nav className={styles.navWrapper}>
              <div className={styles.navContainer}>
                  <button className={styles.navElement} onClick={openWithdrawWindow}>
                      <Withdraw className={styles.navWithdrawIcon} />
                      Вывод
                  </button>
                  <button className={styles.navElement} onClick={() => navigateTo('manager')}>
                      <Manager className={styles.navManagerIcon} />
                      Менеджер
                  </button>
                  <button className={styles.navElement} onClick={() => navigateTo('history')}>
                      <History className={styles.navHistoryIcon} />
                      История
                  </button>
              </div>
          </nav>

          {isShowToast && (
              <div className={styles.toastWithdrawContainer}>
                  <div className={styles.toastWithdraw}>
                      <div className={styles.successContainer}>
                          <Success className={styles.successIcon} />
                      </div>
                      <div>
                          Вывод в обработке, подробности уточните у менеджера
                      </div>
                  </div>
              </div>
          )}

          {isShowModal && (
              <div className={styles.modalWithdrawContainer}>
                  <div className={styles.modalWithdraw}>
                      <div className={styles.modalWithdrawTop}>
                          Вывод средств
                      </div>
                      <div className={styles.modalWithdrawCenter}>
                          Доступно для вывода: €{user?.balance?.toFixed(2) || '0.00'}
                      </div>
                      <div className={styles.modalWithdrawCenter}>
                          Вы хотите вывести всю сумму?
                      </div>
                      <div className={styles.modalWithdrawBottom}>
                          <button className={styles.modalWithdrawNot} onClick={cancelWithdraw}>
                              Нет
                          </button>
                          <button 
                              className={styles.modalWithdrawYes} 
                              onClick={withdraw}
                              disabled={withdrawLoading}
                          >
                              {withdrawLoading ? 'Обработка...' : 'Да'}
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </>
  );
}

export default Navbar;