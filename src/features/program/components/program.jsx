import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Clock,
  MapPin,
  Music,
  Utensils,
  Camera,
  PartyPopper,
  Scroll,
  Church,
} from "lucide-react";
import { useConfig } from "@/features/invitation/hooks/use-config";

export default function Program() {
  const config = useConfig();
  const schedule = config.program || [];
  const containerRef = useRef(null);
  
  // Track vertical scroll progress of the container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const iconMap = {
    Clock,
    MapPin,
    Music,
    Utensils,
    Camera,
    PartyPopper,
    Scroll,
    Church,
    clock: Clock,
    mapPin: MapPin,
    music: Music,
    utensils: Utensils,
    camera: Camera,
    partyPopper: PartyPopper,
    scroll: Scroll,
    church: Church,
  };

  // Transform scroll progress to vertical position (from 0% to 100% height)
  const treeHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="py-20 relative overflow-hidden bg-white" ref={containerRef}>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-gray-800">
            План дня
          </h2>
          <div className="flex items-center justify-center gap-4 pt-4">
            <div className="h-[1px] w-12 bg-rose-200" />
            <Clock className="w-5 h-5 text-rose-400" />
            <div className="h-[1px] w-12 bg-rose-200" />
          </div>
        </motion.div>

        <div className="max-w-3xl mx-auto relative pb-20">
          {/* Vertical Line Background (Gray/Inactive) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-100 transform md:-translate-x-1/2 rounded-full" />
          
          {/* Active Progress Line (Rose/Active) - Grows vertically on scroll */}
          <motion.div 
            style={{ height: treeHeight }}
            className="absolute left-8 md:left-1/2 top-0 w-1 bg-rose-300 transform md:-translate-x-1/2 rounded-full origin-top z-0"
          />

          <div className="space-y-16 pt-8">
            {schedule.map((item, index) => {
              const Icon =
                iconMap[item.icon] || iconMap[item.icon?.toLowerCase()] || Clock;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5, margin: "-100px 0px -50px 0px" }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={`relative flex items-center gap-8 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Time - Desktop */}
                  <div className={`hidden md:block w-1/2 text-right ${index % 2 !== 0 ? "text-left" : ""}`}>
                     <span className={`text-2xl font-serif text-rose-500 font-medium block ${index % 2 === 0 ? "mr-[35%]" : "ml-[35%]"}`}>
                        {item.time}
                      </span>
                  </div>

                  {/* Icon Node on the Tree */}
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="relative z-10 flex-shrink-0 w-16 h-16 rounded-full bg-white border-4 border-rose-100 flex items-center justify-center shadow-lg mx-auto md:mx-0 group hover:scale-110 transition-transform duration-300"
                  >
                    <Icon className="w-6 h-6 text-rose-500" />
                  </motion.div>

                   {/* Content - Desktop */}
                  <div className={`hidden md:block w-1/2 ${index % 2 !== 0 ? "text-right" : "text-left"}`}>
                    <h3 className="text-xl font-serif text-gray-800 mb-2 font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>

                  {/* Mobile Layout (Time + Content on right) */}
                  <div className="md:hidden flex-1 pl-6">
                     <span className="text-xl font-serif text-rose-500 font-medium block mb-1">
                        {item.time}
                      </span>
                    <h3 className="text-lg font-serif text-gray-800 mb-1 font-semibold">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
