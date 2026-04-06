import React, { useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const NAV_ITEMS = [
    { path: '/discoverrecommend', icon: 'home', label: 'Home' },
    { path: '/searchcookbook', icon: 'menu_book', label: 'Cookbook' },
    { path: '/kitchen', icon: 'kitchen', label: 'Kitchen', special: true },
    { path: '/grocery-run', icon: 'route', label: 'Shop' },
    { path: '/userprofile', icon: 'person', label: 'Profile' },
];

export default function UserLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-[#0e0e0e] pb-20 md:pb-0">
            <Outlet />

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 w-full flex justify-around items-end pb-3 pt-2 bg-[#0e0e0e]/95 backdrop-blur-2xl z-50 border-t border-[#ffffff0a]">
                {NAV_ITEMS.map(item => (
                    item.special ? (
                        <button key={item.path} onClick={() => navigate(item.path)}
                            className="flex flex-col items-center -mt-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${isActive(item.path) ? 'bg-[#91f78e]' : 'bg-gradient-to-br from-[#91f78e] to-[#52b555]'} text-[#0e0e0e]`}>
                                <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                            </div>
                        </button>
                    ) : (
                        <button key={item.path} onClick={() => navigate(item.path)}
                            className={`flex flex-col items-center gap-0.5 py-1 ${isActive(item.path) ? 'text-[#91f78e]' : 'text-gray-500 hover:text-gray-300'}`}>
                            <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                            <span className="text-[9px] font-semibold uppercase tracking-widest">{item.label}</span>
                        </button>
                    )
                ))}
            </nav>
        </div>
    );
}
