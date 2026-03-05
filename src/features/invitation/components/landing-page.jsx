import { useConfig } from "@/features/invitation/hooks/use-config";
import { formatEventDate } from "@/lib/format-event-date";
import { motion } from "framer-motion";
import { Calendar, Heart } from "lucide-react";

const LandingPage = ({ onOpenInvitation }) => {
  const config = useConfig();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-rose-50/30 to-white" />
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-rose-100/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-pink-100/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-lg px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="backdrop-blur-md bg-white/40 p-8 md:p-12 rounded-3xl border border-white/50 shadow-xl text-center"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-serif text-gray-800 mb-4 leading-tight">
              Приглашение на свадьбу
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light font-serif italic">
              от Алексея и Софии
            </p>
          </motion.div>

          {/* Decorative Divider */}
          <div className="flex items-center justify-center gap-4 mb-8 opacity-60">
            <div className="h-px w-16 bg-rose-300" />
            <Heart className="w-5 h-5 text-rose-400 fill-rose-100" />
            <div className="h-px w-16 bg-rose-300" />
          </div>

          {/* Date */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/50 rounded-full border border-rose-100/50">
               <Calendar className="w-5 h-5 text-rose-400" />
               <span className="text-lg text-gray-700 font-medium">
                 {formatEventDate(config.date)}
               </span>
            </div>
          </motion.div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onOpenInvitation}
            className="group relative w-full sm:w-auto min-w-[200px] bg-rose-500 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:bg-rose-600 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>Открыть приглашение</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
