// src/components/layout/Banner.jsx
import React, { memo } from 'react';
import { Link } from "react-router-dom";
import { LuLeaf, LuRabbit, LuDroplets, LuSparkles } from "react-icons/lu";
import banner from '../../assets/images/image.png';

const TRUST_FEATURES = [
  { icon: LuLeaf, label: "Clean Ingredients" },
  { icon: LuRabbit, label: "Cruelty Free" },
  { icon: LuDroplets, label: "Dermatologist Tested" },
  { icon: LuSparkles, label: "For All Skin Types" },
];

const Banner = memo(() => {
  return (
    <section 
      className="relative bg-rose-200/50 h-[600px] sm:h-[700px] lg:h-[800px] px-6 sm:px-12 lg:px-20 overflow-hidden flex items-center"
      aria-label="Hero Banner"
    >
      {/* 1. រូបភាពសម្រាប់ Mobile Phone (បង្ហាញនៅផ្ទៃខាងក្រោយជាមួយ Gradient Overlay) */}
      <div className="absolute inset-0 z-0 lg:hidden">
        <img
          src={banner}
          alt="Model showcasing natural skincare glow"
          className="h-full w-full object-cover object-[80%_top] mix-blend-multiply opacity-80"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-200/95 via-rose-200/60 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="max-w-[560px] z-10 relative text-left">
        <p className="text-xs sm:text-sm uppercase tracking-[0.2em] text-rose-600 font-bold mb-3">
          New Arrival
        </p>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif text-gray-900 leading-[1.15] mb-4 font-extrabold">
          Glow Naturally.<br />Shine Confidently.
        </h1>
        <p className="text-gray-700 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed font-semibold max-w-md">
          Skincare and beauty essentials that bring out your natural radiance.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center mb-8 lg:mb-10">
          <Link
            to="/shop"
            className="bg-rose-500 hover:bg-rose-600 text-white text-center px-8 py-3.5 rounded-full font-bold transition tracking-wider shadow-lg"
          >
            SHOP NOW
          </Link>
          <Link
            to="/new_arrivals"
            className="text-center font-bold tracking-wider text-gray-900 hover:text-rose-500 transition py-2"
          >
            EXPLORE COLLECTION →
          </Link>
        </div>

        {/* Brand Trust Features (លាក់នៅលើ Mobile តូចពេក និងបង្ហាញនៅលើ sm ឡើងទៅ) */}
        <div className="hidden sm:flex items-center text-xs md:text-sm text-gray-800 font-semibold pt-6 border-t border-rose-300/80">
          {TRUST_FEATURES.map((item, index) => (
            <div 
              key={item.label} 
              className={`flex flex-col items-center gap-1.5 px-4 first:pl-0 ${index !== TRUST_FEATURES.length - 1 ? 'border-r border-rose-300/80' : ''}`}
            >
              <item.icon className="text-xl md:text-2xl text-gray-900" aria-hidden="true" />
              <span className="text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. រូបភាពសម្រាប់ Desktop (លាក់នៅលើ Mobile និងបង្ហាញពេញលេញនៅខាងស្តាំលើ Desktop) */}
      <div className="hidden lg:block absolute right-0 bottom-0 h-full w-[50%]">
        <img
          src={banner}
          alt="Model showcasing natural skincare glow"
          className="h-full w-full object-cover object-top mix-blend-multiply"
          loading="eager"
        />
      </div>

      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow z-20">
        1/3
      </div>
    </section>
  );
});

Banner.displayName = 'Banner';

export default Banner;