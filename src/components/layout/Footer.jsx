// src/components/layout/Footer.jsx
import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="px-6 md:px-20 py-20 grid grid-cols-2 md:grid-cols-5 gap-10">

        <div className="col-span-2">
          <div className="text-3xl font-serif tracking-tighter mb-4 text-gray-900">
            LUMIÈRE
          </div>

          <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-[240px]">
            Skincare essentials that bring out your natural radiance.
          </p>

          <div className="flex gap-3">
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-rose-400 hover:text-white text-gray-600 transition">
              <FaInstagram size={15} />
            </a>
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-rose-400 hover:text-white text-gray-600 transition">
              <FaFacebookF size={15} />
            </a>
            <a href="#" aria-label="Twitter" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-rose-400 hover:text-white text-gray-600 transition">
              <FaXTwitter size={15} />
            </a>
          </div>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-widest mb-5 text-gray-900">Shop</h5>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><Link to="/shop?category=cleanser" className="hover:text-rose-400 transition">Cleanser</Link></li>
            <li><Link to="/shop?category=serum" className="hover:text-rose-400 transition">Serum</Link></li>
            <li><Link to="/shop?category=moisturizer" className="hover:text-rose-400 transition">Moisturizer</Link></li>
            <li><Link to="/shop?category=sunscreen" className="hover:text-rose-400 transition">Sunscreen</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-widest mb-5 text-gray-900">Company</h5>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><Link to="/about" className="hover:text-rose-400 transition">About Us</Link></li>
            <li><Link to="/blog" className="hover:text-rose-400 transition">Blog</Link></li>
            <li><a href="#" className="hover:text-rose-400 transition">Careers</a></li>
            <li><a href="#" className="hover:text-rose-400 transition">Contact</a></li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-widest mb-5 text-gray-900">Support</h5>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="#" className="hover:text-rose-400 transition">Shipping Policy</a></li>
            <li><a href="#" className="hover:text-rose-400 transition">Returns</a></li>
            <li><a href="#" className="hover:text-rose-400 transition">FAQ</a></li>
            <li><a href="#" className="hover:text-rose-400 transition">Privacy Policy</a></li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-100 px-6 md:px-20 py-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
        <span>© {new Date().getFullYear()} Lumière. All rights reserved.</span>
        <span className="tracking-wide">Visa &middot; Mastercard &middot; PayPal &middot; ABA</span>
      </div>

    </footer>
  );
};

export default Footer;