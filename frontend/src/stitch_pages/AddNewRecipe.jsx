import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AddNewRecipe() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '', category: '', description: '', prep_time: '',
    difficulty: 'Easy', image_url: '', video_link: '',
    cultural_origin: '', servings: '', instructions: '',
    nutrition_info: '{"calories": "", "protein": "", "carbs": "", "fats": ""}'
  });

  const [nutrition, setNutrition] = useState({ calories: '', protein: '', carbs: '', fats: '' });

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      const result = await res.json();
      if (res.ok) setFormData({ ...formData, image_url: result.imageUrl });
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        nutrition_info: JSON.stringify(nutrition)
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert(user?.role === 'admin' ? 'Recipe created successfully!' : 'Recipe submitted and is pending admin approval.');
        navigate('/searchcookbook');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e0e]">
      <header className="bg-[#0e0e0e]/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 border-b border-[#ffffff0a] flex items-center justify-between">
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-2xl text-white">Create Recipe</h1>
      </header>

      <main className="flex-1 px-4 md:px-6 pt-6 pb-32 max-w-3xl mx-auto w-full">
        <div className="bg-[#1a1a1a] rounded-3xl p-6 md:p-8 border border-[#ffffff0a] shadow-2xl">
          <p className="text-gray-400 mb-8 pb-6 border-b border-[#ffffff0a]">Share your culinary masterpieces with our vibrant community of food enthusiasts.</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Recipe Title *</label>
              <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#91f78e]" placeholder="E.g. Classic Butter Chicken" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Category *</label>
                <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#91f78e] appearance-none">
                  <option value="" disabled>Select category</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Veg">Non-Veg</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Dessert">Dessert</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Difficulty *</label>
                <select required value={formData.difficulty} onChange={e => setFormData({ ...formData, difficulty: e.target.value })} className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#91f78e] appearance-none">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Description</label>
              <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#91f78e]" placeholder="A brief summary of what makes this recipe amazing." />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Prep Time (min)</label>
                <input type="number" value={formData.prep_time} onChange={e => setFormData({ ...formData, prep_time: e.target.value })} className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#91f78e]" placeholder="45" />
              </div>
              <div>
                <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Servings</label>
                <input type="number" value={formData.servings} onChange={e => setFormData({ ...formData, servings: e.target.value })} className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#91f78e]" placeholder="4" />
              </div>
              <div className="col-span-2">
                <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Cultural Origin</label>
                <input value={formData.cultural_origin} onChange={e => setFormData({ ...formData, cultural_origin: e.target.value })} className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#91f78e]" placeholder="E.g. Italian, Indian" />
              </div>
            </div>

            <div>
              <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Step-by-step Instructions *</label>
              <textarea required rows="6" value={formData.instructions} onChange={e => setFormData({ ...formData, instructions: e.target.value })} className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#91f78e]" placeholder="Step 1: Chop vegetables...\nStep 2: Heat oil..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Cover Image</label>
                <input type="file" accept="image/*" onChange={handleUpload} className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#91f78e]" />
                {formData.image_url && <span className="text-xs text-green-500 mt-2 block">Image uploaded!</span>}
              </div>
              <div>
                <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Video Link URL</label>
                <input type="url" value={formData.video_link} onChange={e => setFormData({ ...formData, video_link: e.target.value })} className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-[#91f78e]" placeholder="https://youtube.com/..." />
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-[#ffffff0a]">
              <h3 className="text-white font-bold mb-6 text-xl">Nutritional Information (Optional)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Calories</label>
                  <input value={nutrition.calories} onChange={e => setNutrition({ ...nutrition, calories: e.target.value })} className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#91f78e]" placeholder="450" />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Protein</label>
                  <input value={nutrition.protein} onChange={e => setNutrition({ ...nutrition, protein: e.target.value })} className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#91f78e]" placeholder="30g" />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Carbs</label>
                  <input value={nutrition.carbs} onChange={e => setNutrition({ ...nutrition, carbs: e.target.value })} className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#91f78e]" placeholder="45g" />
                </div>
                <div>
                  <label className="block text-gray-400 font-bold text-xs uppercase tracking-wider mb-2">Fats</label>
                  <input value={nutrition.fats} onChange={e => setNutrition({ ...nutrition, fats: e.target.value })} className="w-full bg-[#0e0e0e] border border-[#ffffff0a] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#91f78e]" placeholder="15g" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-10 bg-[#91f78e] hover:bg-[#7ce279] text-[#0e0e0e] text-lg font-black py-5 rounded-2xl transition-all shadow-[0_0_20px_rgba(145,247,142,0.2)] disabled:opacity-70"
            >
              {loading ? 'Submitting...' : 'Publish Recipe'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
