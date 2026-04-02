import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AdminCompetitivePrices() {
  const { token } = useContext(AuthContext);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingPrices, setFetchingPrices] = useState(false);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/ingredients`, { headers });
        const data = await res.json();
        setIngredients(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchIngredients();
  }, [token]);

  const fetchComparison = async (ingredientId) => {
    if (!ingredientId) {
      setResults([]);
      return;
    }
    setFetchingPrices(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stores/compare-prices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredientIds: [ingredientId] })
      });
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchingPrices(false);
    }
  };

  const handleIngredientChange = (e) => {
    const ingId = e.target.value;
    setSelectedIngredient(ingId);
    fetchComparison(ingId);
  };

  if (loading) return <div className="text-gray-400 p-6">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#91f78e]">Competitive Prices Analysis</h2>
        <p className="text-gray-400 mt-2">Find out how much an ingredient costs across different stores to advise owners on pricing.</p>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#ffffff0a] mb-8">
        <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Select an Ingredient to Analyze</label>
        <select
          value={selectedIngredient}
          onChange={handleIngredientChange}
          className="w-full md:w-1/2 bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-3 text-gray-200 focus:outline-none"
        >
          <option value="">-- Select Ingredient --</option>
          {ingredients.map(ing => (
            <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
          ))}
        </select>
      </div>

      {selectedIngredient && (
        <div className="bg-[#1a1a1a] rounded-2xl border border-[#ffffff0a] overflow-hidden shadow-xl overflow-x-auto">
          {fetchingPrices ? (
            <div className="p-10 text-center text-gray-400">Fetching competitive prices...</div>
          ) : results.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ffffff0a] bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Rank</th>
                  <th className="px-6 py-4 font-medium">Store</th>
                  <th className="px-6 py-4 font-medium">Location</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Difference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffffff0a]">
                {results.map((store, index) => {
                  const isCheapest = index === 0;
                  const cheapestPrice = parseFloat(results[0].total_price);
                  const priceDiff = parseFloat(store.total_price) - cheapestPrice;
                  
                  return (
                    <tr key={store.id} className={`hover:bg-[#ffffff05] transition-colors ${isCheapest ? 'bg-green-500/5' : ''}`}>
                      <td className="px-6 py-4 text-gray-400 font-bold">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-200">{store.name}</div>
                        <div className="text-xs text-gray-500">{store.type}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {store.city}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-lg font-bold ${isCheapest ? 'text-[#91f78e]' : 'text-gray-200'}`}>
                          ₹{store.total_price}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isCheapest ? (
                          <span className="text-xs font-medium text-green-500 bg-green-500/10 px-2 py-1 rounded">Best Price</span>
                        ) : (
                          <span className="text-xs font-medium text-red-400 bg-red-400/10 px-2 py-1 rounded">
                            +₹{priceDiff.toFixed(2)}
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="p-10 text-center text-gray-400">
              <span className="material-symbols-outlined text-4xl block mb-2 opacity-50">inventory_2</span>
              This ingredient is not currently stocked in any store.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
