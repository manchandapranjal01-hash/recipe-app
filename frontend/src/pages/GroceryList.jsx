import React, { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';

export default function GroceryList() {
    const [items, setItems] = useState([
        { id: 1, name: 'Broccolini, trimmed', amount: 1, unit: 'bunch', checked: false },
        { id: 2, name: 'Orecchiette Pasta', amount: 8, unit: 'oz', checked: false },
        { id: 3, name: 'Olive Oil', amount: 0.25, unit: 'cup', checked: true },
        { id: 4, name: 'Garlic cloves', amount: 4, unit: 'cloves', checked: false },
    ]);

    const toggleCheck = (id) => {
        setItems(items.map(item =>
            item.id === id ? { ...item, checked: !item.checked } : item
        ));
    };

    const removeItem = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const sortedItems = [...items].sort((a, b) => {
        if (a.checked === b.checked) return 0;
        return a.checked ? 1 : -1;
    });

    return (
        <div className="animate-fade-in">
            <header className="mb-10 pt-4">
                <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight mb-2">
                    Your <span className="text-secondary italic font-serif">Groceries</span>
                </h1>
                <p className="text-on-surface-variant text-lg">Smart aggregated shopping list.</p>
            </header>

            <div className="space-y-4">
                {sortedItems.map(item => (
                    <div
                        key={item.id}
                        className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${item.checked
                                ? 'bg-surface-container-low opacity-50'
                                : 'bg-surface-container shadow-lg'
                            }`}
                    >
                        <div className="flex items-center gap-4 flex-1" onClick={() => toggleCheck(item.id)}>
                            <button className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${item.checked ? 'bg-primary border-primary' : 'border-outline-variant hover:border-primary/50'
                                }`}>
                                {item.checked && <Check size={14} className="text-on-primary-fixed" />}
                            </button>

                            <div className="flex flex-col">
                                <span className={`font-medium ${item.checked ? 'text-on-surface-variant line-through' : 'text-white'}`}>
                                    {item.name}
                                </span>
                                <span className={`text-sm ${item.checked ? 'text-outline' : 'text-primary-dim'}`}>
                                    {item.amount} {item.unit}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                            className="p-2 text-outline hover:text-error transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}

                {items.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-3xl">🛒</span>
                        </div>
                        <h3 className="text-xl font-display text-white mb-2">Your list is empty</h3>
                        <p className="text-on-surface-variant">Add ingredients from recipes to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
