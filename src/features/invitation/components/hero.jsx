import { Calendar, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { formatEventDate } from "@/lib/format-event-date";
import { getGuestName, getGuestMessage, getGuestPrefix } from "@/lib/invitation-storage";
import Countdown from "@/components/ui/countdown";

export default function Hero() {
  const config = useConfig(); // Use hook to get config from API or fallback to static
  const [guestName, setGuestName] = useState("");
  const [guestMessage, setGuestMessage] = useState("");
  const [guestPrefix, setGuestPrefix] = useState("");

  useEffect(() => {
    // Get guest name from localStorage
    const storedGuestName = getGuestName();
    if (storedGuestName) {
      setGuestName(storedGuestName);
    }
    const storedGuestMessage = getGuestMessage();
    if (storedGuestMessage) {
      setGuestMessage(storedGuestMessage);
    }
    const storedGuestPrefix = getGuestPrefix();
    if (storedGuestPrefix) {
      setGuestPrefix(storedGuestPrefix);
    }
  }, []);

  const FloatingHearts = () => {
    const [hearts] = useState(() =>
      [...Array(8)].map((_, i) => ({
        size: Math.floor(Math.random() * 2) + 8,
        color:
          i % 3 === 0
            ? "text-rose-400"
            : i % 3 === 1
              ? "text-pink-400"
              : "text-red-400",
        initialX:
          typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
        animateX:
          typeof window !== "undefined" ? Math.random() * window.innerWidth : 0,
      })),
    );

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {hearts.map((heart, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0,
              x: heart.initialX,
              y: typeof window !== "undefined" ? window.innerHeight : 0,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.5],
              x: heart.animateX,
              y: -100,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeOut",
            }}
            className="absolute"
          >
            <Heart
              className={heart.color}
              style={{
                width: `${heart.size * 4}px`,
                height: `${heart.size * 4}px`,
              }}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      <section
        id="home"
        className="min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-20 text-center relative overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="relative py-8 sm:py-16 flex justify-center items-center translate-x-[5%] -mt-20">
            {/* Background "И" */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 0.2 }}
              transition={{ delay: 0.4 }}
              className="absolute left-[15%] top-[35%] -translate-x-1/2 -translate-y-[45%] font-caravan text-rose-400 pointer-events-none select-none z-0 leading-none"
              style={{ fontSize: "min(24vw, 12.5rem)" }}
            >
              И
            </motion.div>

            {/* Names */}
            <motion.h2
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative z-10 text-5xl sm:text-7xl font-caravan text-rose-600 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-16"
            >
              <span className="relative z-10 drop-shadow-sm">{config.groomName}</span>
              <span className="relative z-10 drop-shadow-sm translate-y-[95%] -translate-x-[20%]">{config.brideName}</span>
            </motion.h2>
          </div>

          {/* Invitation Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="relative max-w-md mx-auto"
            style={{ marginTop: "1rem" }}
          >
            {/* Minimalist container without heavy backgrounds/shadows */}
            <div className="relative px-4 sm:px-6 py-6 sm:py-8">
              
              <div className="space-y-4 text-center relative z-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 }}
                  className="space-y-2"
                >
                  <p className="text-2xl sm:text-3xl font-serif text-gray-800 italic">
                    {guestPrefix || config.greetingPrefix || "Уважаемые"}{" "}
                    <span className="text-rose-600 font-medium not-italic">{guestName || "гости"}</span>!
                  </p>
                  <p className="text-lg sm:text-xl text-gray-600 font-serif leading-relaxed">
                    {guestMessage || config.invitationText || "Мы счастливы пригласить вас на нашу свадьбу!"}
                  </p>
                </motion.div>

                {/* Timer inside card */}
                <div className="py-1 scale-90 origin-center flex flex-col items-center gap-1">
                  <p className="font-serif text-gray-500 italic tracking-wide text-lg">{config.countdownText || "До свадьбы осталось:"}</p>
                  <Countdown targetDate={config.date} />
                </div>

                {/* Decorative Date and Heart */}
                <div className="flex flex-col items-center gap-1">
                   <div className="flex items-center justify-center gap-4 opacity-80 w-full">
                    <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
                    <Heart className="w-5 h-5 text-rose-400 fill-rose-100 animate-pulse" />
                    <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-rose-300 to-transparent" />
                  </div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.9 }}
                    className="relative group"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-rose-100 to-pink-100 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                    <div className="relative inline-flex items-center justify-center gap-3 px-6 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-rose-100/50 shadow-sm">
                      <Calendar className="w-4 h-4 text-rose-500" />
                      <span className="text-gray-800 font-serif text-lg font-medium tracking-wide">
                        {formatEventDate(config.date, "full")}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
