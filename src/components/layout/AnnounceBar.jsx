import { Truck, Star } from 'lucide-react'; // Import មកពី lucide-react

const AnnounceBar = () => {
  return (
    <div className="bg-[#FDE8E8] sticky top-0 z-50 py-2 text-center text-[11px] font-medium tracking-wider text-gray-700 flex justify-center items-center gap-8">
      <div className="flex items-center gap-2">
        <Truck size={14} /> {/* ប្រើ Icon ជំនួស Emoji */}
        <span>Free Shipping on orders over $50</span>
      </div>
      <span>|</span>
      <div className="flex items-center gap-2">
        <Star size={14} /> {/* ប្រើ Icon ជំនួស Emoji */}
        <span>Get 10% off on your first order - Use code: <b>GLOW10</b></span>
      </div>
    </div>
  );
};

export default AnnounceBar;