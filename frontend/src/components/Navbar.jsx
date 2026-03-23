import { Link, useLocation } from 'react-router-dom';
import { Home, List, User } from 'lucide-react';

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 glass rounded-full px-6 py-3 flex items-center justify-between gap-8 z-50 shadow-2xl shadow-primary/10">
            <NavItem to="/" icon={<Home size={24} />} active={location.pathname === '/'} />
            <NavItem to="/groceries" icon={<List size={24} />} active={location.pathname === '/groceries'} />
            <NavItem to="/profile" icon={<User size={24} />} active={location.pathname === '/profile'} />
        </nav>
    );
}

function NavItem({ to, icon, active }) {
    return (
        <Link
            to={to}
            className={`p-3 rounded-full transition-all duration-300 ${active ? 'bg-primary/20 text-primary' : 'text-on-surface-variant hover:text-white'}`}
        >
            {icon}
        </Link>
    );
}
