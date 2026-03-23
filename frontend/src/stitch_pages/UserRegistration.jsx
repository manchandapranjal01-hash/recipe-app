import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function UserRegistration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Account created! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">

        <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-md z-10">

          <div className="mb-10 text-center">
            <span className="font-headline font-extrabold text-2xl italic text-primary tracking-tight">The Edible Editorial</span>
            <p className="text-on-surface-variant text-sm tracking-widest uppercase mt-2 opacity-80">Verdant Harvest</p>
          </div>
          <div className="space-y-2 mb-8">
            <h1 className="font-headline font-bold text-4xl md:text-5xl tracking-tight leading-tight">
              Join the <span className="editorial-gradient-text italic">Editorial</span>.
            </h1>
            <p className="text-on-surface-variant body-md max-w-[80%]">Curate your kitchen with world-class recipes and premium groceries.</p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>

            {error && (
              <div className="p-3 bg-red-900/30 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">error</span>
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-900/30 border border-green-500/30 rounded-xl text-green-300 text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-lg">check_circle</span>
                {success}
              </div>
            )}

            <div className="space-y-4">
              <div className="group">
                <label className="block text-on-surface-variant font-label text-xs uppercase tracking-widest mb-2 px-1">Full Name</label>
                <div className="relative">
                  <input
                    className="w-full h-14 bg-surface-container-low border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/30 focus:bg-surface-bright transition-all placeholder:text-outline/50"
                    placeholder="Priya Sharma"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-on-surface-variant font-label text-xs uppercase tracking-widest mb-2 px-1">Email Address</label>
                <div className="relative">
                  <input
                    className="w-full h-14 bg-surface-container-low border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/30 focus:bg-surface-bright transition-all placeholder:text-outline/50"
                    placeholder="hello@edible-editorial.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="group">
                <label className="block text-on-surface-variant font-label text-xs uppercase tracking-widest mb-2 px-1">Password</label>
                <div className="relative">
                  <input
                    className="w-full h-14 bg-surface-container-low border-none rounded-xl px-4 focus:ring-2 focus:ring-primary/30 focus:bg-surface-bright transition-all placeholder:text-outline/50"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-on-surface-variant font-label text-xs uppercase tracking-widest mb-4 px-1">Personalize Your Feed</label>
              <div className="flex flex-wrap gap-3">
                <label className="cursor-pointer">
                  <input className="hidden peer" type="checkbox" />
                  <div className="px-5 py-2.5 rounded-full border border-outline-variant peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-transparent transition-all font-label text-sm">
                    Vegetarian
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input className="hidden peer" type="checkbox" />
                  <div className="px-5 py-2.5 rounded-full border border-outline-variant peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-transparent transition-all font-label text-sm">
                    Jain
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input defaultChecked className="hidden peer" type="checkbox" />
                  <div className="px-5 py-2.5 rounded-full border border-outline-variant peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-transparent transition-all font-label text-sm">
                    South Indian
                  </div>
                </label>
                <label className="cursor-pointer">
                  <input className="hidden peer" type="checkbox" />
                  <div className="px-5 py-2.5 rounded-full border border-outline-variant peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-transparent transition-all font-label text-sm">
                    Mughlai
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-4">
              <button
                className="w-full h-16 bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-headline font-bold text-lg rounded-full shadow-lg shadow-primary/10 hover:shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Account'}
                <span className="material-symbols-outlined">{loading ? 'hourglass_empty' : 'arrow_forward'}</span>
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-on-surface-variant body-sm">
              Already a curator?
              <Link className="text-primary font-bold ml-1 hover:underline" to="/login">Log In</Link>
            </p>
          </div>

          <div className="mt-12 opacity-40 text-[10px] text-center uppercase tracking-widest leading-loose">
            By creating an account, you agree to our <br />
            <a className="underline" href="#">Terms of Service</a> &amp; <a className="underline" href="#">Privacy Policy</a>
          </div>
        </div>

        <div className="hidden lg:block absolute right-12 bottom-12 w-64 aspect-[4/5] bg-surface-container-high rounded-3xl overflow-hidden shadow-2xl rotate-3 translate-y-6">
          <img alt="Fresh ingredients layout" className="w-full h-full object-cover grayscale-[20%] brightness-90 hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9eT5uRYkm6LDOnjZawV-a7sWdG4UPDPBnyy2vkdNV0Y1B6gxo4ZGO-_FFCJiZRfOfu9TDo7Yn2FvrGmX6cmiZ-LptAEsQWv81vp4oEzQ50vGERpb48a_gmefXy2FRxtdQ1CAzNUAyPDdca-pV-Pp0AAHTqFyPVbb9VtzVTYDzP6bNkDpyxutmbGzP_VbXKWPCVFCFTBdZlYTO6DHVOunHUY6QqxdcE4KeCISUHVvNh1Ts64PFgC40uxSoImrUCdp8MBqHt2c8_QGj" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-tertiary font-headline font-bold text-lg italic">The Harvest Issue</span>
            <p className="text-on-surface text-xs mt-1">Discover seasonal curation</p>
          </div>
        </div>
      </main>

    </>
  );
}
