import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leafet icon paths
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return position.lat && position.lng ? <Marker position={[position.lat, position.lng]} /> : null;
}

export default function ManageGroceryStores() {
  const { token } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: '', mobile: '', address: '', city: '', lat: '', lng: '' });

  const fetchStores = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stores`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchStores();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this store?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stores/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setStores(stores.filter(s => s.id !== id));
    } catch (err) { console.error(err); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.lat || !formData.lng) {
      alert('Please select a location on the map.');
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stores`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newItem = await res.json();
        setStores([...stores, newItem]);
        setIsAdding(false);
        setFormData({ name: '', type: '', mobile: '', address: '', city: '', lat: '', lng: '' });
      }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#91f78e]">Manage Grocery Stores</h2>
          <p className="text-gray-400 mt-2">Add, edit, or remove grocery stores.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-[#91f78e] hover:bg-[#7ce279] text-[#0e0e0e] px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-colors">
          <span className="material-symbols-outlined">add</span>
          New Store
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-[#1a1a1a] rounded-2xl p-6 border border-[#ffffff0a] mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-2 text-gray-200" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Type</label>
            <input required type="text" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-2 text-gray-200" placeholder="Supermarket" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">City</label>
            <input required type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-2 text-gray-200" />
          </div>
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Mobile</label>
            <input type="text" value={formData.mobile} onChange={e => setFormData({ ...formData, mobile: e.target.value })} className="w-full bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-2 text-gray-200" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Address</label>
            <input required type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-[#2a2a2a] border border-[#ffffff0a] rounded-xl px-4 py-2 text-gray-200" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2">Store Location (Click on the map)</label>
            <div className="h-64 sm:h-80 w-full rounded-xl overflow-hidden border border-[#ffffff0a] z-0">
              <MapContainer center={[19.0760, 72.8777]} zoom={11} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <LocationMarker
                  position={{ lat: formData.lat, lng: formData.lng }}
                  setPosition={(pos) => setFormData({ ...formData, lat: pos.lat, lng: pos.lng })}
                />
              </MapContainer>
            </div>
            {(formData.lat && formData.lng) && (
              <p className="text-gray-500 text-xs mt-2">Selected: {formData.lat.toFixed(4)}, {formData.lng.toFixed(4)}</p>
            )}
          </div>
          <div className="md:col-span-2 flex gap-2 mt-4">
            <button type="submit" className="bg-[#91f78e] hover:bg-[#7ce279] text-[#0e0e0e] px-6 py-2 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(145,247,142,0.2)]">Save Store</button>
            <button type="button" onClick={() => setIsAdding(false)} className="bg-[#2a2a2a] hover:bg-[#333] text-gray-300 px-6 py-2 rounded-xl font-medium border border-[#ffffff0a] transition-all">Cancel</button>
          </div>
        </form>
      )}

      <div className="bg-[#1a1a1a] rounded-2xl border border-[#ffffff0a] overflow-hidden shadow-xl overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#ffffff0a] bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-medium">Store</th>
              <th className="px-6 py-4 font-medium">Location</th>
              <th className="px-6 py-4 font-medium">Contact</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ffffff0a]">
            {stores.map((store) => (
              <tr key={store.id} className="hover:bg-[#ffffff05] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-200">{store.name}</div>
                  <div className="text-xs text-gray-500">{store.type}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-gray-300">{store.city}</div>
                  <div className="text-xs text-gray-500 max-w-[200px] truncate">{store.address}</div>
                </td>
                <td className="px-6 py-4 text-gray-400">{store.mobile || 'N/A'}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(store.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Delete">
                    <span className="material-symbols-outlined text-xl">delete</span>
                  </button>
                </td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">No stores found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
