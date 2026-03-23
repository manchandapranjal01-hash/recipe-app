import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ShoppingCart, Minus, Plus } from 'lucide-react';

export default function RecipeDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [servings, setServings] = useState(2);
    const [isCookingMode, setIsCookingMode] = useState(false);

    // Mock data
    const recipe = {
        title: 'Charred Broccolini & Garlic Pasta',
        image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=1200',
        prepTime: 10,
        cookTime: 15,
        baseServings: 2,
        ingredients: [
            { name: 'Broccolini, trimmed', amount: 1, unit: 'bunch' },
            { name: 'Orecchiette Pasta', amount: 8, unit: 'oz' },
            { name: 'Garlic cloves, sliced', amount: 4, unit: 'cloves' },
            { name: 'Olive Oil', amount: 0.25, unit: 'cup' },
        ],
        instructions: [
            "Bring a large pot of salted water to a boil. Add the pasta and cook according to package directions.",
            "Meanwhile, heat the olive oil in a large skillet over medium-high heat. Add the broccolini and cook until deeply charred, about 5 minutes.",
            "Reduce heat to medium. Add the garlic and red pepper flakes, cooking for 1 minute until fragrant.",
            "Toss the drained pasta into the skillet, adding a splash of pasta water to create a glossy sauce."
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
        <div className="animate-fade-in -mt-20">
            {/* Hero Image */}
            <div className="relative h-80 md:h-[400px] -mx-4 sm:-mx-6 lg:-mx-8">
                <button onClick={() => navigate(-1)} className="absolute top-6 left-6 z-20 p-3 glass rounded-full hover:bg-white/10 transition-colors">
                    <ArrowLeft size={20} className="text-white" />
                </button>
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 -mt-16">
                <div className="flex gap-2 mb-4">
                    <span className="bg-surface-container-highest/80 backdrop-blur-md text-tertiary px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
                        {recipe.prepTime + recipe.cookTime} Mins
                    </span>
                </div>
                <h1 className="text-4xl md:text-5xl font-display font-medium text-white mb-6 leading-tight">
                    {recipe.title}
                </h1>

                <div className="flex gap-4 mb-10">
                    <button
                        onClick={() => setIsCookingMode(true)}
                        className="flex-1 bg-gradient-to-r from-primary to-primary-container text-on-primary-fixed py-4 rounded-xl font-semibold shadow-[0_0_24px_rgba(145,247,142,0.15)] flex justify-center items-center gap-2 active:scale-95 transition-transform"
                    >
                        Cooking Mode
                    </button>
                    <button className="flex-1 bg-secondary text-on-secondary py-4 rounded-xl font-semibold flex justify-center items-center gap-2 active:scale-95 transition-transform">
                        <ShoppingCart size={20} />
                        Add to List
                    </button>
                </div>

                {/* Ingredients & Scaler */}
                <section className="mb-12">
                    <div className="flex justify-between items-end mb-6">
                        <h2 className="text-2xl font-display font-medium text-white">Ingredients</h2>
                        <div className="flex items-center gap-4 bg-surface-container-high rounded-full p-1">
                            <button
                                onClick={() => setServings(s => Math.max(1, s - 1))}
                                className="p-2 bg-surface rounded-full text-outline-variant hover:text-white transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="font-semibold text-white w-4 text-center">{servings}</span>
                            <button
                                onClick={() => setServings(s => s + 1)}
                                className="p-2 bg-surface rounded-full text-outline-variant hover:text-white transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>
                    <ul className="space-y-4">
                        {recipe.ingredients.map((ing, idx) => (
                            <li key={idx} className="flex justify-between items-center p-4 bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors">
                                <span className="text-on-surface-variant font-medium">{ing.name}</span>
                                <span className="text-white">
                                    {(ing.amount * scaleMultiplier).toFixed(2).replace(/\.00$/, '')} {ing.unit}
                                </span>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Instructions */}
                <section>
                    <h2 className="text-2xl font-display font-medium text-white mb-6">Instructions</h2>
                    <div className="space-y-6">
                        {recipe.instructions.map((step, idx) => (
                            <div key={idx} className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold text-sm">
                                    {idx + 1}
                                </div>
                                <p className="text-on-surface-variant leading-relaxed pt-1">{step}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
