import React, { useState } from 'react';
import RecipeCard from '../components/RecipeCard';
import { ChefHat, Sparkles } from 'lucide-react';

export default function Home() {
    const [fridgeInput, setFridgeInput] = useState('');

    // Placeholder mock data
    const recommendedRecipes = [
        { id: 1, title: 'Charred Broccolini & Garlic Pasta', time: 25, tags: ['Vegan', 'Quick'], image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=800' },
        { id: 2, title: 'Crispy Skin Salmon Bowl', time: 35, tags: ['High Protein', 'Keto'], image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=800' },
    ];

    return (
        <div className="space-y-12 animate-fade-in relative">
            <header className="pt-8">
                <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-4">
                    What are we <br /><span className="text-primary italic font-serif">cooking</span> today?
                </h1>
                <p className="text-on-surface-variant text-lg">Curated recipes based on your taste.</p>
            </header>

            {/* AI Inspiration Section */}
            <section className="bg-surface-container rounded-xl p-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary opacity-5 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Sparkles className="text-tertiary" size={24} />
                        <h2 className="text-xl font-display font-medium text-white">What's in your fridge?</h2>
                    </div>
                    <div className="flex gap-4 items-center">
                        <input
                            type="text"
                            placeholder="e.g. chicken, spinach, lemon..."
                            value={fridgeInput}
                            onChange={(e) => setFridgeInput(e.target.value)}
                            className="w-full bg-surface-container-low text-white placeholder:text-outline p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all shadow-inner"
                        />
                        <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed p-4 rounded-xl font-semibold shadow-[0_0_24px_rgba(145,247,142,0.15)] flex-shrink-0 transition-transform active:scale-95">
                            Inspire Me
                        </button>
                    </div>
                </div>
            </section>

            {/* Curated Recommendations */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-display font-medium">Curated for You</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {recommendedRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} {...recipe} />
                    ))}
                </div>
            </section>
        </div>
    );
}
