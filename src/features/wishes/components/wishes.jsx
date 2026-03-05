import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import Marquee from "@/components/ui/marquee";
import {
  Calendar,
  Clock,
  ChevronDown,
  User,
  MessageCircle,
  Send,
  CheckCircle,
  XCircle,
  HelpCircle,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatEventDate } from "@/lib/format-event-date";
import { useInvitation } from "@/features/invitation";
import { fetchWishes, createWish, checkWishSubmitted } from "@/services/api";
import { getGuestName } from "@/lib/invitation-storage";

export default function Wishes() {
  const { uid } = useInvitation();
  const queryClient = useQueryClient();
  const [showConfetti, setShowConfetti] = useState(false);
  const [newWish, setNewWish] = useState("");
  const [guestName, setGuestName] = useState("");
  const [attendance, setAttendance] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isNameFromInvitation, setIsNameFromInvitation] = useState(false);
  const [hasSubmittedWish, setHasSubmittedWish] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedWish, setSelectedWish] = useState(null);

  // Get guest name from localStorage
  useEffect(() => {
    const storedGuestName = getGuestName();
    if (storedGuestName) {
      setGuestName(storedGuestName);
      setIsNameFromInvitation(true);
    }
  }, []);

  // Check if guest has already submitted a wish
  useEffect(() => {
    const checkSubmissionStatus = async () => {
      if (uid && guestName && isNameFromInvitation) {
        try {
          const response = await checkWishSubmitted(uid, guestName);
          if (response && response.success && response.hasSubmitted) {
            setHasSubmittedWish(true);
          }
        } catch (error) {
          console.warn("Error checking wish status (backend might be offline):", error);
          // Don't show error to user, just let them try to submit
        }
      }
    };

    checkSubmissionStatus();
  }, [uid, guestName, isNameFromInvitation]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const options = [
    { value: "ATTENDING", label: "Да, я буду" },
    { value: "NOT_ATTENDING", label: "Нет, не смогу" },
    { value: "MAYBE", label: "Возможно, уточню позже" },
  ];

  // Fetch wishes using React Query
  const {
    data: wishes = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wishes", uid],
    queryFn: async () => {
      if (!uid) return [];
      try {
        const response = await fetchWishes(uid);
        if (response.success) {
          return response.data;
        }
      } catch (err) {
        console.warn("Failed to fetch wishes", err);
        return [];
      }
      return [];
    },
    enabled: !!uid,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Mutation for creating wishes
  const createWishMutation = useMutation({
    mutationFn: (wishData) => createWish(uid, wishData),
    onSuccess: (response) => {
      if (response && response.success) {
        // Optimistically update the cache
        queryClient.setQueryData(["wishes", uid], (old = []) => [
          response.data,
          ...old,
        ]);
        // Reset form (keep guest name)
        setNewWish("");
        setAttendance("");
        setHasSubmittedWish(true);
        setErrorMessage("");
        // Show confetti
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    },
    onError: (err) => {
      console.error("Error submitting wish:", err);

      // Check if it's a duplicate wish error
      if (
        err &&
        (err.code === "DUPLICATE_WISH" ||
        (err.message && err.message.includes("already submitted")))
      ) {
        setHasSubmittedWish(true);
        setErrorMessage("");
      } else {
        setErrorMessage("Не удалось отправить сообщение. Попробуйте еще раз.");
        // Auto-hide error after 5 seconds
        setTimeout(() => setErrorMessage(""), 5000);
      }
    },
  });

  const handleSubmitWish = async (e) => {
    e.preventDefault();
    if (!newWish.trim() || !guestName.trim()) return;

    if (!uid) {
      setErrorMessage("Приглашение не найдено. Проверьте ссылку.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    // Clear any previous errors
    setErrorMessage("");

    createWishMutation.mutate({
      name: guestName.trim(),
      message: newWish.trim(),
      attendance: attendance || "MAYBE",
    });
  };
  const getAttendanceIcon = (status) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case "attending":
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case "not_attending":
      case "not-attending":
        return <XCircle className="w-4 h-4 text-rose-500" />;
      case "maybe":
        return <HelpCircle className="w-4 h-4 text-amber-500" />;
      default:
        return null;
    }
  };
  return (
    <>
      <section id="wishes" className="min-h-screen relative overflow-hidden">
        {showConfetti && <Confetti recycle={false} numberOfPieces={200} />}
        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4 mb-16"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block text-rose-500 font-medium"
            >
              Подтвердите участие
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-serif text-gray-800"
            >
              Анкета гостя
            </motion.h2>

            {/* Decorative Divider */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4 pt-4"
            >
              <div className="h-[1px] w-12 bg-rose-200" />
              <CheckCircle className="w-5 h-5 text-rose-400" />
              <div className="h-[1px] w-12 bg-rose-200" />
            </motion.div>
          </motion.div>

          {/* Wishes Form (RSVP) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-2xl mx-auto"
          >
            {hasSubmittedWish ? (
              <div className="backdrop-blur-sm bg-white/80 p-8 rounded-2xl border border-emerald-100 shadow-lg text-center">
                <div className="flex flex-col items-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-emerald-500" />
                  <h3 className="text-2xl font-serif text-gray-800">
                    Спасибо за ответ!
                  </h3>
                  <p className="text-gray-600">
                    Мы получили вашу информацию. С нетерпением ждем встречи!
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitWish} className="relative">
                <div className="backdrop-blur-sm bg-white/80 p-6 rounded-2xl border border-rose-100/50 shadow-lg">
                  {/* Error Message */}
                  <AnimatePresence>
                    {errorMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3"
                      >
                        <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm text-rose-800 font-medium">
                            {errorMessage}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setErrorMessage("")}
                          className="text-rose-400 hover:text-rose-600 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="space-y-6">
                    {/* Name Input - Pre-filled from URL or editable */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-500 text-sm mb-1">
                        <User className="w-4 h-4" />
                        <label htmlFor="guest-name">Ваше имя</label>
                      </div>
                      <input
                        type="text"
                        id="guest-name"
                        name="guestName"
                        autoComplete="name"
                        placeholder="Введите ваше имя..."
                        value={guestName}
                        onChange={(e) => {
                          setGuestName(e.target.value);
                          setIsNameFromInvitation(false);
                        }}
                        disabled={isNameFromInvitation}
                        className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 text-gray-700 placeholder-gray-400 ${
                          isNameFromInvitation
                            ? "bg-gray-100 border-gray-200 cursor-not-allowed opacity-75"
                            : "bg-white/50 border-rose-100 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50"
                        }`}
                        required
                      />
                    </div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-2 relative"
                    >
                      <div className="flex items-center space-x-2 text-gray-500 text-sm mb-1">
                        <Calendar className="w-4 h-4" />
                        <label>Планируете ли вы присутствовать?</label>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setAttendance("ATTENDING")}
                          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-200 font-medium ${
                            attendance === "ATTENDING"
                              ? "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm"
                              : "bg-white/50 border-rose-100 text-gray-600 hover:bg-rose-50 hover:border-rose-200"
                          }`}
                        >
                          <CheckCircle
                            className={`w-4 h-4 ${
                              attendance === "ATTENDING"
                                ? "text-emerald-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span>Приду</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setAttendance("NOT_ATTENDING")}
                          className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-xl border transition-all duration-200 font-medium ${
                            attendance === "NOT_ATTENDING"
                              ? "bg-rose-50 border-rose-200 text-rose-700 shadow-sm"
                              : "bg-white/50 border-rose-100 text-gray-600 hover:bg-rose-50 hover:border-rose-200"
                          }`}
                        >
                          <XCircle
                            className={`w-4 h-4 ${
                              attendance === "NOT_ATTENDING"
                                ? "text-rose-500"
                                : "text-gray-400"
                            }`}
                          />
                          <span>Не смогу</span>
                        </button>
                      </div>
                    </motion.div>
                    {/* Wish Textarea - Hidden/Optional for RSVP focus, but kept for backend compatibility if needed, or renamed to "Note" */}
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-500 text-sm mb-1">
                        <MessageCircle className="w-4 h-4" />
                        <label htmlFor="wish-message">
                          Комментарий (аллергии, дети, пожелания)
                        </label>
                      </div>
                      <textarea
                        id="wish-message"
                        name="message"
                        placeholder="Например: буду с супругой, аллергия на орехи..."
                        value={newWish}
                        onChange={(e) => setNewWish(e.target.value)}
                        className="w-full h-24 p-4 rounded-xl bg-white/50 border border-rose-100 focus:border-rose-300 focus:ring focus:ring-rose-200 focus:ring-opacity-50 resize-none transition-all duration-200"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <motion.button
                      type="submit"
                      disabled={createWishMutation.isPending}
                      whileHover={{
                        scale: createWishMutation.isPending ? 1 : 1.02,
                      }}
                      whileTap={{
                        scale: createWishMutation.isPending ? 1 : 0.98,
                      }}
                      className={`w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200
                    ${
                      createWishMutation.isPending
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-rose-500 hover:bg-rose-600"
                    }`}
                    >
                      {createWishMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      <span>
                        {createWishMutation.isPending
                          ? "Отправка..."
                          : "Подтвердить"}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
