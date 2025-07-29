import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './RouletteWindow.module.css';
import { ReactComponent as ClearIcon } from '../assets/roulette/clear.svg';
import BackButton from './BackButton';
import { ReactComponent as ArrowIcon } from '../assets/roulette/arrow.svg';
import { ReactComponent as WinIcon } from '../assets/roulette/winIcon.svg';
import { ReactComponent as LoseIcon } from '../assets/roulette/loseIcon.svg';
import wheelImage from '../assets/roulette/wheel.png';
import Navbar from "./Navbar";

function RouletteWindow() {
    const [isSpinning, setIsSpinning] = useState(false);
    const [result, setResult] = useState<number | null>(null);
    const [usedNumbers, setUsedNumbers] = useState<Set<number>>(new Set());
    const [lastBetColor, setLastBetColor] = useState<'black' | 'red' | 'green' | null>(null);
    const [timerText, setTimerText] = useState('');
    const wheelRef = useRef<HTMLImageElement>(null);
    const [spinCount, setSpinCount] = useState(0);
    const [isWinning, setIsWinning] = useState(false);
    const numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const colorMap: { [key: number]: 'black' | 'red' | 'green' } = {
        0: 'green',
        32: 'red', 15: 'black', 19: 'red', 4: 'black', 21: 'red', 2: 'black', 25: 'red',
        17: 'black', 34: 'red', 6: 'black', 27: 'red', 13: 'black', 36: 'red', 11: 'black',
        30: 'red', 8: 'black', 23: 'red', 10: 'black', 5: 'red', 24: 'black', 16: 'red',
        33: 'black', 1: 'red', 20: 'black', 14: 'red', 31: 'black', 9: 'red', 22: 'black',
        18: 'red', 29: 'black', 7: 'red', 28: 'black', 12: 'red', 35: 'black', 3: 'red',
        26: 'black'
    };

    const startSpin = useCallback((color: 'black' | 'red' | 'green') => {
        if (isSpinning) return;
        setIsSpinning(true);
        setResult(null);
        setLastBetColor(color);
        if (usedNumbers.size >= numbers.length) setUsedNumbers(new Set());
        const randomRotations = Math.floor(Math.random() * 5) + 3;
        const randomOffset = Math.floor(Math.random() * 360);
        const totalDegrees = randomRotations * 360 + randomOffset;

        if (wheelRef.current) {
            wheelRef.current.style.transform = `rotate(${totalDegrees}deg)`;
            wheelRef.current.style.transition = 'transform 3s ease-out';

            const spinTimeout = setTimeout(() => {
                const finalAngle = totalDegrees % 360;
                const segmentAngle = 360 / numbers.length;
                const adjustedAngle = (360 - finalAngle + segmentAngle / 2) % 360;
                const segmentIndex = Math.floor(adjustedAngle / segmentAngle) % numbers.length;
                let newResult = numbers[segmentIndex];
                while (usedNumbers.has(newResult)) {
                    const nextIndex = (segmentIndex + 1) % numbers.length;
                    newResult = numbers[nextIndex];
                }
                console.log(`Final Angle: ${finalAngle}, Adjusted Angle: ${adjustedAngle}, Segment Index: ${segmentIndex}, Result: ${newResult}, Expected at Top: ${numbers[(segmentIndex + numbers.length - Math.floor(360 / segmentAngle / 2)) % numbers.length]}, Spin Count: ${spinCount + 1}`);
                const newSet = new Set(usedNumbers);
                newSet.add(newResult);
                setUsedNumbers(prev => (newSet.size > 37 ? new Set([newResult]) : newSet));
                setResult(newResult);
                setIsSpinning(false);
                setSpinCount(prev => prev + 1);
                if ((spinCount + 1) % 20 === 0) {
                    console.log('Resetting after 20 spins to prevent memory buildup');
                    setUsedNumbers(new Set());
                    setResult(null);
                }
            }, 3000);

            return () => clearTimeout(spinTimeout);
        }
    }, [isSpinning, usedNumbers, spinCount]);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        let time: number = 0;

        const updateTimer = () => {
            if (!isSpinning) {
                setTimerText('');
                return;
            }
            time = 3.0;
            setTimerText('Прокрутка началась');
            timer = setInterval(() => {
                time -= 0.1;
                if (time <= 0.0) {
                    if (timer) clearInterval(timer);
                    setTimerText('0.0s');
                    timer = null;
                } else if (time <= 2.0) {
                    setTimerText(`${time.toFixed(1)}s`);
                }
            }, 100);
        };

        if (isSpinning) updateTimer();

        return () => {
            if (timer) clearInterval(timer);
            const cleanUp = setTimeout(() => {}, 0);
            clearTimeout(cleanUp);
        };
    }, [isSpinning]);

    useEffect(() => {
        let isMounted = true;
        if (!isSpinning && wheelRef.current) {
            wheelRef.current.style.transition = 'none';
        }
        return () => {
            isMounted = false;
        };
    }, [isSpinning]);

    const getStatus = () => {
        if (result === null || !lastBetColor) return '';
        const resultColor = colorMap[result];
        return resultColor === lastBetColor ? 'Выйграл!' : 'Проиграл!';
    };

    return (
        <div className={styles.wrapper}>
            <Navbar />

            { isWinning && (
                <div className={styles.modalResultWindowContainer}>
                    <div className={`${styles.modalResultWindow} ${styles.modalLoseWindow}`}>
                        <button className={styles.closeIconContainer}>
                            ×
                        </button>
                        <div className={styles.iconContainer}>
                            <LoseIcon className={styles.resultIconWindow} />
                        </div>
                        <div className={styles.modalResultTitle}>
                            ВЫИГРЫШ!
                        </div>
                        <div className={styles.modalResultDescription}>
                            Поздравляем с победой!
                        </div>
                        <div className={styles.modalResultValue}>
                            -155.42
                        </div>
                        <div className={styles.modalResultCurrency}>
                            EUR
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.container}>
                <BackButton className={styles.backArrow} />
                <div className={styles.rouletteTitle}>Рулетка</div>
                <div className={styles.rouletteDesc}>Проверь свое везение</div>

                <div className={styles.wheelContainer}>
                    <img
                        ref={wheelRef}
                        className={`${styles.wheel} ${isSpinning ? styles.spinning : ''}`}
                        src={wheelImage}
                        alt="wheel"
                    />
                    <ArrowIcon className={styles.arrowIcon} />
                </div>

                {!isSpinning && (
                    <>
                        <div className={styles.betHeaderContainer}>
                            <div className={styles.betHeaderTitle}>Размер ставки</div>
                            <div className={styles.tryingCount}>5/5 попыток</div>
                        </div>
                        <div className={styles.betAmountContainer}>
                            <input className={styles.betAmount} value={1000} readOnly />
                            <button className={styles.clearIconContainer}>
                                <ClearIcon className={styles.clearIcon} />
                            </button>
                        </div>
                        <div className={styles.limitBetsContainer}>
                            <button className={styles.minBet}>Мин: 10</button>
                            <button className={styles.maxBet}>Макс: 1005.90</button>
                        </div>
                        <div className={styles.colorsContainer}>
                            <button
                                className={`${styles.color} ${styles.colorBlack}`}
                                onClick={() => startSpin('black')}
                                disabled={isSpinning}
                            >
                                x2
                            </button>
                            <button
                                className={`${styles.color} ${styles.colorRed}`}
                                onClick={() => startSpin('red')}
                                disabled={isSpinning}
                            >
                                x2
                            </button>
                            <button
                                className={`${styles.color} ${styles.colorGreen}`}
                                onClick={() => startSpin('green')}
                                disabled={isSpinning}
                            >
                                x10
                            </button>
                        </div>
                    </>
                )}

                {isSpinning && <div className={styles.timer}>{timerText}</div>}

                {result !== null && (
                    <div className={`${styles.result} ${styles[`result${colorMap[result]}`]}`}>
                        Результат: {result} - {getStatus()}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RouletteWindow;