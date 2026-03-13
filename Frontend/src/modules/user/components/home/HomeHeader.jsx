import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Bell, Search, User } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

const HomeHeader = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <div className="md:hidden sticky top-0 bg-white/95 backdrop-blur-xl z-50 border-b border-slate-100 px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-serif text-lg italic">a</div>
                    <div>
                        <p className="text-[10px] font-black tracking-widest text-secondary uppercase leading-none">Ananya</p>
                        <p className="text-[8px] font-bold text-primary tracking-widest uppercase">Luxury Hotels</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => navigate('/profile/details')}
                        className="p-2 text-secondary active:scale-95 transition-all"
                    >
                        <Settings size={18} strokeWidth={1.5} />
                    </button>
                    <button
                        onClick={() => navigate('/profile')}
                        className="p-2 text-secondary active:scale-95 transition-all"
                    >
                        <Bell size={18} strokeWidth={1.5} />
                    </button>
                    {user ? (
                        <div
                            onClick={() => navigate('/profile')}
                            className="w-8 h-8 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center text-[10px] font-black text-primary cursor-pointer active:scale-95 transition-all"
                        >
                            {user.name[0]}
                        </div>
                    ) : (
                        <button onClick={() => navigate('/login')} className="p-2 text-primary active:scale-95 transition-all"><User size={18} strokeWidth={1.5} /></button>
                    )}
                </div>
            </div>
            {/* App Search Bar */}
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={14} />
                <input
                    type="text"
                    placeholder="Search experiences, dining, suites..."
                    className="w-full bg-slate-100/80 border-transparent border focus:border-primary/20 focus:bg-white text-xs pl-10 pr-4 py-2.5 rounded-lg outline-none transition-all placeholder:text-slate-400 font-medium"
                />
            </div>
        </div>
    );
};

export default HomeHeader;
