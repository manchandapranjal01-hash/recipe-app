import React, { useState } from 'react';
import { User, Bell, Shield, Settings, Power } from 'lucide-react';

export default function Profile() {
    const [dietaryPrefs, setDietaryPrefs] = useState({
        vegan: false,
        keto: true,
        glutenFree: false,
    });

    return (
        <div className="animate-fade-in space-y-8">
            <header className="pt-4">
                <h1 className="text-4xl font-display font-bold leading-tight mb-2 text-white">
                    Your <span className="text-primary italic font-serif">Profile</span>
                </h1>
                <p className="text-on-surface-variant">Manage your settings and dietary preferences.</p>
            </header>

            {/* User Info Card */}
            <section className="bg-surface-container rounded-xl p-6 flex items-center gap-6 shadow-2xl">
                <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center border-2 border-primary/20">
                    <User size={40} className="text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-display text-white mb-1">Alex Culinary</h2>
                    <p className="text-on-surface-variant">alex.culinary@example.com</p>
                </div>
            </section>

            {/* Dietary Preferences */}
            <section>
                <h3 className="text-xl font-display text-white mb-4">Dietary Preferences</h3>
                <div className="space-y-3">
                    {Object.entries(dietaryPrefs).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between bg-surface-container p-4 rounded-xl">
                            <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={value}
                                    onChange={() => setDietaryPrefs(prev => ({ ...prev, [key]: !prev[key] }))}
                                />
                                <div className="w-14 h-7 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-on-surface-variant peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </section>

            {/* Settings Menu */}
            <section>
                <h3 className="text-xl font-display text-white mb-4">Settings</h3>
                <div className="bg-surface-container rounded-xl overflow-hidden divide-y divide-surface-container-high">
                    <MenuItem icon={<Bell size={20} />} label="Notifications" />
                    <MenuItem icon={<Shield size={20} />} label="Privacy & Security" />
                    <MenuItem icon={<Settings size={20} />} label="General Settings" />
                </div>
            </section>

            <button className="w-full flex items-center justify-center gap-3 bg-surface-container-high text-error hover:bg-error/10 hover:text-error p-4 rounded-xl font-medium transition-colors mt-8">
                <Power size={20} />
                Sign Out
            </button>
        </div>
    );
}

function MenuItem({ icon, label }) {
    return (
        <button className="w-full flex items-center justify-between p-4 text-on-surface-variant hover:text-white hover:bg-surface-container-high transition-colors">
            <div className="flex items-center gap-4">
                {icon}
                <span className="font-medium text-white">{label}</span>
            </div>
            <span className="text-outline">&rarr;</span>
        </button>
    );
}
