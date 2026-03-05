import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, MessageSquare, User, Loader2, Send } from "lucide-react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { submitWish } from "@/features/wishes/api/wishes-api";

export default function RSVP() {
  const config = useConfig();
  const [formData, setFormData] = useState({
    name: "",
    attendance: "", // 'ATTENDING', 'NOT_ATTENDING'
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
        await submitWish(config.uid, {
            name: formData.name,
            message: formData.message || "Без комментария",
            attendance: formData.attendance === "yes" ? "ATTENDING" : "NOT_ATTENDING",
        });
        setIsSubmitted(true);
    } catch (err) {
        console.error("Error submitting RSVP:", err);
        setError("Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-rose-50 p-8 rounded-2xl border border-rose-100"
          >
            <CheckCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <h3 className="text-2xl font-serif text-gray-800 mb-2">Спасибо за ответ!</h3>
            <p className="text-gray-600">
              Мы получили вашу анкету. С нетерпением ждем встречи!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800">
            Подтвердите присутствие
          </h2>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto">
            Пожалуйста, заполните эту небольшую анкету, чтобы мы могли сделать праздник комфортным для вас.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-gray-100"
        >
          {/* Name */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-gray-700 font-medium">
              <User className="w-5 h-5 text-rose-400" />
              Ваше имя и фамилия
            </label>
            <input
              type="text"
              required
              placeholder="Иван Иванов"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-rose-300 focus:ring-rose-200 transition-all"
            />
          </div>

          {/* Attendance */}
          <div className="space-y-3">
            <label className="text-gray-700 font-medium block">
              Сможете ли вы присутствовать?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, attendance: "yes" })}
                className={`p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between group
                  ${formData.attendance === "yes"
                    ? "border-rose-400 bg-rose-50 text-rose-700"
                    : "border-gray-100 hover:border-rose-200"
                  }`}
              >
                <span>С удовольствием приду!</span>
                {formData.attendance === "yes" && <CheckCircle className="w-5 h-5 text-rose-500" />}
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, attendance: "no" })}
                className={`p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between group
                  ${formData.attendance === "no"
                    ? "border-gray-400 bg-gray-50 text-gray-700"
                    : "border-gray-100 hover:border-gray-200"
                  }`}
              >
                <span>К сожалению, не смогу</span>
                {formData.attendance === "no" && <CheckCircle className="w-5 h-5 text-gray-500" />}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {formData.attendance === "yes" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-8 overflow-hidden"
              >
                {/* Message / Comments */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 text-gray-700 font-medium">
                    <MessageSquare className="w-5 h-5 text-rose-400" />
                    Комментарий (пожелания, аллергии, дети)
                  </label>
                  <textarea
                    placeholder="Например: буду с супругой, аллергия на орехи, или просто теплые слова..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full h-32 p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-rose-300 focus:ring-rose-200 transition-all resize-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={isSubmitting || !formData.name || !formData.attendance}
            className={`w-full py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 transition-all
              ${isSubmitting || !formData.name || !formData.attendance
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-rose-500 text-white hover:bg-rose-600 shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-1"
              }`}
          >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Send className="w-5 h-5" />}
            {isSubmitting ? "Отправка..." : "Отправить ответ"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
