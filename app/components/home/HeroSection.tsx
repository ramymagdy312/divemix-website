"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center">
      <div className="absolute inset-0">
        <Image
          src="img/gallery/maintenence.jpg"
          alt="Industrial equipment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-white">
            Pioneering the Future of{" "}
            <span className="text-cyan-400">Gas Technology</span>
          </h1>
          <p className="text-xl mb-10 text-gray-200 leading-relaxed">
            Leading the industry with innovative solutions for gas mixing and
            compression systems. Trust DiveMix for reliability, precision, and
            excellence.
          </p>
          <div className="flex flex-wrap gap-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/products"
                className="inline-flex items-center px-8 py-4 bg-cyan-600 rounded-lg hover:bg-cyan-700 transition-colors text-lg font-medium text-white group"
              >
                Explore Products
                <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/contact"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-colors text-lg font-medium text-white border border-white/20"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;