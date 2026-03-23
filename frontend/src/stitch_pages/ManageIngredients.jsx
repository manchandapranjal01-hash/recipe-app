import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ManageIngredients() {
  const { token } = useContext(AuthContext);
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', unit: '' });

  const fetchIngredients = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/ingredients', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setIngredients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchIngredients();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this ingredient?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/ingredients/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setIngredients(ingredients.filter(i => i.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/ingredients/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setIngredients(ingredients.map(i => i.id === id ? { ...i, is_approved: 1 } : i));
      }
    } catch (err) { console.error(err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newItem = await res.json();
        newItem.is_approved = 1; // Admins adding directly are auto-approved
        setIngredients([...ingredients, newItem]);
        setIsAdding(false);
        setFormData({ name: '', category: '', unit: '' });
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="text-gray-400 text-center mt-10">Loading ingredients...</div>;

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#91f78e]">Manage Ingredients</h2>
          <p className="text-gray-400 mt-2">Add, edit, or remove ingredients from the master database.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-[#91f78e] hover:bg-[#7ce279] text-[#0e0e0e] px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors">
          <span className="material-symbols-outlined">add</span>
          New Ingredient
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#ffffff0a] mb-6 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-[#91f78e]" placeholder="e.g. Tomatoes" />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Category</label>
            <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-[#91f78e] appearance-none cursor-pointer">
              <option value="" disabled>Select category</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Dairy">Dairy</option>
              <option value="Meat">Meat</option>
              <option value="Seafood">Seafood</option>
              <option value="Spices">Spices</option>
              <option value="Grains">Grains</option>
              <option value="Oils & Liquids">Oils & Liquids</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="w-32">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Unit</label>
            <input required type="text" value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })} className="w-full bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-2 text-gray-200 focus:outline-none focus:border-[#91f78e]" placeholder="pieces, g, ml" />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-[#91f78e] hover:bg-[#7ce279] text-[#0e0e0e] px-6 py-2 rounded-xl font-bold">Save</button>
            <button type="button" onClick={() => setIsAdding(false)} className="bg-[#2a2a2a] hover:bg-[#333] text-gray-300 px-6 py-2 rounded-xl font-medium border border-[#ffffff0a]">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-[#1a1a1a] rounded-2xl border border-[#ffffff0a] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#ffffff0a] bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">ID</th>
              <th className="px-6 py-4 font-medium">Name</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Category</th>
              <th className="px-6 py-4 font-medium">Unit</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ffffff0a]">
            {ingredients.map((ing) => (
              <tr key={ing.id} className="hover:bg-[#ffffff05] transition-colors">
                <td className="px-6 py-4 text-gray-500">#{ing.id}</td>
                <td className="px-6 py-4 text-gray-200 font-bold">{ing.name}</td>
                <td className="px-6 py-4">
                  {ing.is_approved ? (
                    <span className="px-2 py-1 bg-green-500/20 text-green-500 text-xs font-bold rounded-lg border border-green-500/20">Approved</span>
                  ) : (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs font-bold rounded-lg border border-yellow-500/20">Pending</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-[#333] text-gray-300 text-xs font-semibold">{ing.category || 'General'}</span>
                </td>
                <td className="px-6 py-4 text-gray-400">{ing.unit}</td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                  {!ing.is_approved && (
                    <button onClick={() => handleApprove(ing.id)} className="p-2 rounded-lg bg-[#91f78e]/10 text-[#91f78e] hover:bg-[#91f78e]/20 transition-colors" title="Approve">
                      <span className="material-symbols-outlined text-xl">check_circle</span>
                    </button>
                  )}
                  <button onClick={() => handleDelete(ing.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Delete">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </td>
              </tr>
            ))}
            {ingredients.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-gray-500">No ingredients found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
