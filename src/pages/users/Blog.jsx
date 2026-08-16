import { useMemo, useState } from "react";
import { Calendar, Clock, User, ArrowUpRight } from "lucide-react";
import Newsletter from "../../components/common/Newsletter";
import { useBlogPosts } from "../../hooks/useBlogPosts";
import { BLOG_CATEGORIES } from "../../services/blogService";

const formatDate = (ts) => {
  if (!ts) return "";
  const dateObj = ts?.toDate ? ts.toDate() : new Date(ts);
  if (isNaN(dateObj.getTime())) return "";
  return dateObj.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const Blog = () => {
  const { posts, loading } = useBlogPosts();
  const [activeCategory, setActiveCategory] = useState("All");

  const featured = useMemo(() => {
    const feat = posts.find((p) => p.featured);
    if (!feat) return null;
    if (activeCategory === "All" || feat.category === activeCategory) {
      return feat;
    }
    return null;
  }, [posts, activeCategory]);

  const filteredPosts = useMemo(() => {
    const rest = featured ? posts.filter((p) => p.id !== featured.id) : posts;
    if (activeCategory === "All") return rest;
    return rest.filter((p) => p.category === activeCategory);
  }, [posts, featured, activeCategory]);

  return (
    <main className="bg-[#FAF8F5] min-h-screen">
      {/* Header Section */}
      <section className="px-6 md:px-20 max-w-3xl mx-auto text-center pt-20 pb-12">
        <p className="text-xs uppercase tracking-[0.25em] text-rose-400 font-bold mb-3">
          Skincare Journal
        </p>
        <h1 className="text-4xl md:text-6xl font-serif text-gray-900 mb-5 leading-[1.15]">
          Tips, Stories & Science
        </h1>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed">
          Everything we've learned about skin, ingredients, and building routines
          that actually work — straight from our team of skincare enthusiasts.
        </p>
      </section>

      {loading ? (
        <div className="text-center py-20 text-gray-400 text-sm font-semibold tracking-wide animate-pulse">
          Loading articles...
        </div>
      ) : (
        <>
          {/* Featured Article Banner */}
          {featured && (
            <section className="px-6 md:px-20 max-w-6xl mx-auto mb-14">
              <div className="group grid md:grid-cols-2 gap-0 rounded-[32px] overflow-hidden bg-white border border-gray-100 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.06)] hover:shadow-2xl transition-all duration-500">
                <div className="h-80 md:h-full overflow-hidden bg-[#F4F1EA] relative">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-8 md:p-12 flex flex-col justify-center my-auto">
                  <div>
                    <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-rose-400 mb-3">
                      Featured · {featured.category}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-4 leading-snug group-hover:text-rose-500 transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 font-normal">
                      {featured.excerpt}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
                    {featured.author && (
                      <div className="flex items-center gap-2 text-gray-800 font-semibold">
                        <div className="w-6 h-6 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 shrink-0">
                          <User size={12} />
                        </div>
                        <span>By {featured.author}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-gray-500 font-medium">
                      {(featured.date || featured.createdAt) && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-rose-400" />
                          {featured.date ? formatDate(featured.date) : formatDate(featured.createdAt)}
                        </span>
                      )}
                      {featured.readTime && (
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-rose-400" />
                          {featured.readTime}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Category Filter Buttons */}
          <section className="px-6 md:px-20 max-w-6xl mx-auto mb-10">
            <div className="flex flex-wrap gap-2 justify-start items-center">
              {BLOG_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    activeCategory === cat
                      ? "bg-gray-900 text-white shadow-md shadow-gray-200"
                      : "bg-white text-gray-600 border border-gray-200/80 hover:bg-gray-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Blog Cards Grid */}
          <section className="px-6 md:px-20 max-w-6xl mx-auto pb-24">
            {filteredPosts.length === 0 ? (
              <div className="text-center text-gray-400 py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                No articles found in this category.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group bg-transparent flex flex-col justify-between"
                  >
                    <div>
                      {/* Image Container - Increased Height using aspect-[4/3] */}
                      <div className="aspect-[4/3] w-full overflow-hidden rounded-[24px] bg-[#F4F1EA] mb-5 shadow-sm border border-gray-100/80">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>

                      {/* Content Body */}
                      <div className="px-1">
                        <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-rose-400 mb-2">
                          {post.category}
                        </span>
                        <h3 className="font-serif text-xl font-bold text-gray-900 mb-2.5 leading-snug group-hover:text-rose-500 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-normal mb-4">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Styled Meta Footer */}
                    <div className="px-1 pt-3 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                      {(post.date || post.createdAt) && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-rose-400" />
                          {post.date ? formatDate(post.date) : formatDate(post.createdAt)}
                        </span>
                      )}
                      {post.readTime && (
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-rose-400" />
                          {post.readTime}
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      <Newsletter />
    </main>
  );
};

export default Blog;