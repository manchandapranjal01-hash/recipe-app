import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useKitchen } from '../context/KitchenContext';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getBestStore } from '../utils/priceEngine';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock user's home location (e.g., somewhere in New Delhi or generic)
const userLocation = { lat: 28.6139, lng: 77.2090, name: "Home" };

// Mock stores with coordinates
const storesConfig = {
  'reliance-fresh': { name: 'Reliance Fresh', lat: 28.6150, lng: 77.2150 },
  'big-bazaar': { name: 'Big Bazaar', lat: 28.6200, lng: 77.2000 },
  'd-mart': { name: 'D-Mart', lat: 28.6050, lng: 77.2100 },
  'blankit': { name: 'Blinkit', lat: userLocation.lat, lng: userLocation.lng } // Assuming delivery
};

export default function GroceryRun() {
  const { cart, userPriceUpdates, addPriceUpdate } = useKitchen();
  const navigate = useNavigate();
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate route based on Cart items and Price Engine
    const planRoute = async () => {
      setLoading(true);
      try {
        // Fetch mock multi-store prices for items in cart
        // Here we just fetch general mock prices
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/prices/mock-scrape`);
        const mockPrices = await res.json();
        
        let targetStores = new Set();
        let totalCost = 0;
        let bestPicks = {};

        // For each item in cart, find best store using priceEngine
        cart.forEach(item => {
           // We expect the mock API to return an array of stores for this item
           // but our mock API just returns a flat list of prices for demo.
           // We'll simulate finding the best store.
           const itemStores = mockPrices.filter(p => p.item.toLowerCase().includes(item.name.toLowerCase()));
           if (itemStores.length > 0) {
             const best = getBestStore(item.name, itemStores, userPriceUpdates);
             if (best) {
               targetStores.add(best.storeId);
               bestPicks[item.id] = best;
               totalCost += best.price * item.quantity; // Simplified
             }
           }
        });

        // If no items match, just pick a default store
        if (targetStores.size === 0) {
            targetStores.add('reliance-fresh');
        }

        // Build route path
        const path = [userLocation];
        targetStores.forEach(storeId => {
            if (storesConfig[storeId]) {
                path.push(storesConfig[storeId]);
            }
        });
        // path.push(userLocation); // return home

        setRouteData({ path, bestPicks, totalCost, stores: Array.from(targetStores).map(s => storesConfig[s]) });
      } catch (err) {
        console.error("Route planning failed", err);
      } finally {
        setLoading(false);
      }
    };

    planRoute();
  }, [cart, userPriceUpdates]);

  return (
    <div className="flex flex-col min-h-screen bg-[#0e0e0e]">
      <header className="bg-[#0e0e0e]/80 backdrop-blur-xl sticky top-0 z-40 px-6 py-4 border-b border-[#ffffff0a] flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors flex items-center">
                <span className="material-symbols-outlined text-[28px]">arrow_back_ios_new</span>
            </button>
            <h1 className="font-['Plus_Jakarta_Sans'] font-bold tracking-tight text-2xl text-white">Grocery Run</h1>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full flex flex-col gap-6">
         {loading ? (
             <div className="flex-1 flex items-center justify-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#91f78e]"></div>
             </div>
         ) : routeData ? (
            <>
                <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-[#ffffff0a] shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-2">Optimized Route</h2>
                    <p className="text-gray-400 text-sm mb-4">
                        Visiting {routeData.stores.length} store(s) to save money based on real-time prices.
                        Estimated Cost: ₹{routeData.totalCost.toFixed(2)}
                    </p>
                    
                    <div className="h-64 rounded-xl overflow-hidden border border-[#ffffff0a] relative z-0">
                        <MapContainer 
                            center={[userLocation.lat, userLocation.lng]} 
                            zoom={13} 
                            style={{ height: '100%', width: '100%' }}
                            zoomControl={false}
                        >
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />
                            {routeData.path.map((pt, idx) => (
                                <Marker key={idx} position={[pt.lat, pt.lng]}>
                                    <Popup className="text-black font-bold">
                                        {pt.name}
                                    </Popup>
                                </Marker>
                            ))}
                            <Polyline 
                                positions={routeData.path.map(p => [p.lat, p.lng])} 
                                color="#91f78e" 
                                weight={4}
                                dashArray="10, 10"
                            />
                        </MapContainer>
                    </div>
                </div>

                <div className="bg-[#1a1a1a] rounded-3xl p-6 border border-[#ffffff0a] shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-4">Shopping List by Store</h2>
                    {routeData.stores.map((store, sIdx) => {
                       // Find items for this store
                       const itemsForStore = cart.filter(item => {
                           const pick = routeData.bestPicks[item.id];
                           return pick && pick.storeId === Object.keys(storesConfig).find(k => storesConfig[k].name === store.name);
                       });

                       if (itemsForStore.length === 0) return null;

                       return (
                           <div key={sIdx} className="mb-6 last:mb-0">
                               <h3 className="text-[#91f78e] font-bold text-lg mb-3 flex items-center gap-2">
                                   <span className="material-symbols-outlined">storefront</span>
                                   {store.name}
                               </h3>
                               <div className="flex flex-col gap-3">
                                   {itemsForStore.map((item, iIdx) => {
                                       const pick = routeData.bestPicks[item.id];
                                       return (
                                           <div key={iIdx} className="bg-[#2a2a2a] p-4 rounded-2xl flex justify-between items-center">
                                               <div>
                                                   <p className="text-white font-bold">{item.name} <span className="text-gray-500 text-sm">x{item.quantity}</span></p>
                                                   <p className="text-gray-400 text-xs mt-1">
                                                       ₹{pick.price} / {pick.quantity}{pick.unit} 
                                                       <span className="ml-2 text-green-400"> (₹{pick.normalizedPrice.toFixed(2)} {pick.normalizedUnit})</span>
                                                   </p>
                                               </div>
                                               <div className="flex flex-col items-end gap-2 text-right">
                                                   {pick.isUserUpdated && (
                                                       <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs font-bold border border-blue-500/30">
                                                           Crowdsourced
                                                       </span>
                                                   )}
                                                   <button 
                                                        onClick={() => {
                                                            const newPrice = prompt(`Update price for ${item.name} at ${store.name} (currently ₹${pick.price}):`);
                                                            if (newPrice && !isNaN(newPrice)) {
                                                                addPriceUpdate({ ingredientId: item.name, price: parseFloat(newPrice), storeId: pick.storeId });
                                                            }
                                                        }}
                                                        className="text-xs bg-[#ffffff1a] hover:bg-[#ffffff3a] text-white px-2 py-1 rounded transition-colors"
                                                   >
                                                       Update Price
                                                   </button>
                                               </div>
                                           </div>
                                       )
                                   })}
                               </div>
                           </div>
                       )
                    })}
                    
                    {routeData.stores.length === 0 && (
                        <p className="text-gray-400">No items with valid pricing data in cart. Proceed to nearest store.</p>
                    )}
                </div>
            </>
         ) : null}
      </main>
    </div>
  );
}
