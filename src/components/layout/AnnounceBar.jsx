// src/components/layout/AnnounceBar.jsx
import React, { memo } from 'react';
import { Truck, Star } from 'lucide-react';

const AnnounceItem = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2">
    <Icon size={14} aria-hidden="true" />
    <span>{children}</span>
  </div>
);

const AnnounceBar = memo(() => {
  return (
    <div 
      className="bg-rose-200/50 sticky top-0 z-50 py-2 px-4 text-[11px] font-medium tracking-wider text-gray-800 overflow-hidden"
      role="region"
      aria-label="Announcement bar"
    >
      {/* 1. បង្ហាញនៅលើ Desktop (ទម្រង់ স্থিরចំកណ្តាល ធម្មតា មិនរត់) */}
      <div className="hidden md:flex justify-center items-center gap-8">
        <AnnounceItem icon={Truck}>
          Free Shipping on orders over $50
        </AnnounceItem>
        <span aria-hidden="true">|</span>
        <AnnounceItem icon={Star}>
          Get 10% off on your first order - Use code: <b className="font-bold">GLOW10</b>
        </AnnounceItem>
      </div>

      {/* 2. បង្ហាញនៅលើ Mobile Phone (ទម្រង់រត់វិលស្វ័យប្រវត្តិ) */}
      <div className="md:hidden overflow-hidden w-full flex">
        <div className="animate-marquee flex items-center shrink-0">
          <div className="flex items-center gap-8 px-4 shrink-0">
            <AnnounceItem icon={Truck}>
              Free Shipping on orders over $50
            </AnnounceItem>
            <span>|</span>
            <AnnounceItem icon={Star}>
              Get 10% off on your first order - Use code: <b className="font-bold">GLOW10</b>
            </AnnounceItem>
          </div>
          <div className="flex items-center gap-8 px-4 shrink-0">
            <AnnounceItem icon={Truck}>
              Free Shipping on orders over $50
            </AnnounceItem>
            <span>|</span>
            <AnnounceItem icon={Star}>
              Get 10% off on your first order - Use code: <b className="font-bold">GLOW10</b>
            </AnnounceItem>
          </div>
        </div>
      </div>
    </div>
  );
});

AnnounceBar.displayName = 'AnnounceBar';

export default AnnounceBar;