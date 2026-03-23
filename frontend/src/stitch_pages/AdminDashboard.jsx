import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, recipes: 0, stores: 0, ingredients: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [usersRes, recipesRes, storesRes, ingsRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/admin/users`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/admin/recipes`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/admin/stores`, { headers }),
          fetch(`${import.meta.env.VITE_API_URL}/api/admin/ingredients`, { headers })
        ]);

        const users = await usersRes.json();
        const recipes = await recipesRes.json();
        const stores = await storesRes.json();
        const ings = await ingsRes.json();

        setStats({
          users: users.length || 0,
          recipes: recipes.length || 0,
          stores: stores.length || 0,
          ingredients: ings.length || 0
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchStats();
  }, [token]);

  const StatCard = ({ title, count, icon, color }) => (
    <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#ffffff0a] flex items-center gap-4">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color} bg-opacity-10 text-opacity-100`}>
        <span className={`material-symbols-outlined text-3xl ${color.replace('bg-', 'text-')}`}>{icon}</span>
      </div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-gray-100 mt-1">{loading ? '...' : count}</h3>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#91f78e]">Dashboard Overview</h2>
        <p className="text-gray-400 mt-2">Welcome back to The Edible Editorial management panel.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Users" count={stats.users} icon="group" color="bg-blue-500" />
        <StatCard title="Total Recipes" count={stats.recipes} icon="menu_book" color="bg-green-500" />
        <StatCard title="Grocery Stores" count={stats.stores} icon="store" color="bg-yellow-500" />
        <StatCard title="Ingredients" count={stats.ingredients} icon="nutrition" color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#ffffff0a]">
          <h3 className="text-xl font-bold text-gray-100 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate('/admin/recipes?filter=pending')} className="w-full flex items-center justify-between p-4 rounded-xl bg-[#2a2a2a] hover:bg-[#333] transition-colors group">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#91f78e]">add_circle</span>
                <span className="text-gray-200">Review Pending Recipes</span>
              </div>
              <span className="material-symbols-outlined text-gray-500 group-hover:text-gray-300">chevron_right</span>
            </button>
            <button onClick={() => navigate('/admin/stores')} className="w-full flex items-center justify-between p-4 rounded-xl bg-[#2a2a2a] hover:bg-[#333] transition-colors group">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#ff9800]">store</span>
                <span className="text-gray-200">Add New Grocery Store</span>
              </div>
              <span className="material-symbols-outlined text-gray-500 group-hover:text-gray-300">chevron_right</span>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#ffffff0a]">
          <h3 className="text-xl font-bold text-gray-100 mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-300">API Server</span>
              </div>
              <span className="text-green-500 font-medium">Online</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-300">Database</span>
              </div>
              <span className="text-green-500 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-gray-300">Image Storage</span>
              </div>
              <span className="text-green-500 font-medium">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
