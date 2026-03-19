import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Bed, Ticket, Users, Wallet, LogOut,
    Settings, ShieldCheck, Tag, Zap, Percent, Building2, HardDrive, Image, Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const sections = [
        {
            title: 'Operations',
            links: [
                { name: 'Insights', path: '/admin', icon: LayoutDashboard },
                { name: 'Bookings', path: '/admin/bookings', icon: Ticket },
                { name: 'Guest Ledger', path: '/admin/users', icon: Users },
                { name: 'Financials', path: '/admin/wallet', icon: Wallet },
            ]
        },
        {
            title: 'Inventory',
            links: [
                { name: 'Room Types', path: '/admin/rooms', icon: Bed },
                { name: 'Room Variants', path: '/admin/rooms/variants', icon: Layers },
                { name: 'Availability', path: '/admin/inventory/availability', icon: HardDrive },
                { name: 'Yield Rates', path: '/admin/inventory/rates', icon: Zap },
            ]
        },
        {
            title: 'Configuration',
            links: [
                { name: 'Promotions', path: '/admin/discounts', icon: Tag },
                { name: 'Tax Registry', path: '/admin/setup/taxes', icon: Percent },
                { name: 'Service Charges', path: '/admin/setup/charges', icon: ShieldCheck },
                { name: 'Rate Plans', path: '/admin/setup/rate-plans', icon: Zap },
                { name: 'Media Assets', path: '/admin/media', icon: Image },
                { name: 'Property Info', path: '/admin/setup/property', icon: Building2 },
            ]
        }
    ];

    return (
        <div className="flex h-screen bg-slate-50 font-sans">
            {/* Sidebar */}
            <aside className="w-72 bg-secondary text-white flex flex-col shadow-2xl z-20">
                <div className="p-8 border-b border-white/5 flex flex-col items-center shrink-0">
                    <img src="/logo.png" alt="Ananya Hotel" className="h-10 w-auto brightness-0 invert mb-3" />
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-[0.4em] text-primary">Intelligence Portal</span>
                    </div>
                </div>

                <nav className="flex-grow overflow-y-auto custom-scrollbar p-6 space-y-8 mt-2">
                    {sections.map((section) => (
                        <div key={section.title} className="space-y-3">
                            <h3 className="px-4 text-[10px] uppercase font-black tracking-[0.2em] text-white/30">{section.title}</h3>
                            <div className="space-y-1">
                                {section.links.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = location.pathname === link.path;
                                    return (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            className={`flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 group ${isActive
                                                ? 'bg-primary text-secondary shadow-lg shadow-primary/20 scale-[1.02]'
                                                : 'text-white/60 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <Icon size={18} className={`${isActive ? 'text-secondary' : 'text-primary/60 group-hover:text-primary'} transition-colors`} />
                                            <span className="text-sm font-bold tracking-tight">{link.name}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5 bg-secondary/50 backdrop-blur-xl">
                    <button
                        onClick={logout}
                        className="flex items-center justify-center space-x-3 w-full px-4 py-3.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-2xl transition-all duration-500 group shadow-inner"
                    >
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Terminate Session</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow flex flex-col overflow-hidden">
                <header className="bg-white/80 backdrop-blur-md h-20 border-b flex items-center justify-between px-10 sticky top-0 z-10">
                    <div className="flex flex-col">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">System Node</p>
                        <h1 className="text-xl font-black text-secondary lowercase capitalize tracking-tighter">
                            {location.pathname.split('/').pop()?.replace('-', ' ') || 'Insights Overview'}
                        </h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <button className="hidden lg:flex items-center gap-2 bg-amber-500 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-lg shadow-amber-500/20">
                            <Building2 size={14} /> Switch Property
                        </button>

                        <div className="hidden md:flex items-center gap-3 pr-6 border-r border-slate-100">
                            <div className="text-right">
                                <p className="text-xs font-black text-secondary leading-none">Security Protocol</p>
                                <p className="text-[10px] text-emerald-500 font-bold mt-1">Status: Active & Secure</p>
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                <ShieldCheck size={18} />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4 group cursor-pointer">
                            <div className="text-right">
                                <p className="text-sm font-extrabold text-secondary group-hover:text-primary transition-colors italic">Super Administrator</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Level 1 Authentication</p>
                            </div>
                            <div className="w-12 h-12 bg-secondary text-primary rounded-2xl flex items-center justify-center font-black text-lg border-2 border-primary/20 group-hover:border-primary transition-all shadow-lg shadow-secondary/10">
                                SA
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-grow overflow-y-auto p-10 bg-slate-50/50 custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

