import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Countdown = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) return null;

  const timerComponents = [];
  const labels = {
    days: "Дней",
    hours: "Часов",
    minutes: "Минут",
    seconds: "Секунд",
  };

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval] && timeLeft[interval] !== 0) {
      return;
    }

    timerComponents.push(
      <motion.div
        key={interval}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="flex flex-col items-center"
      >
        <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-white/40 backdrop-blur-sm rounded-full border border-rose-100/50 shadow-sm">
          <span className="text-xl md:text-2xl font-serif text-rose-600 font-medium tabular-nums">
            {timeLeft[interval] < 10
              ? `0${timeLeft[interval]}`
              : timeLeft[interval]}
          </span>
        </div>
        <span className="text-[10px] md:text-xs text-rose-500/80 font-medium tracking-widest uppercase mt-1">
          {labels[interval]}
        </span>
      </motion.div>
    );
  });

  return (
    <div className="flex justify-center gap-3 md:gap-6 py-4">
      {timerComponents.length ? (
        timerComponents
      ) : (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl text-rose-600 font-serif font-medium bg-white/80 px-8 py-4 rounded-full shadow-lg backdrop-blur-sm"
        >
          Свадьба уже состоялась!
        </motion.span>
      )}
    </div>
  );
};

export default Countdown;
