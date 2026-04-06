import React, { useState } from 'react';
import { useKitchen } from '../context/KitchenContext';
import { ShoppingCart, Heart, Filter, User, Tag } from 'lucide-react';

const KitchenDashboard = () => {
  const { pantry, cart, savedRecipes, activeFilters, userPriceUpdates, removeFromPantry, toggleFilter } = useKitchen();
  const [activeTab, setActiveTab] = useState('pantry');

  // Helper for tab styling
  const getTabClass = (tabId) => {
    return `flex-1 py-3 text-center border-b-2 font-medium transition-colors ${
      activeTab === tabId ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'
    }`;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 pb-24">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">My Kitchen</h1>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Pantry Items</p>
            <p className="text-2xl font-bold text-gray-800">{pantry.length}</p>
          </div>
          <div className="bg-green-100 p-3 rounded-full text-green-600">
            <User size={20} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Cart Items</p>
            <p className="text-2xl font-bold text-gray-800">{cart.length}</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <ShoppingCart size={20} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Saved Recipes</p>
            <p className="text-2xl font-bold text-gray-800">{savedRecipes.length}</p>
          </div>
          <div className="bg-red-100 p-3 rounded-full text-red-600">
            <Heart size={20} />
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">Active Filters</p>
            <p className="text-2xl font-bold text-gray-800">{activeFilters.length}</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full text-purple-600">
            <Filter size={20} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white rounded-t-xl border-b border-gray-200">
        <button onClick={() => setActiveTab('pantry')} className={getTabClass('pantry')}>Pantry</button>
        <button onClick={() => setActiveTab('cart')} className={getTabClass('cart')}>Grocery List</button>
        <button onClick={() => setActiveTab('saved')} className={getTabClass('saved')}>Saved Recipes</button>
        <button onClick={() => setActiveTab('filters')} className={getTabClass('filters')}>Filters & Prices</button>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-b-xl shadow-sm border border-t-0 border-gray-200 min-h-[300px]">
        
        {/* PANTRY TAB */}
        {activeTab === 'pantry' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Your Ingredients</h2>
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700">
                + Add Item
              </button>
            </div>
            
            {pantry.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>Your pantry is empty!</p>
                <p className="text-sm">Add ingredients you own so we can recommend what to cook.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {pantry.map(item => (
                  <li key={item.id} className="py-3 flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <span className="text-gray-500 text-sm ml-2">({item.quantity} {item.unit})</span>
                    </div>
                    <button 
                      onClick={() => removeFromPantry(item.id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* CART TAB */}
        {activeTab === 'cart' && (
          <div>
             <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-gray-800">Grocery List</h2>
                 {cart.length > 0 && (
                     <button 
                         onClick={() => window.location.href = '/grocery-run'} 
                         className="bg-[#91f78e] text-[#0e0e0e] px-4 py-2 rounded-lg text-sm font-bold shadow-[0_4px_15px_rgba(145,247,142,0.3)] hover:opacity-90 flex items-center gap-2"
                     >
                         <span className="material-symbols-outlined text-[18px]">route</span> Optimize Route
                     </button>
                 )}
             </div>
             {cart.length === 0 ? (
               <div className="text-center py-12 text-gray-500">
                 <p>Your list is empty.</p>
                 <p className="text-sm">Find a recipe and click "Add missing ingredients to cart".</p>
               </div>
             ) : (
               <ul className="divide-y divide-gray-100">
                {cart.map((item, idx) => (
                  <li key={idx} className="py-3 flex justify-between items-center">
                    <div>
                      <span className="font-medium text-gray-800">{item.name}</span>
                      <span className="text-gray-500 text-sm ml-2">{item.quantity} {item.unit}</span>
                    </div>
                  </li>
                ))}
              </ul>
             )}
          </div>
        )}

        {/* SAVED RECIPES TAB */}
        {activeTab === 'saved' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Saved Recipes</h2>
            {savedRecipes.length === 0 ? (
              <p className="text-gray-500">No saved recipes yet.</p>
            ) : (
              <ul className="list-disc pl-5">
                {savedRecipes.map((id, idx) => (
                  <li key={idx} className="mb-2 text-blue-600 hover:underline cursor-pointer">Recipe ID: {id}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* FILTERS & PRICES TAB */}
        {activeTab === 'filters' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Dietary Filters</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {['Vegan', 'Vegetarian', 'Keto', 'Gluten-Free', 'Dairy-Free', 'Nut-Free'].map(diet => (
                <button
                  key={diet}
                  onClick={() => toggleFilter(diet)}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition-colors ${
                    activeFilters.includes(diet) 
                      ? 'bg-green-600 border-green-600 text-white' 
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-green-500'
                  }`}
                >
                  {diet}
                </button>
              ))}
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Tag size={20} /> Recent Price Updates (Crowdsourced)
            </h2>
            {Object.keys(userPriceUpdates).length === 0 ? (
              <p className="text-gray-500">No recent price updates.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {Object.entries(userPriceUpdates).map(([ingId, data]) => (
                  <li key={ingId} className="py-3 flex justify-between">
                    <span className="font-medium">Ingredient {ingId}</span>
                    <div className="text-right">
                      <span className="text-green-600 font-bold">₹{data.price}</span>
                      <p className="text-xs text-gray-400">
                        {new Date(data.timestamp).toLocaleString()} • Store {data.storeId}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default KitchenDashboard;
