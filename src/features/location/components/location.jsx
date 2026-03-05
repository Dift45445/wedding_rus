import { useConfig } from "@/features/invitation/hooks/use-config";
import { ExternalLink, MapPin, Map as MapIcon, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function Location() {
  const config = useConfig(); // Use hook to get config from API or fallback to static
  const [activeTab, setActiveTab] = useState("photo"); // 'photo' or 'map'

  return (
    <>
      {/* Location section */}
      <section id="location" className="min-h-screen relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-16"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif text-gray-800"
            >
              Адрес и карта
            </motion.h2>

            {/* Decorative Divider */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-4 pt-4"
            >
              <div className="h-[1px] w-12 bg-rose-200" />
              <MapPin className="w-5 h-5 text-rose-400" />
              <div className="h-[1px] w-12 bg-rose-200" />
            </motion.div>
          </motion.div>

          {/* Location Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h3 className="text-2xl font-serif text-gray-800">
                  {config.location}
                </h3>

                {/* Toggle Buttons */}
                <div className="flex bg-gray-100 p-1 rounded-lg self-start md:self-auto">
                  <button
                    onClick={() => setActiveTab("photo")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      activeTab === "photo"
                        ? "bg-white text-rose-500 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    Фото
                  </button>
                  <button
                    onClick={() => setActiveTab("map")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      activeTab === "map"
                        ? "bg-white text-rose-500 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <MapIcon className="w-4 h-4" />
                    Карта
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                {/* Content Container with AnimatePresence */}
                <div className="relative rounded-xl overflow-hidden shadow-md bg-gray-50 aspect-video">
                  <AnimatePresence mode="wait">
                    {activeTab === "photo" ? (
                      <motion.div
                        key="photo"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <img
                          src="/images/venue.jpg"
                          alt={config.location}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="map"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0"
                      >
                        <iframe
                          src={config.maps_embed}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full"
                        ></iframe>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action Button - Full Width */}
                <div className="pt-2">
                  <motion.a
                    href={config.maps_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    viewport={{ once: true }}
                    className="w-full flex items-center justify-center gap-1.5 bg-white text-gray-600 px-4 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm shadow-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span className="font-semibold">Открыть карту в приложении</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
