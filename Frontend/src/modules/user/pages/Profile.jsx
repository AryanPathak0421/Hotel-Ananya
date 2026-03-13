import { useAuth } from '../../../context/AuthContext';
import { useWallet } from '../../../context/WalletContext';
import { User, Mail, Shield, LogOut, Settings, CreditCard, History, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, logout } = useAuth();
    const { balance } = useWallet();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="pt-32 pb-20 bg-cream min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-bold mb-4">Please log in to view your profile</h2>
                    <button onClick={() => navigate('/login')} className="btn-premium">Login Now</button>
                </div>
            </div>
        );
    }

    const menuItems = [
        { name: 'My Bookings', icon: History, path: '/profile/bookings' },
        { name: 'Wallet Settings', icon: CreditCard, path: '/wallet' },
        { name: 'Account Details', icon: Settings, path: '/profile/details' },
    ];

    return (
        <div className="pt-0 pb-20 bg-cream min-h-screen">
            <div className="section-container max-w-2xl">
                {/* Profile Header */}
                <div className="bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-100 mb-8">
                    <div className="bg-primary h-32 relative">
                        <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-3xl shadow-lg">
                            <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center text-primary font-serif text-3xl font-bold border-2 border-slate-50">
                                {user.name[0]}
                            </div>
                        </div>
                    </div>
                    <div className="pt-16 pb-8 px-8 flex justify-between items-end">
                        <div>
                            <h1 className="text-2xl font-bold text-secondary">{user.name}</h1>
                            <div className="flex items-center space-x-2 text-slate-400 text-sm mt-1">
                                <Mail size={14} />
                                <span>{user.email}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest mb-2">
                                <Shield size={10} className="mr-1" /> {user.role}
                            </span>
                            <p className="text-2xl font-black text-secondary">₹{balance.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Menu */}
                <div className="space-y-4">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.name}
                                onClick={() => item.path !== '#' && navigate(item.path)}
                                className="w-full bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:border-primary/50 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-secondary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Icon size={20} />
                                    </div>
                                    <span className="font-bold text-secondary">{item.name}</span>
                                </div>
                                <ChevronRight size={20} className="text-slate-300 group-hover:text-primary" />
                            </button>
                        );
                    })}

                    <button
                        onClick={() => {
                            logout();
                            navigate('/login');
                        }}
                        className="w-full bg-red-50 p-6 rounded-2xl border border-red-100 flex items-center justify-between group hover:bg-red-100 transition-all mt-8"
                    >
                        <div className="flex items-center space-x-4 text-red-600">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                                <LogOut size={20} />
                            </div>
                            <span className="font-bold">Sign Out</span>
                        </div>
                        <ChevronRight size={20} className="text-red-300" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
