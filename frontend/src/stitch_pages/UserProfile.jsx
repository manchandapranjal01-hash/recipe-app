import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserProfile() {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [myRecipes, setMyRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [ingredientRequests, setIngredientRequests] = useState([]);
  const [showPantryModal, setShowPantryModal] = useState(false);
  const [newIngredient, setNewIngredient] = useState({ name: '', category: 'Vegetables', unit: 'g' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch User's Recipes
        const resRecipes = await fetch('http://localhost:5000/api/recipes/my-recipes', { headers });
        if (resRecipes.ok) setMyRecipes(await resRecipes.json());

        // Fetch Saved Recipes
        const resSaved = await fetch('http://localhost:5000/api/recipes/my-bookmarks', { headers });
        if (resSaved.ok) setSavedRecipes(await resSaved.json());

        // Fetch Ingredient Requests
        const resReqs = await fetch('http://localhost:5000/api/ingredients/my-requests', { headers });
        if (resReqs.ok) setIngredientRequests(await resReqs.json());

      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchData();
  }, [token]);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  const handleRequestIngredient = async (e) => {
    e.preventDefault();
    if (!newIngredient.name.trim()) return;
    try {
      const res = await fetch('http://localhost:5000/api/ingredients/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(newIngredient)
      });
      if (res.ok) {
        setShowPantryModal(false);
        setNewIngredient({ name: '', category: 'Vegetables', unit: 'g' });
        // Refetch requests
        const resReqs = await fetch('http://localhost:5000/api/ingredients/my-requests', { headers: { Authorization: `Bearer ${token}` } });
        if (resReqs.ok) setIngredientRequests(await resReqs.json());
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e0e] pb-24">
      <main className="w-full max-w-4xl mx-auto px-4 md:px-6 pt-10 flex-1">
        <div className="relative bg-[#1a1a1a] rounded-[2.5rem] border border-[#ffffff0a] p-8 md:p-12 text-center mb-8 overflow-hidden shadow-2xl">
          {/* Banner effect */}
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-[#91f78e]/20 to-[#4c9f50]/5"></div>

          <div className="relative z-10">
            <div className="w-32 h-32 mx-auto rounded-full border-4 border-[#1a1a1a] bg-[#2a2a2a] overflow-hidden shadow-2xl mb-6 flex items-center justify-center shrink-0">
              {user.profile_image ? (
                <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-gray-500 text-[64px]">person</span>
              )}
            </div>
            <h2 className="text-3xl font-black font-['Plus_Jakarta_Sans'] text-white mb-2">{user.name}</h2>
            <p className="text-gray-400 font-medium">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-start">
          <div onClick={() => setShowPantryModal(true)} className="bg-[#1a1a1a] rounded-[2rem] p-6 md:p-8 border border-[#ffffff0a] flex flex-col items-center justify-center text-center hover:bg-[#2a2a2a] transition-colors cursor-pointer group h-full">
            <span className="material-symbols-outlined text-4xl text-[#91f78e] mb-4 group-hover:scale-110 transition-transform">add_circle</span>
            <h3 className="text-lg font-bold text-white mb-1">Request Ingredient</h3>
            <p className="text-gray-500 text-sm">Add custom ingredients to the database</p>
          </div>

          <div className="bg-[#1a1a1a] rounded-[2rem] p-6 border border-[#ffffff0a] flex flex-col max-h-[350px]">
            <div className="flex items-center gap-3 mb-4 shrink-0">
              <div className="w-10 h-10 bg-[#ff9800]/10 rounded-xl flex items-center justify-center text-[#ff9800] material-symbols-outlined shrink-0">bookmark</div>
              <h3 className="text-lg font-bold text-white">Saved Recipes</h3>
            </div>
            <div className="overflow-y-auto custom-scrollbar flex-1 pr-2">
              {savedRecipes.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {savedRecipes.map((recipe) => (
                    <div key={recipe.id} onClick={() => navigate(`/recipe/${recipe.id}`)} className="bg-[#2a2a2a]/50 p-3 rounded-xl border border-[#ffffff0a] flex items-center justify-between cursor-pointer hover:bg-[#333] transition-colors shrink-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] overflow-hidden shrink-0">
                          {recipe.image_url ? (
                            <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined text-gray-500 w-full h-full flex items-center justify-center text-sm">restaurant</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-200 font-bold text-sm truncate max-w-[100px] sm:max-w-[150px]">{recipe.title}</span>
                          <span className="text-gray-500 text-[10px]">{recipe.category}</span>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-6 mt-2">
                  <span className="material-symbols-outlined text-[#333] text-4xl mb-2">bookmark_border</span>
                  <p className="text-gray-500 text-sm italic">You haven't bookmarked any recipes.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx="true">{`
            .custom-scrollbar::-webkit-scrollbar { width: 4px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #333; border-radius: 20px; }
        `}</style>

        {/* Modal for Requesting Ingredient */}
        {showPantryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] rounded-[2rem] border border-[#ffffff0a] p-8 w-full max-w-md shadow-2xl relative">
              <button onClick={() => setShowPantryModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
              <h2 className="text-2xl font-bold text-white mb-6">Request Ingredient</h2>
              <form onSubmit={handleRequestIngredient} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-xs w-full uppercase tracking-wider mb-2">Ingredient Name</label>
                  <input type="text" required value={newIngredient.name} onChange={e => setNewIngredient({ ...newIngredient, name: e.target.value })} className="w-full bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#91f78e]" placeholder="e.g., Saffron" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Category</label>
                  <select value={newIngredient.category} onChange={e => setNewIngredient({ ...newIngredient, category: e.target.value })} className="w-full bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#91f78e]">
                    {['Vegetables', 'Fruits', 'Dairy', 'Meat', 'Grains', 'Spices', 'Oils', 'Other'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Unit</label>
                  <input type="text" required value={newIngredient.unit} onChange={e => setNewIngredient({ ...newIngredient, unit: e.target.value })} className="w-full bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#91f78e]" placeholder="e.g., g, tsp, pieces" />
                </div>
                <button type="submit" className="w-full bg-[#91f78e] text-[#0e0e0e] font-bold py-4 rounded-xl mt-4 hover:bg-[#7ce279] transition-all">Submit Request</button>
              </form>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">

          {/* Ingredient Requests Status */}
          <div className="bg-[#1a1a1a] rounded-[2rem] p-6 md:p-8 border border-[#ffffff0a]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 material-symbols-outlined text-2xl shrink-0">inventory_2</div>
              <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-white">Ingredient Requests</h3>
            </div>
            {ingredientRequests.length > 0 ? (
              <div className="space-y-3">
                {ingredientRequests.map(req => (
                  <div key={req.id} className="bg-[#2a2a2a]/50 p-4 rounded-xl border border-[#ffffff0a] flex items-center justify-between">
                    <div>
                      <span className="text-white font-bold block">{req.name}</span>
                      <span className="text-gray-500 text-xs">{req.category} • {req.unit}</span>
                    </div>
                    {req.is_approved ? (
                      <span className="px-3 py-1 bg-green-500/20 text-green-500 text-xs font-bold rounded-lg border border-green-500/20">Approved</span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-lg border border-yellow-500/20">Pending</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">You haven't requested any custom ingredients.</p>
            )}
          </div>



          <div className="bg-[#1a1a1a] rounded-[2rem] p-6 md:p-8 border border-[#ffffff0a]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 material-symbols-outlined text-2xl shrink-0">restaurant_menu</div>
              <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-white">Dietary Preferences</h3>
            </div>
            {user.dietary_preferences && user.dietary_preferences.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {JSON.parse(user.dietary_preferences).map((pref, i) => (
                  <span key={i} className="px-3 py-1 bg-[#2a2a2a] border border-[#ffffff0a] text-gray-300 rounded-full text-sm font-medium">{pref}</span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No dietary preferences set.</p>
            )}
          </div>

          {/* My Recipes Section */}
          <div className="bg-[#1a1a1a] rounded-[2rem] p-6 md:p-8 border border-[#ffffff0a]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#91f78e]/10 rounded-2xl flex items-center justify-center text-[#91f78e] material-symbols-outlined text-2xl shrink-0">book</div>
              <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-white">My Submitted Recipes</h3>
            </div>
            {myRecipes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myRecipes.map((recipe) => (
                  <div key={recipe.id} className="bg-[#2a2a2a]/50 p-4 rounded-2xl border border-[#ffffff0a] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-gray-200 font-bold truncate max-w-[150px]">{recipe.title}</span>
                      <span className="text-gray-500 text-xs">{new Date(recipe.created_at).toLocaleDateString()}</span>
                    </div>
                    {recipe.status === 'pending' && <span className="px-3 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-lg whitespace-nowrap border border-yellow-500/20">Pending</span>}
                    {recipe.status === 'approved' && <span className="px-3 py-1 bg-green-500/20 text-green-500 text-xs font-bold rounded-lg whitespace-nowrap border border-green-500/20">Approved</span>}
                    {recipe.status === 'rejected' && <span className="px-3 py-1 bg-red-500/20 text-red-500 text-xs font-bold rounded-lg whitespace-nowrap border border-red-500/20">Rejected</span>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">You haven't submitted any recipes yet.</p>
            )}
          </div>

          <div className="bg-[#1a1a1a] rounded-[2rem] p-6 md:p-8 border border-[#ffffff0a]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 material-symbols-outlined text-2xl shrink-0">logout</div>
              <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-white">Account Actions</h3>
            </div>
            <button onClick={handleSignOut} className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors font-bold border border-red-500/10 outline-none flex items-center justify-center gap-2">
              Sign Out
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
