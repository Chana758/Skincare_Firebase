// src/components/common/TrustBadges.jsx
import { Heart, Leaf, Droplets, Headphones } from "lucide-react";

const badges = [
  { icon: Heart, title: "Cruelty Free", desc: "We never test on animals" },
  { icon: Leaf, title: "Natural Ingredients", desc: "Clean & safe for your skin" },
  { icon: Droplets, title: "Dermatologically Tested", desc: "Gentle & safe formulas" },
  { icon: Headphones, title: "Customer Support", desc: "We're here to help you" },
];

const TrustBadges = () => {
  return (
    <section className="px-6 md:px-20 py-12 bg-[#FDF0EE] border-t border-rose-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {badges.map((badge, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-2">
            <badge.icon className="text-rose-400" size={28} />
            <h4 className="text-sm font-bold text-gray-900">{badge.title}</h4>
            <p className="text-xs text-gray-500">{badge.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustBadges;