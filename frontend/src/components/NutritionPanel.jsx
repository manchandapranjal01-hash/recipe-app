import React, { useState, useEffect } from 'react';

const NutritionPanel = ({ ingredients = [] }) => {
  const [nutrition, setNutrition] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!ingredients || ingredients.length === 0) return;

    const fetchNutrition = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/nutrition/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ingredients })
        });
        if (res.ok) {
          const data = await res.json();
          setNutrition(data);
        }
      } catch (err) {
        console.error("Failed to fetch nutrition data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNutrition();
  }, [ingredients]);

  if (loading) {
    return <div className="text-gray-400 text-sm animate-pulse">Analyzing nutrition...</div>;
  }

  if (!nutrition) {
    return null;
  }

  const { calories, totalNutrients } = nutrition;
  const protein = totalNutrients?.PROCNT?.quantity || 0;
  const carbs = totalNutrients?.CHOCDF?.quantity || 0;
  const fat = totalNutrients?.FAT?.quantity || 0;

  const totalMacros = protein + carbs + fat || 1;
  const pPct = (protein / totalMacros) * 100;
  const cPct = (carbs / totalMacros) * 100;
  const fPct = (fat / totalMacros) * 100;

  return (
    <div className="bg-[#1a1a1a] rounded-2xl p-5 border border-[#ffffff0a] mt-6">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-[#91f78e]">spa</span>
        Nutritional Summary (Per Serving)
      </h3>
      
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {/* Simple Ring using Conic Gradient */}
        <div className="relative w-32 h-32 rounded-full flex items-center justify-center bg-[#2a2a2a]"
             style={{
               background: `conic-gradient(
                 #ef4444 0% ${pPct}%, 
                 #3b82f6 ${pPct}% ${pPct + cPct}%, 
                 #eab308 ${pPct + cPct}% 100%
               )`
             }}>
          <div className="absolute inset-2 bg-[#1a1a1a] rounded-full flex flex-col items-center justify-center">
             <span className="text-2xl font-black text-white">{calories}</span>
             <span className="text-[10px] text-gray-400 font-bold tracking-wider uppercase">Cal</span>
          </div>
        </div>

        <div className="flex-1 w-full space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300 font-bold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500"></span> Protein
              </span>
              <span className="text-white font-medium">{protein.toFixed(1)}g</span>
            </div>
            <div className="w-full bg-[#2a2a2a] rounded-full h-2">
              <div className="bg-red-500 h-2 rounded-full" style={{ width: `${pPct}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300 font-bold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span> Carbs
              </span>
              <span className="text-white font-medium">{carbs.toFixed(1)}g</span>
            </div>
            <div className="w-full bg-[#2a2a2a] rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${cPct}%` }}></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300 font-bold flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span> Fats
              </span>
              <span className="text-white font-medium">{fat.toFixed(1)}g</span>
            </div>
            <div className="w-full bg-[#2a2a2a] rounded-full h-2">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${fPct}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-xs text-gray-500 mt-4 text-center">Powered by Edamam Mock Service</p>
    </div>
  );
};

export default NutritionPanel;
