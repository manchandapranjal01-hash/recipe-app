import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function RecipeDetailText() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [recipe, setRecipe] = useState(null);
  const [reviewsData, setReviewsData] = useState({ reviews: [], avg_rating: null, total_reviews: 0 });
  const [loading, setLoading] = useState(true);

  // For replies
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');

  // For bookmarks
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmark = async () => {
    try {
      if (isBookmarked) {
        await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/${id}/bookmark`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setIsBookmarked(false);
      } else {
        await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/${id}/bookmark`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setIsBookmarked(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [recRes, revRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/recipes/${id}`),
          fetch(`${import.meta.env.VITE_API_URL}/api/reviews/recipe/${id}`)
        ]);
        if (recRes.ok) setRecipe(await recRes.json());
        if (revRes.ok) setReviewsData(await revRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const handlePostReply = async (reviewId) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/${reviewId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ comment: replyText })
      });
      if (res.ok) {
        alert('Reply posted!');
        // Ideally reload just reviews, but for simplicity reloading whole page data or updating state manually
        const updatedReviewsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/reviews/recipe/${id}`);
        if (updatedReviewsRes.ok) setReviewsData(await updatedReviewsRes.json());
        setActiveReplyId(null);
        setReplyText('');
      } else {
        alert('Please log in to reply.');
      }
    } catch (e) {
      console.error(e);
      alert('Error posting reply');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen bg-[#0e0e0e] text-[#91f78e] font-bold text-xl">Loading culinary magic...</div>;
  if (!recipe) return <div className="flex items-center justify-center h-screen bg-[#0e0e0e] text-red-500 font-bold text-xl">Recipe not found.</div>;

  let nutrition = {};
  if (recipe.nutrition_info) {
    try { nutrition = typeof recipe.nutrition_info === 'string' ? JSON.parse(recipe.nutrition_info) : recipe.nutrition_info; } catch (e) { }
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] pb-24">
      {/* Header Hero */}
      <div className="relative h-[50vh] w-full bg-[#1a1a1a]">
        {recipe.image_url ? (
          <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover opacity-60" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-8xl text-gray-600">restaurant</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent"></div>
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 w-12 h-12 bg-black/40 backdrop-blur-md border border-[#ffffff0a] rounded-full flex items-center justify-center text-white hover:bg-black/60 transition shadow-lg z-10">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 max-w-4xl mx-auto">
          <span className="px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider bg-[#91f78e] text-black mb-4 inline-block">{recipe.category}</span>
          <h1 className="text-4xl md:text-6xl font-black text-white font-['Plus_Jakarta_Sans'] leading-tight drop-shadow-lg">{recipe.title}</h1>
            <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-6 mt-6 w-full">
              {/* Left Group: Chef & Bookmark */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                {/* Chef Info */}
                <div className="flex items-center gap-2">
                  <div className="flex w-10 h-10 rounded-full border-2 border-[#ffffff0a] overflow-hidden bg-gray-800 flex-shrink-0">
                    <span className="flex material-symbols-outlined text-gray-400 w-full h-full flex items-center justify-center">person</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white text-sm font-bold truncate max-w-[100px] sm:max-w-none">
                      {recipe.author_name || 'Chef'}
                    </span>
                    <span className="text-gray-400 text-[10px] sm:text-xs">
                      Origin: {recipe.cultural_origin || 'Unknown'}
                    </span>
                  </div>
                </div>

                {/* Bookmark Button */}
                <button 
                  onClick={handleBookmark} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all flex-shrink-0 ${
                    isBookmarked 
                      ? 'bg-[#ff9800]/20 text-[#ff9800] border-[#ff9800]/50' 
                      : 'bg-[#1a1a1a]/60 backdrop-blur text-white border-[#ffffff0a] hover:bg-[#2a2a2a]'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${isBookmarked ? 'font-black' : ''}`}>
                    bookmark
                  </span>
                  <span className="font-bold text-sm">{isBookmarked ? 'Saved' : 'Bookmark'}</span>
                </button>
              </div>

              {/* Right Group: Ratings (Auto-shifts below on mobile if no space) */}
              {reviewsData.avg_rating && (
                <div className="flex items-center gap-2 min-w-fit">
                  <span className="material-symbols-outlined text-[#ff9800]">star</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-white font-bold text-xl leading-none">{reviewsData.avg_rating}</span>
                    <span className="text-gray-400 text-[10px] sm:text-sm leading-none">
                      ({reviewsData.total_reviews} reviews)
                    </span>
                  </div>
                </div>
              )}
            </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-6 mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <p className="text-xl text-gray-300 leading-relaxed font-medium">{recipe.description}</p>

          <div className="flex items-center justify-between p-6 bg-[#1a1a1a] rounded-3xl border border-[#ffffff0a]">
            <div className="text-center flex-1 border-r border-[#ffffff0a]">
              <span className="material-symbols-outlined f-style text-gray-500 mb-2 block text-3xl">schedule</span>
              <p className="text-white font-bold text-lg">{recipe.prep_time}m</p>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Prep</p>
            </div>
            <div className="text-center flex-1 border-r border-[#ffffff0a]">
              <span className="material-symbols-outlined f-style text-orange-500 mb-2 block text-3xl">local_fire_department</span>
              <p className="text-white font-bold text-lg">{recipe.difficulty}</p>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Difficulty</p>
            </div>
            <div className="text-center flex-1">
              <span className="material-symbols-outlined f-style text-blue-500 mb-2 block text-3xl">restaurant_menu</span>
              <p className="text-white font-bold text-lg">{recipe.servings}</p>
              <p className="text-gray-500 text-xs uppercase tracking-wider font-bold">Servings</p>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-6 font-['Plus_Jakarta_Sans'] flex items-center gap-3">
              <span className="material-symbols-outlined text-[#91f78e]">menu_book</span> Instructions
            </h3>
            <div className="space-y-6">
              {recipe.instructions?.split('\\n').map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#1a1a1a] text-[#91f78e] font-bold flex items-center justify-center shrink-0 border border-[#ffffff0a] shadow-inner">{i + 1}</div>
                  <p className="text-gray-300 leading-relaxed pt-1">{step.replace(/^Step \d+:\s*/, '')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="pt-8 border-t border-[#ffffff0a]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-white font-['Plus_Jakarta_Sans']">Reviews ({reviewsData.total_reviews})</h3>
              <button onClick={() => navigate(`/givereview/${recipe.id}`)} className="bg-[#91f78e] text-black px-5 py-2.5 rounded-xl font-bold hover:bg-[#7ce279] transition flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">rate_review</span>
                Write Review
              </button>
            </div>

            <div className="space-y-6">
              {reviewsData.reviews.length === 0 ? (
                <p className="text-gray-500 italic bg-[#1a1a1a] p-6 rounded-2xl border border-[#ffffff0a] text-center">Be the first to review this recipe!</p>
              ) : (
                reviewsData.reviews.map(rev => (
                  <div key={rev.id} className="bg-[#1a1a1a] p-6 rounded-3xl border border-[#ffffff0a] shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#2a2a2a] overflow-hidden">
                          {rev.profile_image ? (
                            <img src={rev.profile_image} className="w-full h-full object-cover" alt="User" />
                          ) : (
                            <span className="material-symbols-outlined text-gray-500 w-full h-full flex items-center justify-center">person</span>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-bold">{rev.name}</p>
                          <p className="text-gray-500 text-xs">{new Date(rev.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-[#2a2a2a] px-2 py-1 rounded-lg">
                        <span className="material-symbols-outlined text-[#ff9800] text-[16px]">star</span>
                        <span className="text-white font-bold text-sm">{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed mb-4">{rev.comment}</p>

                    {/* Replies */}
                    <div className="ml-8 border-l-2 border-[#ffffff0a] pl-4 space-y-4">
                      {rev.replies?.map(reply => (
                        <div key={reply.id} className="flex gap-3 mt-4">
                          <div className="w-8 h-8 rounded-full bg-[#2a2a2a] overflow-hidden shrink-0 mt-1">
                            {reply.profile_image ? (
                              <img src={reply.profile_image} className="w-full h-full object-cover" alt="User" />
                            ) : (
                              <span className="material-symbols-outlined text-gray-500 w-full h-full flex items-center justify-center text-[18px]">person</span>
                            )}
                          </div>
                          <div className="flex-1 bg-[#2a2a2a] p-4 rounded-2xl rounded-tl-none border border-[#ffffff0a]">
                            <div className="flex items-baseline justify-between mb-1">
                              <p className="text-white font-bold text-sm">{reply.name}</p>
                              <p className="text-gray-500 text-xs">{new Date(reply.created_at).toLocaleDateString()}</p>
                            </div>
                            <p className="text-gray-300 text-sm">{reply.comment}</p>
                          </div>
                        </div>
                      ))}

                      {/* Reply Input */}
                      {activeReplyId === rev.id ? (
                        <div className="flex gap-2 mt-4 ml-1">
                          <input value={replyText} onChange={e => setReplyText(e.target.value)} type="text" placeholder="Write a reply..." className="flex-1 bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-[#91f78e]" />
                          <button onClick={() => handlePostReply(rev.id)} className="bg-[#91f78e] text-black px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[16px]">send</span> Reply
                          </button>
                          <button onClick={() => setActiveReplyId(null)} className="text-gray-500 px-3 hover:text-white transition">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => { setActiveReplyId(rev.id); setReplyText(''); }} className="text-gray-400 text-sm font-bold flex items-center gap-1 hover:text-[#91f78e] transition-colors mt-2 ml-1">
                          <span className="material-symbols-outlined text-[16px]">reply</span> Reply to this review
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar (Ingredients & Nutrition) */}
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-[#ffffff0a] shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-500 text-[22px]">shopping_cart</span> Ingredients
            </h3>
            {recipe.ingredients && recipe.ingredients.length > 0 ? (
              <ul className="space-y-4">
                {recipe.ingredients.map(ing => (
                  <li key={ing.id} className="flex items-center justify-between pb-3 border-b border-[#ffffff0a] last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#91f78e]"></div>
                      <span className="text-gray-300 font-medium">{ing.name}</span>
                    </div>
                    <span className="text-gray-500 font-bold text-sm bg-[#2a2a2a] px-2.5 py-1 rounded-md border border-[#ffffff0a]">{ing.quantity} {ing.unit}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic">Ingredients list not available.</p>
            )}

            <button onClick={() => navigate('/groceryfinder')} className="w-full mt-8 bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors shadow-lg">
              <span className="material-symbols-outlined text-[#ff9800]">store</span>
              Find in Stores
            </button>
          </div>

          {nutrition && Object.keys(nutrition).length > 0 && (
            <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-[#ffffff0a] shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500 text-[22px]">monitor_weight</span> Nutrition
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#2a2a2a] p-3 rounded-xl border border-[#ffffff0a]">
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Calories</p>
                  <p className="text-white font-black text-lg">{nutrition.calories || '-'}</p>
                </div>
                <div className="bg-[#2a2a2a] p-3 rounded-xl border border-[#ffffff0a]">
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Protein</p>
                  <p className="text-white font-black text-lg">{nutrition.protein || '-'}</p>
                </div>
                <div className="bg-[#2a2a2a] p-3 rounded-xl border border-[#ffffff0a]">
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Carbs</p>
                  <p className="text-white font-black text-lg">{nutrition.carbs || '-'}</p>
                </div>
                <div className="bg-[#2a2a2a] p-3 rounded-xl border border-[#ffffff0a]">
                  <p className="text-gray-500 text-[10px] uppercase font-bold tracking-wider mb-1">Fats</p>
                  <p className="text-white font-black text-lg">{nutrition.fats || '-'}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
