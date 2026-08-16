// src/components/layout/Footer.jsx
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#F5EFE6] text-stone-800 pt-24 pb-12 mt-28 border-t border-[#E8DFD1]">
      <div className="max-w-[1440px] mx-auto px-8 md:px-16">
        
        {/* Top Feature Highlights Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-20 mb-16 border-b border-[#E8DFD1]">
          <div className="flex items-center gap-5 p-6 rounded-2xl bg-white/90 border border-[#E8DFD1] shadow-sm hover:shadow-md transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700 shrink-0 border border-rose-100">
              <Sparkles size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-1">100% Authentic</h4>
              <p className="text-[11px] text-stone-500">Certified premium skincare</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-6 rounded-2xl bg-white/90 border border-[#E8DFD1] shadow-sm hover:shadow-md transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700 shrink-0 border border-rose-100">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-1">Secure Checkout</h4>
              <p className="text-[11px] text-stone-500">Protected payments</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-6 rounded-2xl bg-white/90 border border-[#E8DFD1] shadow-sm hover:shadow-md transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700 shrink-0 border border-rose-100">
              <RefreshCw size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-1">Easy Returns</h4>
              <p className="text-[11px] text-stone-500">30-day guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-5 p-6 rounded-2xl bg-white/90 border border-[#E8DFD1] shadow-sm hover:shadow-md transition duration-300">
            <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-700 shrink-0 border border-rose-100">
              <Headphones size={22} />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900 mb-1">24/7 Support</h4>
              <p className="text-[11px] text-stone-500">Dedicated assistance</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-[#E8DFD1]">
          
          {/* Brand & Socials */}
          <div className="md:col-span-5 space-y-5">
            <div className="text-3xl font-serif tracking-[0.25em] text-stone-900 font-bold">
              LUMIÈRE
            </div>
            <p className="text-sm text-stone-600 leading-relaxed max-w-sm">
              Skincare essentials crafted to elevate your natural radiance and bring out your purest glow. Experience luxury everyday.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white border border-[#E8DFD1] flex items-center justify-center hover:bg-stone-900 hover:text-white hover:border-stone-900 text-stone-700 transition duration-300">
                <FaInstagram size={15} />
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white border border-[#E8DFD1] flex items-center justify-center hover:bg-stone-900 hover:text-white hover:border-stone-900 text-stone-700 transition duration-300">
                <FaFacebookF size={15} />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white border border-[#E8DFD1] flex items-center justify-center hover:bg-stone-900 hover:text-white hover:border-stone-900 text-stone-700 transition duration-300">
                <FaTwitter size={15} />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h5 className="text-xs font-bold uppercase tracking-[0.25em] mb-5 text-stone-900">Shop</h5>
              <ul className="space-y-3 text-sm text-stone-600 font-medium">
                <li><Link to="/shop?category=cleanser" className="hover:text-rose-700 transition">Cleanser</Link></li>
                <li><Link to="/shop?category=serum" className="hover:text-rose-700 transition">Serum</Link></li>
                <li><Link to="/shop?category=moisturizer" className="hover:text-rose-700 transition">Moisturizer</Link></li>
                <li><Link to="/shop?category=sunscreen" className="hover:text-rose-700 transition">Sunscreen</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-[0.25em] mb-5 text-stone-900">Company</h5>
              <ul className="space-y-3 text-sm text-stone-600 font-medium">
                <li><Link to="/about" className="hover:text-rose-700 transition">About Us</Link></li>
                <li><Link to="/blog" className="hover:text-rose-700 transition">Blog</Link></li>
                <li><Link to="/contact" className="hover:text-rose-700 transition">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-[0.25em] mb-5 text-stone-900">Support</h5>
              <ul className="space-y-3 text-sm text-stone-600 font-medium">
                <li><a href="#" className="hover:text-rose-700 transition">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-rose-700 transition">Returns</a></li>
                <li><a href="#" className="hover:text-rose-700 transition">FAQ</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Payments */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <span>© {new Date().getFullYear()} LUMIÈRE. All rights reserved.</span>
          <div className="flex items-center gap-3 font-medium tracking-wider bg-white px-5 py-2.5 rounded-full border border-[#E8DFD1] shadow-2xs">
            <span className="text-stone-700 font-semibold">Visa</span> 
            <span className="text-stone-300">•</span> 
            <span className="text-stone-700 font-semibold">Mastercard</span> 
            <span className="text-stone-300">•</span> 
            <span className="text-stone-700 font-semibold">PayPal</span> 
            <span className="text-stone-300">•</span> 
            <span className="text-[#DA291C] font-extrabold">ABA</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;