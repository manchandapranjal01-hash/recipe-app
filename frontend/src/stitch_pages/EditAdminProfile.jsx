import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditAdminProfile() {
  const navigate = useNavigate();
  return (
    <>


      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-[#0e0e0e]/80 backdrop-blur-xl bg-gradient-to-b from-[#1a1a1a] to-transparent">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/adminprofile')} className="text-[#91f78e] active:scale-95 duration-200">
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>
          <h1 className="font-['Plus_Jakarta_Sans'] font-bold text-lg tracking-tight text-on-surface">Edit Profile</h1>
        </div>
        <button className="text-[#91f78e] font-bold active:scale-95 duration-200 hover:bg-[#1a1a1a] transition-colors px-4 py-1 rounded-full">
          Save
        </button>
      </header>
      <main className="pt-24 px-6 max-w-2xl mx-auto space-y-10">

        <section className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full ring-4 ring-primary/20 overflow-hidden bg-surface-container-high">
              <img alt="Julianne V." className="w-full h-full object-cover" data-alt="Professional headshot of a woman with dark hair" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClgj3uA5OZhp6LB_lDlduxiw9xPWtRDGCzHd-BSAc3Hl3DVeZNAdN27Ek6DhgD57EdEbqhkJJZ1GGhTyDiUsOCLl5q4Gmf9p8yGdAWjctFmkQ1YZyYg2osRcUbbmpyNboOh_Ex8HecXilDdBAVSsBQSqf9kcqhKSIoqie99066a-4Yk1KqBUMMsRymPEXxjClkrTq-Gg0SVUI93Iq_PHJyVtna1sajhybbJfefsi_sX_UrF-BA00-y3O8A0gHcldQfRlEe_6K1NMF6" />
            </div>
            <button className="absolute bottom-0 right-0 bg-primary text-on-primary p-2.5 rounded-full shadow-lg active:scale-90 transition-transform duration-200">
              <span className="material-symbols-outlined text-xl" data-icon="photo_camera">photo_camera</span>
            </button>
          </div>
          <p className="mt-4 font-headline font-bold text-xl text-on-surface">Julianne V.</p>
          <p className="text-on-surface-variant text-sm tracking-wide">System Administrator</p>
        </section>

        <section className="space-y-6">
          <div className="space-y-2">
            <label className="font-headline font-semibold text-sm text-primary tracking-wider uppercase ml-1">Full Name</label>
            <div className="bg-surface-container-low rounded-xl px-4 py-3 border-none focus-within:bg-surface-bright transition-all duration-300">
              <input className="bg-transparent border-none w-full text-on-surface focus:ring-0 font-body outline-none" type="text" value="Julianne V." />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-headline font-semibold text-sm text-primary tracking-wider uppercase ml-1">Email Address</label>
            <div className="bg-surface-container-low rounded-xl px-4 py-3 border-none focus-within:bg-surface-bright transition-all duration-300 flex items-center">
              <input className="bg-transparent border-none w-full text-on-surface focus:ring-0 font-body outline-none" type="email" value="j.valencia@verdant.com" />
              <span className="material-symbols-outlined text-on-surface-variant text-lg" data-icon="verified">verified</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-headline font-semibold text-sm text-primary tracking-wider uppercase ml-1">Phone Number</label>
            <div className="bg-surface-container-low rounded-xl px-4 py-3 border-none focus-within:bg-surface-bright transition-all duration-300">
              <input className="bg-transparent border-none w-full text-on-surface focus:ring-0 font-body outline-none" type="tel" value="+1 (555) 012-9021" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-headline font-semibold text-sm text-primary tracking-wider uppercase ml-1">Role</label>
            <div className="bg-surface-container-high rounded-xl px-4 py-3 border-none opacity-80 flex items-center justify-between">
              <span className="text-on-surface-variant font-body">System Administrator</span>
              <span className="material-symbols-outlined text-on-surface-variant text-lg" data-icon="lock">lock</span>
            </div>
          </div>
          <div className="space-y-2">
            <label className="font-headline font-semibold text-sm text-primary tracking-wider uppercase ml-1">Bio/About</label>
            <div className="bg-surface-container-low rounded-xl px-4 py-3 border-none focus-within:bg-surface-bright transition-all duration-300">
              <textarea className="bg-transparent border-none w-full text-on-surface focus:ring-0 font-body outline-none resize-none" rows="4">Passionate about streamlining digital operations and eco-conscious food systems. Managing high-scale logistics at Verdant since 2021.</textarea>
            </div>
          </div>
        </section>

        <section className="pt-4">
          <h2 className="font-headline font-bold text-lg mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary" data-icon="security">security</span>
            Security Settings
          </h2>
          <div className="bg-surface-container rounded-3xl p-6 flex items-center justify-between">
            <div>
              <p className="font-headline font-semibold text-on-surface">Password</p>
              <p className="text-on-surface-variant text-xs mt-1">Last changed 3 months ago</p>
            </div>
            <button className="bg-secondary text-on-secondary px-6 py-2.5 rounded-xl font-bold active:scale-95 transition-all text-sm shadow-lg shadow-secondary/10">
              Change Password
            </button>
          </div>
        </section>
      </main>

      <nav className="fixed bottom-0 w-full z-50 rounded-t-3xl bg-[#0e0e0e]/90 backdrop-blur-2xl no-border bg-[#1a1a1a] shadow-[0_-4px_24px_rgba(145,247,142,0.06)] flex justify-around items-center px-4 py-2 w-full">
        <a className="flex flex-col items-center justify-center text-[#adaaaa] p-3 hover:text-[#91f78e] transition-all active:scale-90 duration-300 ease-out" href="#">
          <span className="material-symbols-outlined" data-icon="explore">explore</span>
          <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[10px] uppercase tracking-widest mt-1">Explore</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#adaaaa] p-3 hover:text-[#91f78e] transition-all active:scale-90 duration-300 ease-out" href="#">
          <span className="material-symbols-outlined" data-icon="restaurant_menu">restaurant_menu</span>
          <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[10px] uppercase tracking-widest mt-1">Recipes</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#adaaaa] p-3 hover:text-[#91f78e] transition-all active:scale-90 duration-300 ease-out" href="#">
          <span className="material-symbols-outlined" data-icon="shopping_basket">shopping_basket</span>
          <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[10px] uppercase tracking-widest mt-1">Groceries</span>
        </a>
        <a className="flex flex-col items-center justify-center bg-gradient-to-br from-[#91f78e] to-[#52b555] text-[#0e0e0e] rounded-full p-3 mb-1 active:scale-90 duration-300 ease-out" href="#">
          <span className="material-symbols-outlined" data-icon="person" >person</span>
          <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[10px] uppercase tracking-widest mt-1">Profile</span>
        </a>
      </nav>

    </>
  );
}
