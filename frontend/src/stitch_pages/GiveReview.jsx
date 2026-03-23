import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function GiveReview() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ recipe_id: recipeId, rating, comment })
      });

      if (res.ok) {
        navigate(`/recipe/${recipeId}`);
      } else {
        alert("Failed to submit review. Are you logged in?");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while submitting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e0e]">
      <header className="bg-[#0e0e0e]/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 border-b border-[#ffffff0a] flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-white hover:bg-[#1a1a1a] p-2 rounded-full transition-colors material-symbols-outlined">arrow_back</button>
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-2xl text-white">Write a Review</h1>
      </header>

      <main className="flex-1 px-4 md:px-6 pt-10 pb-32 max-w-2xl mx-auto w-full">
        <div className="bg-[#1a1a1a] rounded-3xl p-8 border border-[#ffffff0a] shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-white font-['Plus_Jakarta_Sans'] mb-2">How was it?</h2>
            <p className="text-gray-400">Share your experience to help other cooks.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex flex-col items-center">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="bg-transparent border-none outline-none focus:outline-none transition-transform hover:scale-110 p-1"
                  >
                    <span className={`material-symbols-outlined text-4xl transition-colors ${star <= (hoverRating || rating) ? 'text-[#ff9800] fill-current text-shadow-[0_0_15px_rgba(255,152,0,0.5)]' : 'text-gray-600'
                      }`} style={{ fontVariationSettings: `'FILL' ${star <= (hoverRating || rating) ? 1 : 0}` }}>
                      star
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 font-bold text-[#ff9800] text-sm uppercase tracking-widest min-h-[20px]">
                {rating === 1 && 'Not Good'}
                {rating === 2 && 'Could be better'}
                {rating === 3 && 'It was okay'}
                {rating === 4 && 'Really Tasty'}
                {rating === 5 && 'Absolutely Delicious!'}
              </p>
            </div>

            <div>
              <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Your Review</label>
              <textarea
                required
                rows="6"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#91f78e] resize-none"
                placeholder="What did you like or dislike? Did you make any changes?..."
              />
            </div>

            <button
              type="submit"
              disabled={loading || rating === 0 || !comment.trim()}
              className="w-full bg-[#91f78e] hover:bg-[#7ce279] text-[#0e0e0e] text-lg font-black py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(145,247,142,0.2)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Submitting...' : 'Post Review'}
              {!loading && <span className="material-symbols-outlined">send</span>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
