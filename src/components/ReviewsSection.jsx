import React, { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle, ExternalLink, ThumbsUp, Sparkles, Filter, User } from 'lucide-react';
import { reviewsData, ratingSummary } from '../data/reviewsData';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState(reviewsData);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({
    author: '',
    rating: 5,
    comment: '',
    favorite: '',
  });
  const [submittedToast, setSubmittedToast] = useState(false);

  const googleMapsUrl = "https://maps.app.goo.gl/hRYZ4iKM5BJ1Xf3x5";

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!newReview.author || !newReview.comment) return;

    const userEntry = {
      id: 'rev-user-' + Date.now(),
      author: newReview.author,
      role: 'Verified Foodie',
      avatar: '',
      rating: Number(newReview.rating),
      date: 'Just now',
      source: 'Direct Review',
      comment: newReview.comment,
      favoriteItems: newReview.favorite ? [newReview.favorite] : ['Radhuni Table Signature'],
      verifiedDiner: true,
    };

    setReviews([userEntry, ...reviews]);
    setShowReviewForm(false);
    setNewReview({ author: '', rating: 5, comment: '', favorite: '' });
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 4000);
  };

  return (
    <section id="reviews" className="py-20 bg-culinary-dark border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-culinary-gold text-xs font-semibold uppercase tracking-wider mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Verified Diner Feedback</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Loved by Chattogram's Epicures
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl">
              Real reviews from Google Maps and local guides celebrating our food hall atmosphere, diversity of stalls, and signature dishes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-culinary-dark shadow-md shadow-amber-500/20 transition-all flex items-center gap-2"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
            </button>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-slate-200 border border-slate-700/80 transition-all flex items-center gap-1.5"
            >
              <span>See 4,800+ on Google</span>
              <ExternalLink className="w-3 h-3 text-culinary-gold" />
            </a>
          </div>
        </div>

        {/* Toast confirmation */}
        {submittedToast && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Thank you for your review! It has been posted to the feed.</span>
          </div>
        )}

        {/* Rating Breakdown Banner */}
        <div className="p-6 md:p-8 rounded-3xl bg-culinary-card border border-slate-800 shadow-xl mb-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-800 pb-6 md:pb-0 md:pr-8">
            <span className="font-serif text-5xl sm:text-6xl font-extrabold text-white block">
              {ratingSummary.averageRating}
            </span>
            <div className="flex items-center justify-center md:justify-start gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-400">
              Based on <strong>4,890+ verified diners</strong> on Google Maps
            </p>
          </div>

          <div className="md:col-span-8 space-y-2 text-xs">
            {[5, 4, 3, 2, 1].map((stars) => {
              const pct = ratingSummary.distribution[stars] || 0;
              return (
                <div key={stars} className="flex items-center gap-3">
                  <span className="w-12 text-slate-400 flex items-center gap-1">
                    <span>{stars}</span>
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-slate-400 font-mono">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Submit Review Form (collapsible) */}
        {showReviewForm && (
          <div className="mb-12 p-6 sm:p-8 rounded-3xl bg-[#0e1216] border border-amber-500/40 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-serif font-bold text-white mb-1">
              Share Your Radhuni Table Experience
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Tell the community about your favorite stall, seat zone, or dish!
            </p>

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farhan Ahmed"
                    value={newReview.author}
                    onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-culinary-card border border-slate-800 text-white focus:outline-none focus:border-culinary-gold"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Star Rating</label>
                  <select
                    value={newReview.rating}
                    onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-culinary-card border border-slate-800 text-white focus:outline-none focus:border-culinary-gold"
                  >
                    <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
                    <option value={4}>★★★★☆ (4 Stars - Great)</option>
                    <option value={3}>★★★☆☆ (3 Stars - Average)</option>
                    <option value={2}>★★☆☆☆ (2 Stars - Needs Improvement)</option>
                    <option value={1}>★☆☆☆☆ (1 Star - Poor)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Favorite Dish or Stall</label>
                <input
                  type="text"
                  placeholder="e.g. Darbar Butter Chicken, Turkish Shish, or Pistachio Gelato"
                  value={newReview.favorite}
                  onChange={(e) => setNewReview({ ...newReview, favorite: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-culinary-card border border-slate-800 text-white focus:outline-none focus:border-culinary-gold"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Review</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the flavors, service, seating ambiance..."
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-culinary-card border border-slate-800 text-white focus:outline-none focus:border-culinary-gold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl font-bold bg-amber-500 hover:bg-amber-400 text-culinary-dark shadow-md"
                >
                  Publish Review
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-culinary-card border border-slate-800/90 shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {rev.avatar ? (
                      <img
                        src={rev.avatar}
                        alt={rev.author}
                        className="w-10 h-10 rounded-full object-cover border border-amber-500/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-slate-400 flex-shrink-0">
                        <User className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-bold text-white">{rev.author}</h4>
                      <p className="text-[11px] text-slate-400">{rev.role}</p>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-500 font-medium">
                    {rev.date}
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-slate-700 text-slate-700'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/5 text-slate-300">
                    {rev.source}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              {rev.favoriteItems && rev.favoriteItems.length > 0 && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Ordered:</span>
                  {rev.favoriteItems.map((item) => (
                    <span
                      key={item}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
