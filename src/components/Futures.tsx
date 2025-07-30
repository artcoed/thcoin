import React, { useState, useEffect, useRef, JSX } from 'react';
import styles from './Futures.module.css';
import Navbar from './Navbar';
import BackButton from './BackButton';
import { ReactComponent as ClearIcon } from '../assets/roulette/clear.svg';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { executeFutures } from '../store/slices/gameSlice';
import { fetchFuturesConfig } from '../store/slices/configSlice';
import { telegramUtils } from '../lib/telegram';
import { useTranslation } from '../lib/i18n';
import ResultModal from './ResultModal';

// Define interface for data points
interface DataPoint {
    time: number; // Unix timestamp in seconds
    value: number;
}

// Define interface for scaled points
interface ScaledPoint {
    x: number;
    y: number;
}

// Props interface for customizable height
interface FuturesProps {
    height?: number; // Optional height prop, defaults to 400
}

const Futures: React.FC<FuturesProps> = ({ height = 400 }) => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation();
    const { user } = useAppSelector(state => state.user);
    const { futuresLoading, futuresError, dailyFuturesCount, lastFuturesResult } = useAppSelector(state => state.game);
    const { futuresConfig } = useAppSelector(state => state.config);
    
    // State for data points
    const [dataPoints, setDataPoints] = useState<DataPoint[]>([
        { time: Math.floor(Date.now() / 1000) - 10, value: 600 },
        { time: Math.floor(Date.now() / 1000) - 9, value: 650 },
        { time: Math.floor(Date.now() / 1000) - 8, value: 700 },
        { time: Math.floor(Date.now() / 1000) - 7, value: 750 },
        { time: Math.floor(Date.now() / 1000) - 6, value: 800 },
        { time: Math.floor(Date.now() / 1000) - 5, value: 850 },
        { time: Math.floor(Date.now() / 1000) - 4, value: 900 },
        { time: Math.floor(Date.now() / 1000) - 3, value: 950 },
        { time: Math.floor(Date.now() / 1000) - 2, value: 1000 },
        { time: Math.floor(Date.now() / 1000) - 1, value: 975 },
        { time: Math.floor(Date.now() / 1000), value: 925 },
    ]);

    // State for previous data points for animation
    const [prevDataPoints, setPrevDataPoints] = useState<DataPoint[]>(dataPoints);

    // State for current position (index of the latest data point)
    const [currentIndex, setCurrentIndex] = useState<number>(dataPoints.length - 1);

    // State for trend direction (1: up, -1: down) and duration
    const [trendDirection, setTrendDirection] = useState<number>(1);
    const [trendDuration, setTrendDuration] = useState<number>(Math.floor(Math.random() * 3) + 3); // 3–5 seconds
    const [trendCounter, setTrendCounter] = useState<number>(0);

    // State for money axis values, offset, and animated values
    const [moneyValues, setMoneyValues] = useState<number[]>([1000, 900, 800, 700, 600, 500, 400]);
    const [yOffset, setYOffset] = useState<number>(0);
    const [animatedYOffset, setAnimatedYOffset] = useState<number>(0);
    const [animatedMinValue, setAnimatedMinValue] = useState<number>(Math.min(...moneyValues));
    const [animatedMaxValue, setAnimatedMaxValue] = useState<number>(Math.max(...moneyValues));

    // State for path animation
    const [animatedPath, setAnimatedPath] = useState<string>('');
    const [animatedStrokePath, setAnimatedStrokePath] = useState<string>('');
    const [animationProgress, setAnimationProgress] = useState<number>(0);
    const [animatedCurrentPos, setAnimatedCurrentPos] = useState<ScaledPoint>({ x: 0, y: 0 });

    // State for dynamic width
    const [width, setWidth] = useState<number>(300); // Initial width
    const containerRef = useRef<HTMLDivElement>(null);
    
    // State for betting
    const [betAmount, setBetAmount] = useState<number>(1000);
    const [showError, setShowError] = useState<string | null>(null);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultData, setResultData] = useState<{
        isWin: boolean;
        amount: number;
        timeRemaining?: number;
    } | null>(null);

    // Load futures config on component mount
    useEffect(() => {
        if (!futuresConfig) {
            dispatch(fetchFuturesConfig());
        }
    }, [dispatch, futuresConfig]);

    // Update width based on container size
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        const resizeObserver = new ResizeObserver(updateWidth);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };
    }, []);

    // Function to format timestamp to HH:mm:ss
    const formatTime = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleTimeString('en-GB', { hour12: false });
    };

    // Function to generate SVG path for the filled area
    const generateFillPath = (points: DataPoint[], minValue: number, maxValue: number): string => {
        if (points.length === 0) return '';

        const minTime = points[0].time;
        const maxTime = points[points.length - 1].time;

        // Scale points to fit SVG viewBox
        const scaledPoints: ScaledPoint[] = points.map((point: DataPoint) => {
            const x = ((point.time - minTime) / (maxTime - minTime)) * width;
            const y = height - ((point.value - minValue) / (maxValue - minValue)) * height;
            return { x, y };
        });

        // Start path at the bottom-left
        let path = `M0 ${scaledPoints[0]?.y || height}`;

        // Add line segments
        scaledPoints.forEach((point: ScaledPoint) => {
            path += `L${point.x} ${point.y}`;
        });

        // Close path to bottom-right and bottom-left
        path += `L${width} ${scaledPoints[scaledPoints.length - 1]?.y || height}V${height}H0Z`;

        return path;
    };

    // Function to generate SVG path for the top stroke only
    const generateStrokePath = (points: DataPoint[], minValue: number, maxValue: number): string => {
        if (points.length === 0) return '';

        const minTime = points[0].time;
        const maxTime = points[points.length - 1].time;

        // Scale points to fit SVG viewBox
        const scaledPoints: ScaledPoint[] = points.map((point: DataPoint) => {
            const x = ((point.time - minTime) / (maxTime - minTime)) * width;
            const y = height - ((point.value - minValue) / (maxValue - minValue)) * height;
            return { x, y };
        });

        // Start path at the first point
        let path = `M${scaledPoints[0]?.x || 0} ${scaledPoints[0]?.y || height}`;

        // Add line segments for the top edge only
        scaledPoints.forEach((point: ScaledPoint) => {
            path += `L${point.x} ${point.y}`;
        });

        return path;
    };

    // Function to interpolate between two sets of points for smooth animation
    const interpolatePoints = (startPoints: DataPoint[], endPoints: DataPoint[], progress: number): DataPoint[] => {
        if (startPoints.length !== endPoints.length) {
            return endPoints; // Fallback to end points if lengths differ
        }
        return startPoints.map((start, index) => {
            const end = endPoints[index] || start;
            return {
                time: start.time + (end.time - start.time) * progress,
                value: start.value + (end.value - start.value) * progress,
            };
        });
    };

    // Function to interpolate yOffset, minValue, and maxValue
    const interpolateValue = (start: number, end: number, progress: number): number => {
        return start + (end - start) * progress;
    };

    // Function to generate time axis labels (last 4 points)
    const generateTimeLabels = (points: DataPoint[]): JSX.Element[] => {
        if (points.length === 0) return [];

        const minTime = points[0].time;
        const maxTime = points[points.length - 1].time;
        const labelCount = 4;
        const latestPoints = points.slice(-labelCount); // Take last 4 points

        return latestPoints.map((point: DataPoint, index: number) => {
            const x = ((point.time - minTime) / (maxTime - minTime)) * width;
            return (
                <text
                    key={index}
                    x={x}
                    y={height + 20}
                    textAnchor="middle"
                    className={styles.dateTimeText}
                >
                    {formatTime(point.time)}
                </text>
            );
        });
    };

    // Function to find the closest money value to the current value
    const getClosestMoneyValue = (currentValue: number): number => {
        return moneyValues.reduce((prev: number, curr: number) =>
            Math.abs(curr - currentValue) < Math.abs(prev - currentValue) ? curr : prev
        );
    };

    // Function to handle trade
    const handleTrade = async (direction: 'up' | 'down') => {
        if (!user) {
            setShowError(t('trading-error-user'));
            return;
        }

        if (!futuresConfig) {
            setShowError(t('trading-error-config'));
            return;
        }

        // Проверяем лимиты
        if (dailyFuturesCount >= futuresConfig.maxBetsPerDay) {
            setShowError(t('trading-error-limit', { max: futuresConfig.maxBetsPerDay }));
            return;
        }

        const maxBet = (user.balance * futuresConfig.maxBetPercent) / 100;
        if (betAmount > maxBet) {
            setShowError(t('trading-error-max-bet', { 
                amount: maxBet.toFixed(2), 
                percent: futuresConfig.maxBetPercent 
            }));
            return;
        }

        if (betAmount > user.balance) {
            setShowError(t('trading-error-insufficient'));
            return;
        }

        try {
            const result = await dispatch(executeFutures({
                userId: user.user_id,
                amount: betAmount,
                direction
            })).unwrap();
            
            // Показываем результат
            if (result) {
                setResultData({
                    isWin: result.win,
                    amount: result.amount,
                    timeRemaining: futuresConfig?.tradeDuration
                });
                setShowResultModal(true);
            }
        } catch (error: any) {
            setShowError(error.message || t('trading-error-execution'));
        }
    };

    // Function to clear bet amount
    const clearBetAmount = () => {
        setBetAmount(1000);
    };

    // Function to update bet amount
    const updateBetAmount = (newAmount: number) => {
        setBetAmount(Math.max(10, Math.min(newAmount, user?.balance || 1000)));
    };

    // Function to generate money axis labels with animation
    const generateMoneyLabels = (minValue: number, maxValue: number): JSX.Element => {
        const currentValue = dataPoints[currentIndex]?.value || 0;
        const closestValue = getClosestMoneyValue(currentValue);

        return (
            <g className={styles.moneyAxis} transform={`translate(0, ${animatedYOffset})`}>
                {moneyValues.map((value: number) => {
                    const y = height - ((value - minValue) / (maxValue - minValue)) * height;
                    return (
                        <text
                            key={value}
                            x={width + 10}
                            y={y + 5}
                            className={`${styles.moneyAxisText} ${value === closestValue ? styles.highlighted : ''}`}
                            textAnchor="start"
                        >
                            {value}
                        </text>
                    );
                })}
            </g>
        );
    };

    // Update money axis to keep current value centered (30% margin) with fixed 7 values
    const updateMoneyAxis = (newValue: number): void => {
        setMoneyValues((prev: number[]) => {
            let newValues = [...prev];
            let newOffset = yOffset;
            const minValue = Math.min(...newValues);
            const maxValue = Math.max(...newValues);
            const range = maxValue - minValue;
            const margin = range * 0.3;
            const maxLabels = 7;
            const step = 100;

            if (newValue > maxValue - margin) {
                const newMax = Math.ceil((newValue + margin) / step) * step;
                for (let v = maxValue + step; v <= newMax; v += step) {
                    newValues.push(v);
                }
                if (newValues.length > maxLabels) {
                    newValues = newValues.sort((a, b) => b - a).slice(0, maxLabels);
                    newOffset += 40 * (newValues.length - maxLabels);
                }
            } else if (newValue < minValue + margin) {
                const newMin = Math.floor((newValue - margin) / step) * step;
                for (let v = minValue - step; v >= newMin; v -= step) {
                    newValues.unshift(v);
                }
                if (newValues.length > maxLabels) {
                    newValues = newValues.sort((a, b) => b - a).slice(-maxLabels);
                    newOffset -= 40 * (newValues.length - maxLabels);
                }
            }

            setYOffset(newOffset);
            setAnimatedMinValue(Math.min(...newValues, ...dataPoints.map(p => p.value)));
            setAnimatedMaxValue(Math.max(...newValues, ...dataPoints.map(p => p.value)));
            return newValues.sort((a, b) => b - a);
        });
    };

    // Animate path updates, yOffset, minValue, maxValue, and circle position
    useEffect(() => {
        let animationFrame: number;
        const duration = 500;
        let startTime: number | null = null;
        let prevYOffset = animatedYOffset;
        let prevMinValue = animatedMinValue;
        let prevMaxValue = animatedMaxValue;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Interpolate data points for path
            const interpolatedPoints = interpolatePoints(prevDataPoints, dataPoints, progress);
            const interpolatedMinValue = interpolateValue(prevMinValue, Math.min(...moneyValues, ...dataPoints.map(p => p.value)), progress);
            const interpolatedMaxValue = interpolateValue(prevMaxValue, Math.max(...moneyValues, ...dataPoints.map(p => p.value)), progress);

            const newFillPath = generateFillPath(interpolatedPoints, interpolatedMinValue, interpolatedMaxValue);
            const newStrokePath = generateStrokePath(interpolatedPoints, interpolatedMinValue, interpolatedMaxValue);

            // Interpolate yOffset
            const interpolatedYOffset = interpolateValue(prevYOffset, yOffset, progress);

            // Interpolate current position for circle
            const minTime = interpolatedPoints[0].time;
            const maxTime = interpolatedPoints[interpolatedPoints.length - 1].time;
            const currentPoint = interpolatedPoints[currentIndex];
            const interpolatedCurrentPos: ScaledPoint = {
                x: ((currentPoint.time - minTime) / (maxTime - minTime)) * width,
                y: height - ((currentPoint.value - interpolatedMinValue) / (interpolatedMaxValue - interpolatedMinValue)) * height,
            };

            // Update states
            setAnimatedPath(newFillPath);
            setAnimatedStrokePath(newStrokePath);
            setAnimatedYOffset(interpolatedYOffset);
            setAnimatedMinValue(interpolatedMinValue);
            setAnimatedMaxValue(interpolatedMaxValue);
            setAnimatedCurrentPos(interpolatedCurrentPos);
            setAnimationProgress(progress);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                prevYOffset = yOffset;
                prevMinValue = interpolatedMinValue;
                prevMaxValue = interpolatedMaxValue;
            }
        };

        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [dataPoints, moneyValues, yOffset, prevDataPoints, width, height, currentIndex]);

    // Random value update with multi-second trends
    useEffect(() => {
        const interval = setInterval(() => {
            setDataPoints((prev: DataPoint[]) => {
                const newPoints = [...prev];
                if (newPoints.length === 0) return newPoints;

                const lastPoint = newPoints[newPoints.length - 1];

                if (trendCounter >= trendDuration) {
                    setTrendDirection(Math.random() < 0.5 ? -1 : 1);
                    setTrendDuration(Math.floor(Math.random() * 3) + 3);
                    setTrendCounter(0);
                } else {
                    setTrendCounter((prev) => prev + 1);
                }

                const rand = Math.random();
                const percentChange = 0.001 + (0.019 * (1 - rand * rand)) * 3;
                const newValue = lastPoint.value * (1 + percentChange * trendDirection);
                const newTime = lastPoint.time + 1;

                newPoints.push({ time: newTime, value: newValue });
                if (newPoints.length > 11) {
                    newPoints.shift();
                }

                setPrevDataPoints(prev);
                setCurrentIndex(newPoints.length - 1);
                updateMoneyAxis(newValue);
                return newPoints;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [trendDirection, trendCounter, trendDuration]);

    // Determine if the last change was an increase or decrease
    const isIncreasing = dataPoints[currentIndex]?.value > prevDataPoints[currentIndex]?.value;

    return (
        <>
            <div className={styles.wrapper}>
                <Navbar />
                <div className={styles.container} ref={containerRef}>
                    <BackButton className={styles.backArrow} />

                    <div className={styles.futuresTitle}>
                        {t('trading-title')}
                    </div>

                <div className={styles.currentValue} style={{ color: isIncreasing ? '#23B371' : '#F65249' }}>
                    {dataPoints[currentIndex]?.value.toFixed(4)}

                    <div className={styles.graphCurrency}>
                        EUR
                    </div>
                </div>
                <div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="100%"
                        height={height + 40}
                        viewBox={`0 0 ${width + 50} ${height + 40}`}
                        fill="none"
                        className={styles.svg}
                    >
                        <g className={styles.chart}>
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d={animatedPath}
                                fill="url(#paint0_linear_1_1453)"
                            />
                            <path
                                d={animatedStrokePath}
                                fill="none"
                                stroke="#1A8A56"
                                strokeWidth="2"
                            />
                        </g>
                        <circle
                            cx={animatedCurrentPos.x}
                            cy={animatedCurrentPos.y}
                            r="2.5"
                            fill="white"
                            stroke="#23B371"
                            strokeWidth="3"
                            className={styles.circle}
                        />
                        {generateTimeLabels(dataPoints)}
                        {generateMoneyLabels(animatedMinValue, animatedMaxValue)}
                        <defs>
                            <linearGradient
                                id="paint0_linear_1_1453"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2={height}
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#23B371" stopOpacity="0.41887" />
                                <stop offset="1" stopColor="#23B371" stopOpacity="0.01" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {showError && (
                    <div className={styles.errorContainer}>
                        <div className={styles.errorText}>{showError}</div>
                        <button 
                            className={styles.errorClose}
                            onClick={() => setShowError(null)}
                        >
                            ×
                        </button>
                    </div>
                )}

                <div className={styles.betHeaderContainer}>
                    <div className={styles.betHeaderTitle}>{t('trading-bet-size')}</div>
                    <div className={styles.tryingCount}>
                        {t('trading-attempts', { 
                            current: dailyFuturesCount, 
                            max: futuresConfig?.maxBetsPerDay || 5 
                        })}
                    </div>
                </div>
                <div className={styles.betAmountContainer}>
                    <input 
                        className={styles.betAmount} 
                        value={betAmount} 
                        onChange={(e) => updateBetAmount(Number(e.target.value) || 0)}
                        type="number"
                        min="10"
                        max={user?.balance || 1000}
                    />
                    <button 
                        className={styles.clearIconContainer}
                        onClick={clearBetAmount}
                    >
                        <ClearIcon className={styles.clearIcon} />
                    </button>
                </div>
                <div className={styles.limitBetsContainer}>
                    <button className={styles.minBet}>{t('trading-min-bet', { amount: 10 })}</button>
                    <button className={styles.maxBet}>
                        {t('trading-max-bet', { 
                            amount: futuresConfig ? ((user?.balance || 0) * futuresConfig.maxBetPercent / 100).toFixed(2) : '1000.00'
                        })}
                    </button>
                </div>

                <div className={styles.colorsContainer}>
                    <button
                        className={`${styles.color} ${styles.colorGreen}`}
                        onClick={() => handleTrade('up')}
                        disabled={futuresLoading}
                    >
                        {futuresLoading ? t('trading-processing') : t('trading-up')}
                    </button>
                    <button
                        className={`${styles.color} ${styles.colorRed}`}
                        onClick={() => handleTrade('down')}
                        disabled={futuresLoading}
                    >
                        {futuresLoading ? t('trading-processing') : t('trading-down')}
                    </button>
                </div>
            </div>
        </div>

        {/* Модалка результатов */}
        <ResultModal
            isOpen={showResultModal}
            isWin={resultData?.isWin || false}
            amount={resultData?.amount || 0}
            timeRemaining={resultData?.timeRemaining}
            onClose={() => {
                setShowResultModal(false);
                setResultData(null);
            }}
            gameType="trading"
        />
        </>
    );
};

export default Futures;