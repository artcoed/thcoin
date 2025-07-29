import React from 'react';
import styles from './Bonuses.module.css';
import Navbar from "./Navbar";
import BackButton from './BackButton';
import { ReactComponent as Star } from '../assets/bonuses/star.svg';


function Bonuses() {
  return (
      <div className={styles.wrapper}>
        <Navbar />
        <div className={styles.container}>
            <BackButton className={styles.backArrow} />

            <div className={styles.title}>
                Бонусы
            </div>

            <div className={styles.bonusesContainer}>
                <div className={`${styles.bonusContainer} ${styles.bonusContainer1}`}>
                    <div className={styles.starContainer}>
                        <Star className={styles.starIcon} />
                    </div>
                    <div className={styles.textContainer}>
                        <div className={styles.textUpper}>
                            Депозит 100 €
                        </div>
                        <div className={styles.textDown}>
                            +10% токенов
                        </div>
                    </div>
                </div>

                <div className={`${styles.bonusContainer} ${styles.bonusContainer2}`}>
                    <div className={styles.starContainer}>
                        <Star className={styles.starIcon} />
                    </div>
                    <div className={styles.textContainer}>
                        <div className={styles.textUpper}>
                            Депозит 250 €
                        </div>
                        <div className={styles.textDown}>
                            +20% токенов
                        </div>
                    </div>
                </div>

                <div className={`${styles.bonusContainer} ${styles.bonusContainer3}`}>
                    <div className={styles.starContainer}>
                        <Star className={styles.starIcon} />
                    </div>
                    <div className={styles.textContainer}>
                        <div className={styles.textUpper}>
                            Депозит 500 €
                        </div>
                        <div className={styles.textDown}>
                            +35% токенов
                        </div>
                    </div>
                </div>

                <div className={`${styles.bonusContainer} ${styles.bonusContainer4}`}>
                    <div className={styles.starContainer}>
                        <Star className={styles.starIcon} />
                    </div>
                    <div className={styles.textContainer}>
                        <div className={styles.textUpper}>
                            Депозит 1000 €
                        </div>
                        <div className={styles.textDown}>
                            +50% токенов
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.additionalInfoContainer}>
                Для получения актуальной информации о бонусах свяжитесь с менеджером
            </div>

        </div>
      </div>
  );
}

export default Bonuses;