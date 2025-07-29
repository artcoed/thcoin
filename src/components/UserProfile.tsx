import React from 'react';
import styles from './UserProfile.module.css';
import Navbar from "./Navbar";
import { ReactComponent as BackArrowIcon } from '../assets/roulette/backArrow.svg';
import { ReactComponent as PartnerIcon } from '../assets/profile/partnerStatusIcon.svg';
import userAvatar from '../assets/main/userAvatar.png';

function UserProfile() {
  return (
      <div className={styles.wrapper}>
        <Navbar />
        <div className={styles.container}>
            <button className={styles.backArrow}>
                <BackArrowIcon className={styles.backArrowIcon} />
            </button>

            <img
                className={styles.userAvatar}
                src={userAvatar}
                alt="user avatar"
            />

            <div className={styles.username}>
                Username
            </div>
            <div className={styles.userId}>
                ID: 12345213
            </div>
            <div className={styles.howLong}>
                9 дней в проекте
            </div>

            <div className={styles.statusesContainer}>
                <div className={styles.statusesContainerTitle}>
                    Статус пользователя
                </div>
                <div className={styles.statusContainer}>
                    <div className={styles.statusIconContainer}>
                        <PartnerIcon className={styles.statusIcon}/>
                    </div>
                    <div className={styles.statusText}>
                        Партнер
                    </div>
                </div>
            </div>
        </div>
      </div>
  );
}

export default UserProfile;