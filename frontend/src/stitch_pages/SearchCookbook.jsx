import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchCookbook() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All Recipes');
  const navigate = useNavigate();

  const filters = ['All Recipes', 'Vegetarian', 'Non-Veg', 'Snacks', 'Dessert', 'Drinks'];

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes`);
        if (res.ok) {
          const data = await res.json();
          setRecipes(Array.isArray(data) ? data : []);
        }
      } catch (e) {
        console.error("Failed to load recipes", e);
      }
    };
    fetchRecipes();
  }, []);

  const filtered = recipes.filter(r => {
    const matchesSearch = r.title?.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'All Recipes' || r.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e0e]">
      <header className="bg-[#0e0e0e]/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 border-b border-[#ffffff0a] flex items-center justify-between">
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-2xl text-white">Cookbook</h1>
        <div onClick={() => navigate('/userprofile')} className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#91f78e]/50 cursor-pointer hover:border-[#91f78e] transition-colors">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-YbN-R_rGZgZIw4f6VJKcO9QEZzZUMnFy-ZTwbJeGnAngo3ELxolnJiln7ch_mIKbN70bkhGrmERiLZZdpKzidKeW5O_U3h8yGxNF-rWzkHL98CVepccrOGC2QcIwYz-vmt9Ef96a3f08T5RzxWK3ZVtFH6nFZw3tohqnG6cSWWujiTBVt-pX_KZ1xLeLQmqa9LDi3Yg2B9um2vkgzwH2d7pEgzB89KL9iXvttLgps5lcNYB-rmqViLqtTsk7SkwoXgwEKkW3c-De" className="w-full h-full object-cover" />
        </div>
      </header>

      <main className="flex-1 px-4 md:px-6 pt-6 pb-24 max-w-4xl mx-auto w-full">
        {/* Search */}
        <div className="relative group mb-6">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-[#91f78e]">search</span>
          </div>
          <input
            className="w-full bg-[#1a1a1a] border border-[#ffffff0a] rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#91f78e]/50 focus:ring-4 focus:ring-[#91f78e]/10 transition-all shadow-lg"
            placeholder="Search recipes, ingredients, cuisines..."
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`snap-center whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${activeFilter === f
                  ? 'bg-[#91f78e] text-[#0e0e0e] border-[#91f78e] shadow-[0_4px_15px_rgba(145,247,142,0.3)]'
                  : 'bg-[#1a1a1a] text-gray-400 border-[#ffffff0a] hover:bg-[#2a2a2a] hover:text-gray-200'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-6 mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">
            {search ? 'Search Results' : 'Popular Recipes'}
          </h2>
          <span className="text-gray-500 text-sm font-medium">{filtered.length} found</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {filtered.map(recipe => (
            <div key={recipe.id} onClick={() => navigate(`/recipe/${recipe.id}`)} className="bg-[#1a1a1a] rounded-3xl overflow-hidden group cursor-pointer border border-[#ffffff0a] hover:border-[#91f78e]/30 transition-all transform hover:-translate-y-1 shadow-lg relative flex flex-col">
              <div className="relative h-56 w-full overflow-hidden shrink-0">
                {recipe.image_url ? (
                  <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-gray-500">restaurant</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/50 to-transparent opacity-90" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md mb-2 inline-block ${recipe.category === 'Vegetarian' ? 'bg-green-500/20 text-green-400' : recipe.category === 'Non-Veg' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {recipe.category || 'General'}
                  </span>
                  <h4 className="text-2xl font-black text-white leading-tight drop-shadow-md">{recipe.title}</h4>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-gray-400 text-sm line-clamp-2 mb-4 leading-relaxed">{recipe.description}</p>
                <div className="flex items-center gap-4 text-gray-400 text-sm font-bold border-t border-[#ffffff0a] pt-4 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px] text-yellow-500">schedule</span>
                    </div>
                    {recipe.prep_time || '30'}m
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-orange-500/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px] text-orange-500">local_fire_department</span>
                    </div>
                    {recipe.difficulty || 'Easy'}
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto text-[#91f78e]">
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-[#1a1a1a] rounded-3xl border border-[#ffffff0a] mt-8">
            <div className="w-20 h-20 bg-[#2a2a2a] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#ffffff0a]">
              <span className="material-symbols-outlined text-4xl text-gray-500">search_off</span>
            </div>
            <p className="text-gray-200 font-bold text-xl mb-2">No recipes found</p>
            <p className="text-gray-500 text-sm max-w-xs mx-auto">We couldn't find anything matching "{search}". Try adjusting your filters or search terms.</p>
          </div>
        )}
      </main>
    </div>
  );
}
