import { useState, useEffect, useCallback } from 'react';

interface UseTimerProps {
    initialTime: number;
    onTimeEnd?: () => void;
}

export const useTimer = ({ initialTime, onTimeEnd }: UseTimerProps) => {
    const [timeRemaining, setTimeRemaining] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(false);

    const startTimer = useCallback(() => {
        setTimeRemaining(initialTime);
        setIsRunning(true);
    }, [initialTime]);

    const pauseTimer = () => setIsRunning(false);

    const resetTimer = useCallback(() => {
        setTimeRemaining(initialTime);
        setIsRunning(false);
    }, [initialTime]);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        onTimeEnd?.();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [isRunning, timeRemaining, onTimeEnd]);

    return {
        timeRemaining,
        isRunning,
        startTimer,
        pauseTimer,
        resetTimer
    };
};