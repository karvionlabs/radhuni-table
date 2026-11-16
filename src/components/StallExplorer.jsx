import React, { useState, useMemo, useEffect } from 'react';
import { Search, Star, Clock, ChefHat, Sparkles, Plus, ArrowUpRight, Check, Flame } from 'lucide-react';
import { cuisineCategories } from '../data/stallsData';
import { adminStorage } from '../services/adminStorageService';

export default function StallExplorer({ onSelectStall, onAddToCart, addedItemsMap }) {
  const [stalls, setStalls] = useState(() => adminStorage.getStalls());
  const [selectedCategory, setSelectedCategory] = useState('All Cuisines');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleUpdate = () => {
      setStalls(adminStorage.getStalls());
    };
    window.addEventListener('radhuni_store_updated', handleUpdate);
    return () => window.removeEventListener('radhuni_store_updated', handleUpdate);
  }, []);

  const filteredStalls = useMemo(() => {
    return stalls.filter((stall) => {
      const matchesCategory =
        selectedCategory === 'All Cuisines' || stall.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesName = stall.name.toLowerCase().includes(query);
      const matchesCategoryName = stall.category.toLowerCase().includes(query);
      const matchesTagline = stall.tagline.toLowerCase().includes(query);
      const matchesDish = stall.menu.some(
        (dish) =>
          dish.name.toLowerCase().includes(query) ||
          dish.description.toLowerCase().includes(query)
      );

      return matchesCategory && (matchesName || matchesCategoryName || matchesTagline || matchesDish);
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="stalls" className="scroll-mt-28 py-20 bg-culinary-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-culinary-gold text-xs font-semibold uppercase tracking-wider mb-2">
              <ChefHat className="w-3.5 h-3.5" />
              <span>Gourmet Food Hall Roster</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Explore 12+ Signature Stalls
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
              Each stall at Radhuni Table specializes in a distinct culinary tradition with zero menu crossover. Curate your meal across stalls into one unified tray.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              maxLength={60}
              placeholder="Search stalls, butter chicken, tacos..."
              value={searchQuery}
              onChange={(e) => {
                const clean = e.target.value.replace(/[<>'";\\=`]/g, '').slice(0, 60);
                setSearchQuery(clean);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-culinary-card border border-slate-700/80 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-culinary-gold transition-colors shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Cuisine Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-10">
          {cuisineCategories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 spring-click cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 text-culinary-dark shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-culinary-card text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Stalls Grid */}
        {filteredStalls.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-culinary-card border border-slate-800">
            <p className="text-slate-300 text-lg">No culinary stalls match "{searchQuery}"</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All Cuisines');
              }}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-culinary-dark"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStalls.map((stall) => {
              const signatureDish = stall.menu[0];
              const isAdded = addedItemsMap[signatureDish?.id];

              return (
                <div
                  key={stall.id}
                  className="group rounded-3xl luxury-card border border-amber-500/20 hover:border-amber-400/60 overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/15 flex flex-col justify-between"
                >
                  <div>
                    {/* Stall Cover Banner */}
                    <div className="relative h-52 overflow-hidden bg-slate-900">
                      <img
                        src={stall.coverImage || stall.image}
                        alt={stall.name}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="350"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-culinary-card via-culinary-card/40 to-transparent" />

                      {/* Stall Badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-culinary-dark/85 backdrop-blur-md text-culinary-gold border border-amber-500/30">
                          {stall.badge}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-black/60 text-slate-300 backdrop-blur-md">
                          {stall.stallNumber}
                        </span>
                      </div>

                      {/* Rating & Prep Time */}
                      <div className="absolute bottom-3 right-4 flex items-center gap-2">
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-culinary-dark/90 text-amber-300 border border-slate-700">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{stall.rating}</span>
                          <span className="text-slate-400 text-[10px]">({stall.reviewsCount})</span>
                        </span>
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-culinary-dark/90 text-slate-300 border border-slate-700">
                          <Clock className="w-3.5 h-3.5 text-culinary-gold" />
                          <span>{stall.prepTime}</span>
                        </span>
                      </div>
                    </div>

                    {/* Stall Details */}
                    <div className="p-6">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-amber-400 tracking-wide uppercase">
                            {stall.category}
                          </span>
                          <h3 className="text-2xl font-serif font-bold text-white group-hover:text-culinary-gold transition-colors mt-0.5">
                            {stall.name}
                          </h3>
                        </div>
                      </div>

                      <p className="mt-2 text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed">
                        {stall.description}
                      </p>

                      {/* Signature Specialty Callout with Studio Dish Framing */}
                      {signatureDish && (
                        <div className="mt-4 p-3 rounded-2xl bg-black/50 border border-amber-500/25 flex items-center gap-3 shadow-inner group/dish">
                          {signatureDish.image && (
                            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 border border-amber-500/40 shadow-md shadow-black/80">
                              <img
                                src={signatureDish.image}
                                alt={signatureDish.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover group-hover/dish:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0 pr-1">
                            <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-wider block">
                              Must-Try Signature
                            </span>
                            <h4 className="text-xs font-bold text-white line-clamp-1 leading-snug">
                              {signatureDish.name}
                            </h4>
                            <span className="text-xs font-extrabold text-culinary-gold mt-0.5 inline-block">
                              ৳{signatureDish.price}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onAddToCart(signatureDish, stall.name);
                            }}
                            className={`w-20 justify-center py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-200 spring-click flex-shrink-0 cursor-pointer ${
                              isAdded
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-culinary-dark shadow-sm'
                            }`}
                            aria-label={`Add ${signatureDish.name} to tray`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="px-6 pb-6 pt-1">
                    <button
                      onClick={() => onSelectStall(stall)}
                      className="w-full py-2.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-slate-100 hover:text-culinary-gold border border-slate-700/80 hover:border-amber-400/40 transition-all flex items-center justify-center gap-2 group-hover:bg-amber-500/10 cursor-pointer"
                    >
                      <span>Explore Stall Menu ({stall.menu.length} items)</span>
                      <ArrowUpRight className="w-4 h-4 text-culinary-gold" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
