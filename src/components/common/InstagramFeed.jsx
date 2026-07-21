// src/components/common/InstagramFeed.jsx
const instagramImages = [
  "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&q=80",
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80",
  "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
  "https://i.pinimg.com/736x/46/f9/5a/46f95a78d6b6b078106b0ffb225e392b.jpg",
  "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80",
  "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
];

const InstagramFeed = () => {
  return (
    <section className="px-6 md:px-20 py-16 bg-white">
      <div className="text-center mb-8">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gray-900">
          Follow Us On Instagram{" "}
          <span className="text-rose-400">@LUMIERE.BEAUTY</span>
        </h2>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
        {instagramImages.map((src, i) => (
          <a key={i} href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="group relative aspect-square rounded-xl overflow-hidden block">
            <img
              src={src}
              alt={`Instagram post ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
          </a>
        ))}
      </div>
    </section>
  );
};

export default InstagramFeed;