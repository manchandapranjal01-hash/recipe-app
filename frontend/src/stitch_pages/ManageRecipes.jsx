import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ManageRecipes() {
  const { token } = useContext(AuthContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/recipes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRecipes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch recipes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchRecipes();
  }, [token]);

  const handleStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/recipes/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setRecipes(recipes.map(r => r.id === id ? { ...r, status: newStatus, is_approved: newStatus === 'approved' ? 1 : 0 } : r));
      }
    } catch (err) {
      console.error(`Failed to ${newStatus} recipe`, err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this recipe?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/recipes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setRecipes(recipes.filter(r => r.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete recipe', err);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-center mt-10">Loading recipes...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#91f78e]">Manage Recipes</h2>
          <p className="text-gray-400 mt-2">Approve, reject, or remove user-submitted recipes.</p>
        </div>
      </div>

      <div className="bg-[#1a1a1a] rounded-2xl border border-[#ffffff0a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#ffffff0a] bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Recipe Info</th>
                <th className="px-6 py-4 font-medium">Author</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ffffff0a]">
              {recipes.map((recipe) => (
                <tr key={recipe.id} className="hover:bg-[#ffffff05] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#2a2a2a] overflow-hidden border border-[#ffffff0a] flex-shrink-0">
                        {recipe.image_url ? (
                          <img src={recipe.image_url} alt={recipe.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-gray-500 w-full h-full flex items-center justify-center">restaurant</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-200">{recipe.title}</div>
                        <div className="text-xs text-gray-500">{new Date(recipe.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-300">
                    {recipe.author_name || 'System / Admin'}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full bg-[#333] text-gray-300 text-xs font-semibold">
                      {recipe.category || 'General'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {recipe.status === 'pending' && <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-500 text-xs font-bold border border-yellow-500/20">Pending</span>}
                    {recipe.status === 'approved' && <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-500 text-xs font-bold border border-green-500/20">Approved</span>}
                    {recipe.status === 'rejected' && <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-500 text-xs font-bold border border-red-500/20">Rejected</span>}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {recipe.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatus(recipe.id, 'approved')} className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors" title="Approve">
                            <span className="material-symbols-outlined text-xl">check_circle</span>
                          </button>
                          <button onClick={() => handleStatus(recipe.id, 'rejected')} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Reject">
                            <span className="material-symbols-outlined text-xl">cancel</span>
                          </button>
                        </>
                      )}
                      <button onClick={() => handleDelete(recipe.id)} className="p-2 rounded-lg bg-gray-500/10 text-gray-400 hover:bg-red-500/20 hover:text-red-500 transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-xl">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {recipes.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No recipes found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
