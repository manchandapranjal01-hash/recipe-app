import React, { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NAV_ITEMS = [
    { path: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { path: '/admin/recipes', icon: 'menu_book', label: 'Recipes' },
    { path: '/admin/ingredients', icon: 'nutrition', label: 'Ingredients' },
    { path: '/admin/stores', icon: 'store', label: 'Stores' },
    { path: '/admin/competitive-prices', icon: 'query_stats', label: 'Prices' },
    { path: '/admin/users', icon: 'group', label: 'Users' },
    { path: '/admin/profile', icon: 'settings', label: 'Settings' },
];

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useContext(AuthContext);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleLogout = () => { logout(); navigate('/login'); };
    const isActive = (path) => location.pathname === path;

    const SidebarContent = () => (
        <>
            <div className="px-6 mb-8 flex flex-col items-start">
                <div className="w-14 h-14 rounded-full mb-3 ring-2 ring-[#91f78e] bg-[#2a2a2a] flex items-center justify-center overflow-hidden shrink-0">
                    {user?.profile_image ? (
                        <img alt="Admin" src={user.profile_image} className="w-full h-full object-cover" />
                    ) : (
                        <span className="material-symbols-outlined text-gray-500 text-[32px]">person</span>
                    )}
                </div>
                <h2 className="text-[#ff9800] font-bold text-lg leading-tight w-full truncate">{user?.name || 'Admin'}</h2>
                <p className="text-gray-400 text-sm truncate w-full">{user?.email || 'admin@verdant.com'}</p>
            </div>
            <nav className="flex-1 space-y-1">
                {NAV_ITEMS.map(item => (
                    <button key={item.path} onClick={() => { navigate(item.path); setDrawerOpen(false); }}
                        className={`w-full text-left px-6 py-3 flex items-center gap-4 transition-all duration-200
              ${isActive(item.path) ? 'bg-[#ff9800]/10 text-[#ff9800] border-l-4 border-[#ff9800]' : 'text-gray-400 hover:bg-[#ffffff08] hover:text-gray-200 border-l-4 border-transparent'}`}>
                        <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                        <span className="font-medium text-sm">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="mt-auto px-6 pb-4">
                <button onClick={handleLogout} className="w-full text-left px-4 py-3 flex items-center gap-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-[#0e0e0e]">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-64 bg-[#1a1a1a] border-r border-[#ffffff0a] sticky top-0 h-screen py-6">
                <SidebarContent />
            </aside>

            {/* Mobile Drawer Overlay */}
            {drawerOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
                    <aside className="absolute left-0 top-0 h-full w-64 bg-[#1a1a1a] py-6 shadow-2xl animate-slide-in flex flex-col">
                        <SidebarContent />
                    </aside>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="sticky top-0 z-40 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-[#ffffff0a] px-4 md:px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setDrawerOpen(true)} className="md:hidden text-[#91f78e] p-2 rounded-lg hover:bg-[#ffffff08]">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#91f78e] tracking-tight">
                            <span className="hidden sm:inline">The Edible Editorial</span>
                            <span className="sm:hidden">Admin</span>
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400 text-sm hidden sm:block">{user?.name}</span>
                        <div className="w-8 h-8 rounded-full bg-[#91f78e]/20 flex items-center justify-center">
                            <span className="material-symbols-outlined text-[#91f78e] text-lg">person</span>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                    <Outlet />
                </main>

                {/* Mobile Bottom Nav */}
                <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center py-2 bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-[#ffffff0a] z-40">
                    {NAV_ITEMS.slice(0, 5).map(item => (
                        <button key={item.path} onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center gap-0.5 py-1 px-2 ${isActive(item.path) ? 'text-[#91f78e]' : 'text-gray-500'}`}>
                            <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                            <span className="text-[9px] font-semibold uppercase tracking-wider">{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
}
