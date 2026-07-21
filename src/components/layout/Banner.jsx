// src/components/layout/Banner.jsx
import React from 'react'
import { Link } from "react-router-dom";
import banner from '../../assets/images/image.png'
import { LuLeaf, LuRabbit, LuDroplets, LuSparkles } from "react-icons/lu";

const Banner = () => {
  return (
    <div className="relative bg-[#ffece7] h-[800px] px-50 overflow-hidden flex items-center">

      <div className="max-w-[520px] z-10 relative -mt-10">
        <p className="text-sm uppercase tracking-[0.2em] text-rose-400 font-semibold mb-4">
          New Arrival
        </p>
        <h1 className="text-6xl font-serif text-gray-900 leading-[1.15] mb-5">
          Glow Naturally.<br />Shine Confidently.
        </h1>
        <p className="text-gray-500 mb-8 text-lg leading-relaxed">
          Skincare and beauty essentials<br />that bring out your natural radiance.
        </p>

        <div className="flex gap-6 items-center mb-10">
          <Link
            to="/shop"
            className="bg-rose-400 text-white px-10 py-3.5 rounded-full font-semibold hover:bg-rose-500 transition tracking-wide"
          >
            SHOP NOW
          </Link>

          <Link
            to="/new_arrivals"
            className="font-semibold tracking-wider hover:text-rose-400 hover:border-rose-400 transition"
          >
            EXPLORE COLLECTION →
          </Link>
        </div>

        <div className='mt-25'>
          <div className="flex items-center text-sm text-gray-500">
            <div className="flex flex-col items-center gap-1.5 px-6 border-r border-gray-300">
              <LuLeaf className="text-2xl text-gray-700" />
              <span>Clean Ingredients</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-6 border-r border-gray-300">
              <LuRabbit className="text-2xl text-gray-700" />
              <span>Cruelty Free</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-6 border-r border-gray-300">
              <LuDroplets className="text-2xl text-gray-700" />
              <span>Dermatologist Tested</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 px-6">
              <LuSparkles className="text-2xl text-gray-700" />
              <span>For All Skin Types</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 h-[100%] w-[50%]">
        <img
          src={banner}
          alt="Model with serum"
          className="h-full w-full object-cover object-top mix-blend-multiply"
        />
      </div>

      <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-bold shadow z-20">
        1/3
      </div>

    </div>
  );
};

export default Banner;