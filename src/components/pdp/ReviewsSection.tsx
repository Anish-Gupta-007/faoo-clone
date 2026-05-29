'use client';
import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/cn';
import { reviewService } from '@/services/reviewService';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

function StarRow({ rating, size = 13, className }: { rating: number; size?: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={cn(
            'transition-colors',
            s <= rating ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-[#D4D4D4]'
          )}
        />
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em', color: '#A3A3A3', minWidth: '1rem', textAlign: 'right' }}>
        {stars}
      </span>
      <div className="flex-1 h-[1px] bg-[#EFEFEF] relative overflow-hidden rounded-full">
        <div className="absolute left-0 top-0 h-full bg-[#0A0A0A] transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.65rem', letterSpacing: '0.1em', color: '#A3A3A3', minWidth: '1rem' }}>
        {count}
      </span>
    </div>
  );
}

function ReviewCard({ review }: { review: any }) {
  const [expanded, setExpanded] = useState(false);
  const long = review.reviewText && review.reviewText.length > 180;
  const displayed = long && !expanded ? review.reviewText.slice(0, 180).trimEnd() + '…' : review.reviewText || '';

  return (
    <article className="py-8 border-b border-[#EFEFEF] last:border-b-0">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex flex-col gap-1.5">
          <StarRow rating={review.rating} size={12} />
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: '1.05rem', color: '#0A0A0A' }}>
            {review.rating >= 4 ? 'Exceptional piece.' : 'Review from customer'}
          </h3>
        </div>
        <time style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#C4C4C4' }}>
          {new Date(review.publishedAt || review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </time>
      </div>

      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.8rem', lineHeight: '1.75', color: '#525252' }}>
        {displayed}
      </p>
      
      {long && (
        <button
          onClick={() => setExpanded((e) => !e)}
          style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#0A0A0A', marginTop: '0.5rem', borderBottom: '1px solid #0A0A0A', paddingBottom: '1px' }}
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-5">
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#0A0A0A', fontWeight: 500 }}>
          {review.userId?.fullName || 'Verified Buyer'}
        </span>
        <span className="w-[1px] h-3 bg-[#E5E5E5]" />
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#A3A3A3' }}>
          Verified
        </span>
      </div>
    </article>
  );
}

export function ReviewsSection({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [filter, setFilter] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (productId) {
      reviewService.getProductReviews(productId)
        .then(res => {
          if (res.success) setReviews(res.reviews);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [productId]);

  const displayed = filter ? reviews.filter((r) => r.rating === filter) : reviews;
  const total = reviews.length;
  const average = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
  
  const breakdown = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to write a review');
      return;
    }
    setSubmitting(true);
    try {
      await reviewService.postReview({ productId, rating, reviewText });
      toast.success('Review submitted successfully! It will be visible after approval.');
      setShowForm(false);
      setReviewText('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <section aria-label="Customer Reviews" className="w-full border-t border-[#EFEFEF] py-20 md:py-28">
      <div className="container-page">
        <div className="flex items-baseline justify-between gap-4 mb-14 md:mb-16">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, letterSpacing: '0.28em', fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)', textTransform: 'uppercase', color: '#0A0A0A' }}>
            Reviews
          </h2>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#A3A3A3' }}>
            {total} Reviews
          </span>
        </div>

        <div className="grid md:grid-cols-[auto_1fr] gap-10 md:gap-16 pb-12 border-b border-[#EFEFEF]">
          <div className="flex flex-col items-start gap-3">
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 'clamp(3rem, 8vw, 4.5rem)', lineHeight: 1, color: '#0A0A0A' }}>
              {average.toFixed(1)}
            </span>
            <StarRow rating={Math.round(average)} size={14} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#A3A3A3' }}>
              out of 5
            </span>
          </div>

          <div className="flex flex-col gap-3 justify-center">
            {breakdown.map(({ stars, count }) => (
              <RatingBar key={stars} stars={stars} count={count} total={total} />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-8">
          <div className="flex flex-wrap gap-2">
            {[null, 5, 4, 3, 2, 1].map((val) => {
              const active = filter === val;
              return (
                <button
                  key={val ?? 'all'}
                  onClick={() => setFilter(val)}
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', padding: '0.45rem 1rem', border: `1px solid ${active ? '#0A0A0A' : '#E5E5E5'}`, background: active ? '#0A0A0A' : 'transparent', color: active ? '#FFFFFF' : '#737373', transition: 'all 0.2s ease' }}
                >
                  {val === null ? 'All' : `${val} ★`}
                </button>
              );
            })}
          </div>
          
          <button onClick={() => setShowForm(!showForm)} className="bg-[#0A0A0A] text-white px-6 py-3 font-sans text-[10px] tracking-[0.2em] uppercase hover:bg-[#8b0026] transition-colors">
            Write a Review
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-12 p-8 bg-[#F9F9F9] border border-[#EFEFEF]">
            <h3 className="font-display text-xl mb-4 text-[#0A0A0A]">Share your experience</h3>
            <div className="mb-6">
              <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#737373] mb-2">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button type="button" key={s} onClick={() => setRating(s)}>
                    <Star size={24} className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-[#D4D4D4]'} />
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block font-sans text-[10px] tracking-[0.2em] uppercase text-[#737373] mb-2">Review</label>
              <textarea 
                value={reviewText}
                onChange={e => setReviewText(e.target.value)}
                required
                rows={4}
                className="w-full bg-white border border-[#EFEFEF] p-4 text-sm font-sans outline-none focus:border-[#0A0A0A]"
                placeholder="What did you like or dislike?"
              />
            </div>
            <button type="submit" disabled={submitting} className="bg-[#0A0A0A] text-white px-8 py-4 font-sans text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#8b0026] transition-colors">
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        )}

        <div>
          {displayed.length > 0 ? (
            displayed.map((r) => <ReviewCard key={r._id || r.id} review={r} />)
          ) : (
            <div className="flex flex-col items-center gap-4 py-16">
              <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, transparent, #D4D4D4, transparent)' }} />
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: '1.1rem', letterSpacing: '0.06em', color: '#A3A3A3' }}>
                No reviews yet
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
