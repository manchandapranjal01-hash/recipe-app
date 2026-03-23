import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function AdminProfile() {
  const { user, token, logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', profile_image: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) setFormData({ name: user.name || '', email: user.email || '', profile_image: user.profile_image || '', password: '' });
  }, [user]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: data
      });
      const result = await res.json();
      if (res.ok) setFormData({ ...formData, profile_image: result.imageUrl });
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Profile updated successfully. Please log back in to see changes.');
        logout();
      } else {
        alert('Error updating profile');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto pb-10">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[#91f78e]">Admin Settings</h2>
        <p className="text-gray-400 mt-2">Manage your admin preferences and profile.</p>
      </div>

      <div className="bg-[#1a1a1a] rounded-3xl border border-[#ffffff0a] overflow-hidden">
        {/* Cover */}
        <div className="h-48 bg-gradient-to-r from-[#91f78e]/20 to-[#91f78e]/5"></div>

        {/* Profile Info */}
        <div className="px-8 pb-8 flex flex-col md:flex-row gap-6 items-start md:items-end -mt-16">
          <div className="w-32 h-32 rounded-full border-4 border-[#1a1a1a] bg-[#2a2a2a] overflow-hidden shadow-2xl mb-6 flex items-center justify-center shrink-0">
            {user.profile_image ? (
              <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-gray-500 text-[64px]">person</span>
            )}
          </div>
          <div className="flex-1 pb-4">
            <h1 className="text-3xl font-bold text-gray-100">{user.name}</h1>
            <p className="text-gray-400 mt-1">{user.email} • {user.role.toUpperCase()}</p>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-6">
          <div className="bg-[#2a2a2a] rounded-2xl p-6 border border-[#ffffff0a]">
            <h3 className="text-xl font-bold text-white mb-6">Edit Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Display Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-[#1a1a1a] border border-[#ffffff0a] rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-[#91f78e]" />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Email Address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full bg-[#1a1a1a] border border-[#ffffff0a] rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-[#91f78e]" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">Profile Image</label>
                <input type="file" accept="image/*" onChange={handleUpload} className="w-full bg-[#1a1a1a] border border-[#ffffff0a] rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-[#91f78e]" />
                {formData.profile_image && <span className="text-xs text-green-500 mt-2 block">Image uploaded!</span>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-gray-500 mb-2">New Password (leave blank to keep current)</label>
                <input type="password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} className="w-full bg-[#1a1a1a] border border-[#ffffff0a] rounded-xl px-4 py-3 text-gray-200 focus:outline-none focus:border-[#91f78e]" placeholder="********" />
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#ffffff0a]">
              <button disabled={loading} type="submit" className="bg-[#91f78e] hover:bg-[#7ce279] text-[#0e0e0e] px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(145,247,142,0.2)]">
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
