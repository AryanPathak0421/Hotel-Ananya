import { Link, useLocation } from 'react-router-dom';
import { Home, Bed, Wallet, User, Image, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const BottomNavbar = () => {
    const location = useLocation();
    const { user } = useAuth();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Rooms', path: '/rooms', icon: Bed },
        { name: 'Wallet', path: '/wallet', icon: Wallet },
        { name: 'Gallery', path: '/gallery', icon: Image },
        { name: 'Profile', path: user ? '/profile' : '/login', icon: User },
    ];

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-100 z-[100] pb-safe">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`flex flex-col items-center justify-center space-y-1 min-w-[64px] transition-all ${isActive ? 'text-primary scale-110' : 'text-slate-400'
                                }`}
                        >
                            <Icon size={20} className={isActive ? 'fill-primary/10' : ''} />
                            <span className="text-[10px] font-bold uppercase tracking-tight">{item.name}</span>
                            {isActive && <div className="w-1 h-1 bg-primary rounded-full absolute bottom-1"></div>}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavbar;
