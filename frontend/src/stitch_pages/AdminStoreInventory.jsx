import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';

export default function AdminStoreInventory() {
  const { id: storeId } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [inventory, setInventory] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedIngredient, setSelectedIngredient] = useState('');
  const [price, setPrice] = useState('');
  const [inStock, setInStock] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch Stores to get Store Name
        const storesRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stores`, { headers });
        const stores = await storesRes.json();
        const currentStore = stores.find(s => s.id.toString() === storeId);
        if (currentStore) setStoreName(currentStore.name);

        // Fetch Ingredients Dropdown
        const ingRes = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/ingredients`, { headers });
        const ingData = await ingRes.json();
        setIngredients(ingData);

        // Fetch Current Store Inventory
        const invRes = await fetch(`${import.meta.env.VITE_API_URL}/api/stores/${storeId}/inventory`, { headers });
        const invData = await invRes.json();
        setInventory(invData);

      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchData();
  }, [token, storeId]);

  const handleSavePrice = async (e) => {
    e.preventDefault();
    if (!selectedIngredient || !price) return alert("Please select an ingredient and enter a price.");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stores/${storeId}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ingredient_id: selectedIngredient,
          price: parseFloat(price),
          in_stock: inStock
        })
      });

      if (res.ok) {
        // Refresh inventory
        const invRes = await fetch(`${import.meta.env.VITE_API_URL}/api/stores/${storeId}/inventory`, { 
            headers: { Authorization: `Bearer ${token}` }
        });
        const invData = await invRes.json();
        setInventory(invData);

        // Reset form keeping the selected ingredient (or resetting it)
        setSelectedIngredient('');
        setPrice('');
        setInStock(true);
      } else {
        alert("Failed to update inventory.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const setEditItem = (item) => {
    setSelectedIngredient(item.ingredient_id.toString());
    setPrice(item.price);
    setInStock(item.in_stock === 1 || item.in_stock === true);
  };

  if (loading) return <div className="text-gray-400 p-6">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <button onClick={() => navigate('/admin/stores')} className="text-gray-400 hover:text-gray-200 flex items-center gap-2 mb-6">
        <span className="material-symbols-outlined text-sm">arrow_back</span>
        Back to Stores
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#91f78e]">Manage Prices: {storeName || `Store #${storeId}`}</h2>
        <p className="text-gray-400 mt-2">Update the price and availability of ingredients in this store.</p>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#ffffff0a] mb-8">
        <h3 className="text-xl font-bold text-gray-100 mb-4">Add or Update Item Price</h3>
        <form onSubmit={handleSavePrice} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Ingredient</label>
            <select
              value={selectedIngredient}
              onChange={(e) => setSelectedIngredient(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none"
              required
            >
              <option value="">-- Select Ingredient --</option>
              {ingredients.map(ing => (
                <option key={ing.id} value={ing.id}>{ing.name} ({ing.unit})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Price (INR)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none"
              placeholder="e.g. 45"
              required
            />
          </div>
          <div className="flex flex-col gap-2 justify-end mb-2">
            <label className="flex items-center gap-2 text-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className="w-4 h-4 rounded text-[#91f78e] focus:ring-[#91f78e] accent-[#91f78e]"
              />
              In Stock
            </label>
          </div>
          <div className="md:col-span-4 mt-2">
            <button type="submit" className="bg-[#91f78e] hover:bg-[#7ce279] text-[#0e0e0e] px-6 py-2 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(145,247,142,0.2)]">
              Save Price
            </button>
            {selectedIngredient && (
              <button type="button" onClick={() => { setSelectedIngredient(''); setPrice(''); setInStock(true); }} className="ml-4 bg-transparent text-gray-400 hover:text-white px-4 py-2 rounded-xl font-medium transition-all">
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-[#ffffff0a] overflow-hidden shadow-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#ffffff0a] bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Ingredient</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ffffff0a]">
            {inventory.map((item) => (
              <tr key={item.id} className="hover:bg-[#ffffff05] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-200">{item.ingredient_name}</div>
                  <div className="text-xs text-gray-500">Unit: {item.unit}</div>
                </td>
                <td className="px-6 py-4 text-gray-300">{item.category}</td>
                <td className="px-6 py-4 font-semibold text-[#91f78e]">₹{item.price}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.in_stock ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {item.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => setEditItem(item)} className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors" title="Edit">
                    <span className="material-symbols-outlined text-xl">edit</span>
                  </button>
                </td>
              </tr>
            ))}
            {inventory.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No prices set for this store yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
