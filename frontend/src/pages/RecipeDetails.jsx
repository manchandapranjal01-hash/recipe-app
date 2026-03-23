import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-on';
import { 
  ArrowLeft, 
  Clock, 
  ShoppingCart, 
  Minus, 
  Plus, 
  Bookmark, 
  Star, 
  User, 
  Flame, 
  Utensils 
} from 'lucide-react';

export default function RecipeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [servings, setServings] = useState(4);
    const [isCookingMode, setIsCookingMode] = useState(false);

    // Mock data updated to match the screenshot content
    const recipe = {
        title: 'Butter Chicken',
        author: 'Admin Chef',
        origin: 'North Indian',
        rating: 4.5,
        reviews: 2,
        description: 'Creamy, rich tomato-based curry with tender chicken pieces. A North Indian classic loved worldwide.',
        image: 'https://images.unsplash.com/photo-1603894584113-f962643bc92f?auto=format&fit=crop&q=80&w=1200',
        prepTime: 45,
        difficulty: 'Medium',
        baseServings: 4,
        ingredients: [
            { name: 'Chicken Breast/Thighs', amount: 500, unit: 'g' },
            { name: 'Greek Yogurt', amount: 1, unit: 'cup' },
            { name: 'Tomato Puree', amount: 2, unit: 'cups' },
            { name: 'Butter', amount: 50, unit: 'g' },
            { name: 'Garam Masala', amount: 1, unit: 'tbsp' },
        ],
        instructions: [
            "Marinate chicken with yogurt, turmeric, red chili, and salt for 30 minutes.",
            "Step 2: Heat butter in a pan, add onions and sauté until translucent.",
            "Add tomato puree and spices, simmer until the oil separates.",
            "Add the marinated chicken and cook until tender. Finish with a splash of cream."
        ]
    };

    const scaleMultiplier = servings / recipe.baseServings;

    if (isCookingMode) {
        return (
            <div className="fixed inset-0 z-50 bg-surface text-white p-8 overflow-y-auto no-scrollbar flex flex-col items-center">
                <button onClick={() => setIsCookingMode(false)} className="absolute top-8 left-8 p-3 bg-surface-container-high rounded-full hover:bg-surface-container-highest transition-colors">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-4xl font-display mt-8 mb-12 text-center text-primary">{recipe.title}</h1>
                <div className="max-w-2xl w-full space-y-12">
                    {recipe.instructions.map((step, idx) => (
                        <div key={idx} className="flex gap-6 items-start">
                            <span className="text-3xl font-display text-surface-container-highest font-bold">{idx + 1}</span>
                            <p className="text-2xl leading-relaxed text-on-surface">{step}</p>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in -mt-20 pb-20">
            {/* Hero Image */}
            <div className="relative h-80 md:h-[450px] -mx-4 sm:-mx-6 lg:-mx-8">
                <button onClick={() => navigate(-1)} className="absolute top-10 left-6 z-20 p-3 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition-colors">
                    <ArrowLeft size={20} className="text-white" />
                </button>
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 -mt-20 px-4 max-w-3xl mx-auto">
                {/* Badge */}
                <div className="mb-4">
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border border-green-500/30">
                        Non-Veg
                    </span>
                </div>

                <h1 className="text-4xl md:text-5xl font-display font-medium text-white mb-6 leading-tight">
                    {recipe.title}
                </h1>

                {/* --- FIXED SECTION (Red Circle Fix) --- */}
                <div className="flex flex-wrap items-center justify-between gap-y-4 mb-8">
                    {/* Author/Chef Info */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                            <User size={20} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-bold text-sm leading-tight">{recipe.author}</span>
                            <span className="text-outline text-[11px]">Origin: <span className="text-on-surface-variant">{recipe.origin}</span></span>
                        </div>
                    </div>

                    {/* Actions & Rating Container */}
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-container-highest px-4 py-2.5 rounded-xl transition-all border border-white/5 active:scale-95">
                            <Bookmark size={18} className="text-white" />
                            <span className="text-white text-sm font-medium">Bookmark</span>
                        </button>
                        
                        <div className="flex items-center gap-1.5 ml-2">
                            <Star size={18} className="fill-orange-400 text-orange-400" />
                            <span className="text-white font-bold text-lg leading-none">{recipe.rating}</span>
                            <span className="text-outline text-xs mt-0.5">({recipe.reviews})</span>
                        </div>
                    </div>
                </div>
                {/* ------------------------------------- */}

                <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
                    {recipe.description}
                </p>

                {/* Recipe Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-12">
                    <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                        <Clock size={20} className="text-outline mb-2" />
                        <span className="text-white font-bold text-lg">{recipe.prepTime}m</span>
                        <span className="text-[10px] uppercase tracking-wider text-outline">Prep</span>
                    </div>
                    <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                        <Flame size={20} className="text-outline mb-2" />
                        <span className="text-white font-bold text-lg">{recipe.difficulty}</span>
                        <span className="text-[10px] uppercase tracking-wider text-outline">Difficulty</span>
                    </div>
                    <div className="bg-surface-container-low rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                        <Utensils size={20} className="text-outline mb-2" />
                        <span className="text-white font-bold text-lg">{servings}</span>
                        <span className="text-[10px] uppercase tracking-wider text-outline">Servings</span>
                    </div>
                </div>

                {/* Mode Switchers */}
                <div className="flex gap-4 mb-12">
                    <button
                        onClick={() => setIsCookingMode(true)}
                        className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed py-4 rounded-2xl font-bold shadow-lg shadow-primary/10 active:scale-95 transition-transform"
                    >
                        Cooking Mode
                    </button>
                    <button className="flex-1 bg-secondary text-on-secondary py-4 rounded-2xl font-bold flex justify-center items-center gap-2 active:scale-95 transition-transform">
                        <ShoppingCart size={20} />
                        Add to List
                    </button>
                </div>

                {/* Ingredients Section */}
                <section className="mb-12">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-display font-medium text-white">Ingredients</h2>
                        <div className="flex items-center gap-4 bg-surface-container-high rounded-full p-1.5 border border-white/5">
                            <button
                                onClick={() => setServings(s => Math.max(1, s - 1))}
                                className="p-2 bg-surface rounded-full text-white hover:bg-surface-container-highest transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="font-bold text-white w-4 text-center">{servings}</span>
                            <button
                                onClick={() => setServings(s => s + 1)}
                                className="p-2 bg-surface rounded-full text-white hover:bg-surface-container-highest transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                    <ul className="space-y-3">
                        {recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex justify-between items-center p-4 bg-surface-container rounded-2xl border border-white/5">
                                <span className="text-on-surface-variant font-medium">{ing.name}</span>
                                <span className="text-white font-bold">
                                    {(ing.amount * scaleMultiplier).toFixed(2).replace(/\.00$/, '')} {ing.unit}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Instructions Section */}
                <section>
                    <h2 className="text-2xl font-display font-medium text-white mb-6">Instructions</h2>
                    <div className="space-y-8">
                        {recipe.instructions.map((step, idx) => (
                            <div key={idx} className="flex gap-5">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/30">
                                    {idx + 1}
                                </div>
                                <p className="text-on-surface-variant leading-relaxed text-lg pt-0.5">{step}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}