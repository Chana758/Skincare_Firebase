// src/components/layout/Features.jsx
import React, { memo } from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

const FEATURES_DATA = [
  { id: 'shipping', icon: Truck, title: "FREE SHIPPING", desc: "On orders over $50" },
  { id: 'quality', icon: ShieldCheck, title: "HIGH QUALITY", desc: "Premium quality products" },
  { id: 'returns', icon: RotateCcw, title: "EASY RETURNS", desc: "30 days money back" },
  { id: 'support', icon: Headphones, title: "SECURE PAYMENT", desc: "100% secure checkout" },
];

const FeatureItem = memo(({ icon: Icon, title, desc }) => (
  <>
    {/* 1. បង្ហាញសម្រាប់ Desktop (ទម្រង់ដដែល គ្មានកាត) */}
    <div className="hidden md:flex items-center gap-3.5 py-2.5 px-6 flex-1 justify-center border-r border-rose-200/70 last:border-0">
      <div className="w-10 h-10 rounded-full border border-rose-300/80 flex items-center justify-center shrink-0 bg-white/80 shadow-2xs">
        <Icon className="text-rose-400" size={18} aria-hidden="true" />
      </div>
      <div>
        <h4 className="text-[11px] font-extrabold tracking-wider text-gray-900">
          {title}
        </h4>
        <p className="text-[10px] text-gray-500 font-medium">{desc}</p>
      </div>
    </div>

    {/* 2. បង្ហាញសម្រាប់ Mobile Phone (ទម្រង់ជាកាតដាច់ៗពីគ្នា មាន Shadow និង Border) */}
    <div className="flex md:hidden items-center gap-3.5 py-4 px-5 shrink-0 w-[280px] sm:w-[300px] bg-white rounded-2xl shadow-sm border border-rose-100">
      <div className="w-10 h-10 rounded-full border border-rose-200 flex items-center justify-center shrink-0 bg-rose-50">
        <Icon className="text-rose-400" size={18} aria-hidden="true" />
      </div>
      <div>
        <h4 className="text-[11px] font-extrabold tracking-wider text-gray-900">
          {title}
        </h4>
        <p className="text-[10px] text-gray-500 font-medium">{desc}</p>
      </div>
    </div>
  </>
));

FeatureItem.displayName = 'FeatureItem';

const Features = memo(() => {
  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] my-5" aria-label="Features">
      {/* Background ពណ៌ផ្កាឈូកបង្ហាញតែលើ Desktop ចំណែក Mobile ជាកាតស */}
      <div className="md:bg-rose-200/70 md:border-y md:border-rose-100/80 py-2">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16">
          {/* Desktop: flex ពេញ | Mobile: scroll ផ្តេកបង្ហាញជាកាត */}
          <div className="flex flex-nowrap md:flex-wrap items-center md:justify-between gap-4 overflow-x-auto md:overflow-visible scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden py-2">
            {FEATURES_DATA.map((item) => (
              <FeatureItem 
                key={item.id} 
                icon={item.icon} 
                title={item.title} 
                desc={item.desc} 
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

Features.displayName = 'Features';

export default Features;