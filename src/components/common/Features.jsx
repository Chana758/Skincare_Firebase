
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

const Features = () => {
  const items = [
    { icon: Truck, title: "FREE SHIPPING", desc: "On orders over $50" },
    { icon: ShieldCheck, title: "HIGH QUALITY", desc: "Premium quality products" },
    { icon: RotateCcw, title: "EASY RETURNS", desc: "30 days money back" },
    { icon: Headphones, title: "SECURE PAYMENT", desc: "100% secure checkout" },
  ];

  return (
    <div className="bg-[#FDF0EE] mt-5">
      <div className="flex flex-wrap justify-between px-6 md:px-20 py-8 max-w-6xl mx-auto">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 flex-1 min-w-[220px] justify-center py-3 md:border-r border-rose-200/60 last:border-0"
          >
            <div className="w-11 h-11 rounded-full border border-rose-300 flex items-center justify-center shrink-0 bg-white/60">
              <item.icon className="text-rose-400" size={20} />
            </div>
            <div>
              <h4 className="text-[12px] font-bold tracking-widest text-gray-900">
                {item.title}
              </h4>
              <p className="text-[11px] text-gray-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;