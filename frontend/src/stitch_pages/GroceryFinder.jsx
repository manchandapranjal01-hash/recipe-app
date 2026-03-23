import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leafet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export default function GroceryFinder() {
  const [ingredients, setIngredients] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [storeResults, setStoreResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/ingredients`);
        const data = await res.json();
        setIngredients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load ingredients", err);
      }
    };
    fetchIngredients();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Geolocation error:', err)
      );
    }
  }, []);

  const toggleIngredient = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleCompare = async () => {
    if (selectedIds.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/stores/compare-prices`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredientIds: selectedIds })
      });
      if (res.ok) {
        const data = await res.json();
        setStoreResults(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const filteredIngredients = ingredients.filter(ing =>
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e0e]">
      <header className="bg-[#0e0e0e]/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 border-b border-[#ffffff0a] flex items-center justify-between">
        <h1 className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-2xl text-white">Grocery Finder</h1>
        <div onClick={() => navigate('/userprofile')} className="h-10 w-10 min-w-[40px] shrink-0 rounded-full overflow-hidden border-2 border-[#91f78e]/50 cursor-pointer hover:border-[#91f78e] transition-colors flex items-center justify-center mix-blend-screen">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-YbN-R_rGZgZIw4f6VJKcO9QEZzZUMnFy-ZTwbJeGnAngo3ELxolnJiln7ch_mIKbN70bkhGrmERiLZZdpKzidKeW5O_U3h8yGxNF-rWzkHL98CVepccrOGC2QcIwYz-vmt9Ef96a3f08T5RzxWK3ZVtFH6nFZw3tohqnG6cSWWujiTBVt-pX_KZ1xLeLQmqa9LDi3Yg2B9um2vkgzwH2d7pEgzB89KL9iXvttLgps5lcNYB-rmqViLqtTsk7SkwoXgwEKkW3c-De" className="w-full h-full object-cover" />
        </div>
      </header>

      <main className="flex-1 px-4 md:px-6 pt-6 pb-24 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Ingredient Selection */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#1a1a1a] rounded-[2rem] p-6 md:p-8 border border-[#ffffff0a] shadow-xl sticky top-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-[#91f78e]/20 rounded-2xl flex items-center justify-center text-[#91f78e] material-symbols-outlined text-2xl shrink-0">shopping_cart_checkout</div>
              <h3 className="text-xl font-bold font-['Plus_Jakarta_Sans'] text-white">Shopping List</h3>
            </div>

            <input
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-3 text-white mb-6 focus:outline-none focus:border-[#91f78e]"
            />

            <div className="flex flex-wrap gap-2 mb-8 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredIngredients.map(ing => (
                <button
                  key={ing.id}
                  onClick={() => toggleIngredient(ing.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border flex items-center justify-center shrink-0 ${selectedIds.includes(ing.id)
                      ? 'bg-[#91f78e] text-[#0e0e0e] border-[#91f78e] shadow-[0_0_10px_rgba(145,247,142,0.3)]'
                      : 'bg-[#2a2a2a] text-gray-400 border-transparent hover:bg-[#333] hover:text-gray-200'
                    }`}
                >
                  {selectedIds.includes(ing.id) && <span className="material-symbols-outlined text-[14px] align-middle mr-1 -ml-1">check</span>}
                  {ing.name}
                </button>
              ))}
            </div>

            <button
              onClick={handleCompare}
              disabled={loading || selectedIds.length === 0}
              className="w-full bg-white hover:bg-gray-200 text-[#0e0e0e] text-lg font-black py-4 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? 'Comparing...' : 'Compare Prices'}
              {!loading && <span className="material-symbols-outlined text-[#ff9800]">storefront</span>}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Interactive Map */}
          {(storeResults.length > 0 || userLocation) && (
            <div className="h-64 md:h-80 w-full rounded-[2rem] overflow-hidden border border-[#ffffff0a] shadow-xl z-0 relative bg-[#1a1a1a]">
              <MapContainer center={userLocation || (storeResults[0]?.lat ? [storeResults[0].lat, storeResults[0].lng] : [19.0760, 72.8777])} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                {userLocation && (
                  <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                    <Popup>You are here</Popup>
                  </Marker>
                )}
                {storeResults.map(store => (
                  store.lat && store.lng && (
                    <Marker key={store.id} position={[store.lat, store.lng]}>
                      <Popup><b>{store.name}</b><br />₹{parseFloat(store.total_price).toFixed(2)}</Popup>
                    </Marker>
                  )
                ))}
              </MapContainer>
            </div>
          )}

          {storeResults.length === 0 && !loading && (
            <div className="bg-[#1a1a1a] rounded-[2rem] p-12 border border-[#ffffff0a] text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <div className="w-24 h-24 bg-[#2a2a2a] rounded-full flex flex-shrink-0 items-center justify-center mb-6">
                <span className="material-symbols-outlined text-gray-500 text-5xl">store_door</span>
              </div>
              <h3 className="text-2xl font-bold font-['Plus_Jakarta_Sans'] text-white mb-2">Find the Best Deals</h3>
              <p className="text-gray-400 max-w-sm">Build your shopping list on the left and discover which local stores have what you need at the lowest prices.</p>
            </div>
          )}

          {storeResults.map((store, idx) => (
            <div key={store.id} className={`bg-[#1a1a1a] rounded-[2rem] border overflow-hidden transition-all shadow-lg ${idx === 0 ? 'border-[#91f78e] shadow-[0_0_30px_rgba(145,247,142,0.15)] transform hover:-translate-y-1' : 'border-[#ffffff0a]'}`}>
              {idx === 0 && (
                <div className="bg-[#91f78e] text-black text-xs font-black uppercase tracking-widest text-center py-1.5 flex items-center justify-center gap-1 shrink-0">
                  <span className="material-symbols-outlined text-[16px]">sell</span> Best Value
                </div>
              )}
              <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                  <div className="flex flex-col">
                    <h3 className="text-2xl font-black text-white font-['Plus_Jakarta_Sans']">{store.name}</h3>
                    <p className="text-gray-400 text-sm mt-1 flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {store.address}, {store.city}</p>
                    <div className="flex gap-2">
                      <span className="inline-block mt-3 px-3 py-1 bg-[#2a2a2a] rounded-md text-xs font-bold text-gray-300 w-max">{store.type}</span>
                      {userLocation && store.lat && store.lng && (
                        <span className="inline-block mt-3 px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md text-xs font-bold w-max">
                          {calculateDistance(userLocation.lat, userLocation.lng, store.lat, store.lng)} km away
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="bg-[#2a2a2a] p-4 rounded-2xl border border-[#ffffff0a] min-w-[160px] flex flex-col items-center justify-center text-center -mx-4 md:mx-0">
                    <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Total Estimated Cost</span>
                    <span className={`text-4xl font-black ${idx === 0 ? 'text-[#91f78e]' : 'text-white'}`}>₹{parseFloat(store.total_price).toFixed(2)}</span>
                    <span className="text-gray-500 text-xs mt-2 font-medium">Found: {store.items_found} / {selectedIds.length} items</span>
                  </div>
                </div>

                <div className="bg-[#0e0e0e] rounded-xl p-4 border border-[#ffffff0a]">
                  <h4 className="text-white font-bold text-sm mb-3">Item Breakdown:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {store.price_details?.split('|').map((detail, i) => {
                      const [name, price] = detail.split(':');
                      return (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-[#ffffff0a] last:border-0 last:pb-0">
                          <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#ff9800] shrink-0"></div> {name}
                          </span>
                          <span className="text-gray-200 font-bold font-mono">₹{parseFloat(price).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
}
