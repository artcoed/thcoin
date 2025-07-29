import React from 'react';
import styles from './Manager.module.css';
import Navbar from "./Navbar";
import BackButton from './BackButton';
import { ReactComponent as Warning } from '../assets/manager/warning.svg';

function Manager() {
  return (
      <div className={styles.wrapper}>
        <Navbar />
        <div className={styles.container}>
            <BackButton className={styles.backArrow} />

            <div className={styles.title}>
                Менеджер
            </div>

            <div className={styles.messageContainer}>
                <div className={styles.iconContainer}>
                    <Warning className={styles.warnIcon} />
                </div>
                <div className={styles.message}>
                    В настоящее время менеджер недоступен. Попробуйте позже
                </div>
            </div>
        </div>
      </div>
  );
}

export default Manager;