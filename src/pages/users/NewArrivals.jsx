// src/pages/users/NewArrivals.jsx
import React, { useState, useMemo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../../components/common/ProductCard';
import { Sparkles } from 'lucide-react';

const NewArrivals = () => {
  const { products, loading } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter only products marked as new arrivals
  const newArrivalsList = useMemo(() => {
    return products.filter((p) => p.new || p.isNew || p.tag === 'new');
  }, [products]);

  // Filter by category and search query (case-insensitive category match)
  const filteredProducts = useMemo(() => {
    return newArrivalsList.filter((p) => {
      const matchesCategory =
        selectedCategory === 'ALL' ||
        (p.category || '').toUpperCase() === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [newArrivalsList, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white pt-12 pb-24">
      {/* Header Section with Luxury Styling */}
      <div className="text-center mb-16 px-6">
        <p className="text-xs uppercase tracking-[0.25em] text-rose-400 font-semibold mb-3">
          Curated For You
        </p>
        <h1 className="text-3xl md:text-4xl font-serif tracking-wider text-gray-900 uppercase">
          New Arrivals
        </h1>

        {/* Luxury Divider */}
        <div className="flex items-center justify-center gap-3 mt-4">
          <div className="h-[2px] w-16 bg-rose-400" />
          <span className="text-rose-600 text-xs">
            <Sparkles size={16} />
          </span>
          <div className="h-[2px] w-16 bg-rose-400" />
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 border-b border-rose-100 pb-6">
          {/* Categories Tab */}
          <div className="flex flex-wrap justify-center md:justify-start gap-2">
            {['ALL', 'CLEANSER', 'TONER', 'SERUM', 'MOISTURIZER', 'SUNSCREEN', 'MASK'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-full text-xs font-medium tracking-widest uppercase transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-rose-500 text-white shadow-md'
                    : 'bg-rose-50/50 text-gray-700 hover:bg-rose-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search new arrivals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-full border border-rose-200 text-sm focus:outline-none focus:border-rose-400 bg-rose-50/20"
            />
          </div>
        </div>

        {/* Product Grid or Empty State */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="w-10 h-10 border-4 border-rose-300 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-rose-50/20 rounded-2xl border border-dashed border-rose-200">
            <Sparkles className="mx-auto text-rose-300 mb-3" size={32} />
            <h3 className="text-lg font-serif text-gray-800 mb-1">No New Arrivals Found</h3>
            <p className="text-sm text-gray-500 mb-6">
              There are no new products matching your criteria at the moment.
            </p>
            <button
              onClick={() => { setSelectedCategory('ALL'); setSearchQuery(''); }}
              className="px-6 py-2.5 bg-gray-900 text-white text-xs tracking-widest uppercase rounded-full hover:bg-rose-500 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewArrivals;