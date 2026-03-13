import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Bed, Ticket, Users, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const sidebarLinks = [
        { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
        { name: 'Rooms Mgmt', path: '/admin/rooms', icon: Bed },
        { name: 'Bookings', path: '/admin/bookings', icon: Ticket },
        { name: 'Discounts', path: '/admin/discounts', icon: Ticket },
        { name: 'Transactions', path: '/admin/wallet', icon: Wallet },
        { name: 'Users', path: '/admin/users', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <aside className="w-64 bg-secondary text-white flex flex-col">
                <div className="p-8 border-b border-white/10 flex flex-col items-center">
                    <img src="/logo.png" alt="Ananya Hotel" className="h-12 w-auto brightness-0 invert mb-2" />
                    <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary">Admin Panel</span>
                </div>

                <nav className="flex-grow p-4 space-y-2 mt-4">
                    {sidebarLinks.map((link) => {
                        const Icon = link.icon;
                        const isActive = location.pathname === link.path;
                        return (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-primary text-secondary' : 'hover:bg-white/10'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{link.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout Admin</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto">
                <header className="bg-white h-16 border-b flex items-center justify-between px-8 sticky top-0 z-10">
                    <h1 className="text-lg font-semibold text-secondary lowercase capitalize">
                        {location.pathname.split('/').pop() || 'Dashboard'}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm font-bold text-secondary">System Admin</p>
                            <p className="text-xs text-slate-500">Superuser Access</p>
                        </div>
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-secondary font-bold">
                            SA
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
