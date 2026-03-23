import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function UserDetails() {
    const { token } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setUsers(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchUsers();
    }, [token]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) setUsers(users.filter(u => u.id !== id));
        } catch (err) { console.error(err); }
    };

    if (loading) return <div className="text-gray-400 text-center mt-10">Loading users...</div>;

    return (
        <div className="max-w-6xl mx-auto pb-10">
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-[#91f78e]">Registered Users</h2>
                <p className="text-gray-400 mt-2">Manage the users that have signed up for the platform.</p>
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl border border-[#ffffff0a] overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-[#ffffff0a] bg-[#1a1a1a]/50 text-gray-400 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-medium">User Info</th>
                            <th className="px-6 py-4 font-medium">Role</th>
                            <th className="px-6 py-4 font-medium">Joined</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ffffff0a]">
                        {users.map((u) => (
                            <tr key={u.id} className="hover:bg-[#ffffff05] transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-[#2a2a2a] border border-[#ffffff0a] flex-shrink-0 flex items-center justify-center overflow-hidden">
                                            {u.profile_image ? (
                                                <img src={u.profile_image} alt={u.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="material-symbols-outlined text-gray-500 text-[24px]">person</span>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-200">{u.name}</div>
                                            <div className="text-xs text-gray-500">{u.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-500 border-purple-500/20' : 'bg-[#333] text-gray-300 border-[#333]'}`}>
                                        {u.role.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-400">
                                    {new Date(u.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {u.role !== 'admin' && (
                                        <button onClick={() => handleDelete(u.id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors" title="Delete User">
                                            <span className="material-symbols-outlined text-xl">person_remove</span>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-500">No users found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
