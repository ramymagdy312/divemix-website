"use client";

import { motion } from "framer-motion";
import { Users, Award, Globe, Clock } from "lucide-react";

const stats = [
  {
    icon: Award,
    value: "20+",
    label: "Years Experience",
    delay: 0.1,
  },
  {
    icon: Users,
    value: "1000+",
    label: "Projects Completed",
    delay: 0.2,
  },
  {
    icon: Globe,
    value: "50+",
    label: "Countries Served",
    delay: 0.3,
  },
  {
    icon: Clock,
    value: "24/7",
    label: "Support Available",
    delay: 0.4,
  },
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-cyan-900 to-cyan-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: stat.delay, duration: 0.5 }}
              className="text-center text-white p-6 rounded-xl bg-white/5 backdrop-blur-sm"
            >
              <stat.icon className="h-8 w-8 mx-auto mb-4 text-cyan-300" />
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-cyan-200">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
