import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKitchen } from '../context/KitchenContext';

export default function DiscoverRecommend() {
    const { pantry, addToPantry, removeFromPantry } = useKitchen();
    const [ingredients, setIngredients] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Map pantry to an array of ingredient IDs for the backend
    const pantryIds = pantry.map(item => item.id);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/ingredients`);
                const data = await res.json();
                setIngredients(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load ingredients", err);
            }
        };
        fetchIngredients();
    }, []);

    // Get suggestions automatically when pantry changes
    useEffect(() => {
        if (pantryIds.length > 0) {
            getSuggestions(pantryIds);
        } else {
            // Load default if empty initially
            getSuggestions([]);
        }
    }, [pantryIds.join(',')]);

    const toggleIngredient = (ing) => {
        const inPantry = pantry.some(i => i.id === ing.id);
        if (inPantry) {
            removeFromPantry(ing.id);
        } else {
            addToPantry({ id: ing.id, name: ing.name, quantity: 1, unit: ing.unit || 'unit' });
        }
    };

    const getSuggestions = async (idsToUse = []) => {
        setLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/recommendations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token') || ''}`
                },
                body: JSON.stringify({ selectedIngredients: idsToUse })
            });
            if (res.ok) {
                const data = await res.json();
                setRecommendations(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#0e0e0e]">
            <header className="bg-[#0e0e0e]/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 border-b border-[#ffffff0a] flex items-center justify-between">
                <h1 className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-xl italic text-[#91f78e]">The Edible Editorial</h1>
                <div onClick={() => navigate('/userprofile')} className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#91f78e]/50 cursor-pointer hover:border-[#91f78e] transition-colors">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-YbN-R_rGZgZIw4f6VJKcO9QEZzZUMnFy-ZTwbJeGnAngo3ELxolnJiln7ch_mIKbN70bkhGrmERiLZZdpKzidKeW5O_U3h8yGxNF-rWzkHL98CVepccrOGC2QcIwYz-vmt9Ef96a3f08T5RzxWK3ZVtFH6nFZw3tohqnG6cSWWujiTBVt-pX_KZ1xLeLQmqa9LDi3Yg2B9um2vkgzwH2d7pEgzB89KL9iXvttLgps5lcNYB-rmqViLqtTsk7SkwoXgwEKkW3c-De" className="w-full h-full object-cover" />
                </div>
            </header>

            <main className="flex-1 px-4 md:px-6 pt-6 pb-24 max-w-4xl mx-auto w-full">
                <div className="mb-8 flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-black font-['Plus_Jakarta_Sans'] text-white">What's in your pantry?</h2>
                        <p className="text-gray-400 mt-2 text-sm">Select ingredients you have, and we'll magically find recipes for you.</p>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-3xl p-6 mb-8 border border-[#ffffff0a] shadow-xl">
                    <div className="flex flex-wrap gap-3 mb-6 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                        {ingredients.map(ing => {
                            const isSelected = pantryIds.includes(ing.id);
                            return (
                                <button
                                    key={ing.id}
                                    onClick={() => toggleIngredient(ing)}
                                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border ${isSelected
                                            ? 'bg-[#91f78e]/20 text-[#91f78e] border-[#91f78e]/50 shadow-[0_0_15px_rgba(145,247,142,0.2)]'
                                            : 'bg-[#2a2a2a] text-gray-400 border-transparent hover:bg-[#333] hover:text-gray-200'
                                        }`}
                                >
                                    {ing.name} {isSelected ? '✓' : ''}
                                </button>
                            );
                        })}
                    </div>
                    <button
                        onClick={() => getSuggestions(pantryIds)}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#91f78e] to-[#6bc46a] text-[#0e0e0e] font-black text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(145,247,142,0.3)] hover:shadow-[0_0_30px_rgba(145,247,142,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Finding recipes...' : 'Find Recipes'}
                        {!loading && <span className="material-symbols-outlined">auto_awesome</span>}
                    </button>
                </div>

                <div className="mb-6 flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white font-['Plus_Jakarta_Sans']">Recommended for You</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {recommendations.map(recipe => (
                        <div key={recipe.id} onClick={() => navigate(`/recipe/${recipe.id}`)} className="bg-[#1a1a1a] rounded-3xl overflow-hidden group cursor-pointer border border-[#ffffff0a] hover:border-[#91f78e]/30 transition-all transform hover:-translate-y-1 shadow-lg relative">
                            {recipe.match_count !== undefined && (
                                <div className="absolute top-4 right-4 z-10 bg-[#0e0e0e]/80 backdrop-blur-md border border-[#91f78e] text-[#91f78e] px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    {recipe.match_count} Match{recipe.match_count !== 1 ? 'es' : ''}
                                </div>
                            )}
                            <div className="relative h-48 w-full overflow-hidden">
                                {recipe.image_url ? (
                                    <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full bg-[#2a2a2a] flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-gray-500">restaurant</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent opacity-80" />
                            </div>
                            <div className="p-5">
                                <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider rounded-md mb-3 inline-block ${recipe.category === 'Vegetarian' ? 'bg-green-500/10 text-green-500' : recipe.category === 'Non-Veg' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                    {recipe.category || 'General'}
                                </span>
                                <h4 className="text-xl font-bold text-white mb-2 line-clamp-1">{recipe.title}</h4>
                                <div className="flex items-center gap-4 text-gray-400 text-sm font-medium">
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px] text-yellow-500">schedule</span>
                                        {recipe.prep_time || '30'}m
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px] text-orange-500">local_fire_department</span>
                                        {recipe.difficulty || 'Easy'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {!loading && recommendations.length === 0 && (
                    <div className="text-center py-12 bg-[#1a1a1a] rounded-3xl border border-[#ffffff0a]">
                        <span className="material-symbols-outlined text-6xl text-gray-500 mb-4 block">search_off</span>
                        <p className="text-gray-400 text-lg">No recipes found matching your ingredients.</p>
                        <p className="text-gray-500 text-sm mt-1">Try selecting different ingredients.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
