import React from 'react';
import { X, Star, Clock, ChefHat, Plus, Check, Flame, ShieldAlert, Sparkles } from 'lucide-react';

export default function StallDetailModal({ stall, onClose, onAddToCart, addedItemsMap }) {
  if (!stall) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl bg-culinary-card border border-slate-700/80 shadow-2xl overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-culinary-dark/80 backdrop-blur-md text-slate-300 hover:text-white hover:bg-black/90 flex items-center justify-center border border-white/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Header */}
        <div className="relative h-64 sm:h-72 overflow-hidden">
          <img
            src={stall.coverImage || stall.image}
            alt={stall.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-culinary-card via-culinary-card/60 to-black/30" />

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-500 text-culinary-dark">
                  {stall.badge}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-white">
                  {stall.stallNumber}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-amber-300">
                  {stall.category}
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
                {stall.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 font-medium mt-1">
                {stall.tagline}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-culinary-dark/90 border border-slate-700 text-amber-300 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{stall.rating}</span>
                <span className="text-slate-400 text-[10px]">({stall.reviewsCount} reviews)</span>
              </span>
              <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-culinary-dark/90 border border-slate-700 text-slate-200 text-xs font-semibold">
                <Clock className="w-4 h-4 text-culinary-gold" />
                <span>{stall.prepTime}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              About This Specialty Kitchen
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {stall.description}
            </p>
          </div>

          {/* Menu Items List */}
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
              <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <span>Exclusive Dishes</span>
                <span className="text-xs font-sans text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-500/10">
                  {stall.menu.length} Items Available
                </span>
              </h3>
              <span className="text-[11px] text-slate-400">All prices include local service</span>
            </div>

            <div className="space-y-4">
              {stall.menu.map((dish) => {
                const isAdded = addedItemsMap[dish.id];

                return (
                  <div
                    key={dish.id}
                    className="p-4 rounded-2xl bg-[#0f1317] border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      {dish.image && (
                        <img
                          src={dish.image}
                          alt={dish.name}
                          className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-slate-800"
                        />
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="text-base font-bold text-white">
                            {dish.name}
                          </h4>
                          {dish.spiciness > 0 && (
                            <span
                              className="flex items-center text-rose-400 text-xs"
                              title={`Spice level ${dish.spiciness}/3`}
                            >
                              {Array.from({ length: dish.spiciness }).map((_, i) => (
                                <Flame key={i} className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                              ))}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {dish.description}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {dish.dietary.map((tag) => (
                            <span
                              key={tag}
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                tag === 'Chef Special'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : tag === 'Vegetarian' || tag === 'Vegan'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      <span className="text-lg font-extrabold text-culinary-gold">
                        ৳{dish.price}
                      </span>
                      <button
                        onClick={() => onAddToCart(dish, stall.name)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all spring-click ${
                          isAdded
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-culinary-dark shadow-md shadow-amber-500/20'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>In Tray</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add to Tray</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-[#0a0d10] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Stall located at Level 2, Chef’s Table Gulshan 2</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold"
          >
            Back to Stalls
          </button>
        </div>
      </div>
    </div>
  );
}
