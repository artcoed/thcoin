import React from 'react';
import styles from './History.module.css';
import Navbar from "./Navbar";
import BackButton from './BackButton';
import { ReactComponent as Deposit } from '../assets/history/Deposit.svg';
import { ReactComponent as Withdraw } from '../assets/history/Withdraw.svg';

function History() {
  return (
      <div className={styles.wrapper}>
        <Navbar />
        <div className={styles.container}>
            <BackButton className={styles.backArrow} />

            <div className={styles.title}>
                История
            </div>

            <div className={styles.dayContainer}>
                <div className={styles.dayTitle}>
                    Сегодня, 29 мая
                </div>

                <div className={styles.transactionsContainer}>
                    <div className={styles.transaction}>
                        <div className={styles.leftContainer}>
                            <div className={styles.leftIconContainer}>
                                <Deposit className={styles.leftIcon} />
                            </div>
                            <div className={styles.leftTextContainer}>
                                <div className={styles.leftTextTitle}>
                                    Пополнение
                                </div>
                                <div className={styles.leftTextValue}>
                                    09:30:12
                                </div>
                            </div>
                        </div>
                        <div className={styles.rightTextContainer}>
                            <div className={styles.rightTextDate}>
                                100.00 €
                            </div>
                            <div  className={styles.rightTextStatus}>
                                Успешно
                            </div>
                        </div>
                    </div>

                    <div className={styles.transaction}>
                        <div className={styles.leftContainer}>
                            <div className={styles.leftIconContainer}>
                                <Deposit className={styles.leftIcon} />
                            </div>
                            <div className={styles.leftTextContainer}>
                                <div className={styles.leftTextTitle}>
                                    Пополнение
                                </div>
                                <div className={styles.leftTextValue}>
                                    09:30:12
                                </div>
                            </div>
                        </div>
                        <div className={styles.rightTextContainer}>
                            <div className={styles.rightTextDate}>
                                100.00 €
                            </div>
                            <div  className={styles.rightTextStatus}>
                                Успешно
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.transaction} ${styles.withdraw}`}>
                        <div className={styles.leftContainer}>
                            <div className={styles.leftIconContainer}>
                                <Withdraw className={styles.leftIcon} />
                            </div>
                            <div className={styles.leftTextContainer}>
                                <div className={styles.leftTextTitle}>
                                    Пополнение
                                </div>
                                <div className={styles.leftTextValue}>
                                    09:30:12
                                </div>
                            </div>
                        </div>
                        <div className={styles.rightTextContainer}>
                            <div className={styles.rightTextDate}>
                                -100.00 €
                            </div>
                            <div  className={styles.rightTextStatus}>
                                Успешно
                            </div>
                        </div>
                    </div>

                    <div className={styles.transaction}>
                        <div className={styles.leftContainer}>
                            <div className={styles.leftIconContainer}>
                                <Deposit className={styles.leftIcon} />
                            </div>
                            <div className={styles.leftTextContainer}>
                                <div className={styles.leftTextTitle}>
                                    Пополнение
                                </div>
                                <div className={styles.leftTextValue}>
                                    09:30:12
                                </div>
                            </div>
                        </div>
                        <div className={styles.rightTextContainer}>
                            <div className={styles.rightTextDate}>
                                100.00 €
                            </div>
                            <div  className={styles.rightTextStatus}>
                                Успешно
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.dayContainer}>
                <div className={styles.dayTitle}>
                    Вчера, 28 мая
                </div>

                <div className={styles.transactionsContainer}>
                    <div className={styles.transaction}>
                        <div className={styles.leftContainer}>
                            <div className={styles.leftIconContainer}>
                                <Deposit className={styles.leftIcon} />
                            </div>
                            <div className={styles.leftTextContainer}>
                                <div className={styles.leftTextTitle}>
                                    Пополнение
                                </div>
                                <div className={styles.leftTextValue}>
                                    09:30:12
                                </div>
                            </div>
                        </div>
                        <div className={styles.rightTextContainer}>
                            <div className={styles.rightTextDate}>
                                100.00 €
                            </div>
                            <div  className={styles.rightTextStatus}>
                                Успешно
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
  );
}

export default History;