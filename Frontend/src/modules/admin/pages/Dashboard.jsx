import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../../services/api';
import {
    Users, BedDouble, CalendarCheck, IndianRupee,
    TrendingUp, TrendingDown, Clock, ChevronRight, AlertCircle, ArrowUpRight, ArrowDownRight, Calendar
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentBookings, setRecentBookings] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, bookingsRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/bookings')
                ]);
                setStats(statsRes.data || null);
                const bookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : [];
                setRecentBookings([...bookings].reverse().slice(0, 5));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center p-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const statCards = [
        { label: 'Total Volume', value: stats?.totalBookings || 0, sub: 'Confirmed lifecycle', icon: CalendarCheck, color: 'text-emerald-600 bg-emerald-50' },
        { label: 'Occupancy Delta', value: `${stats?.occupancyRate || 0}%`, sub: `${stats?.occupiedCount || 0}/${stats?.totalRooms || 0} active nodes`, icon: TrendingUp, color: 'text-primary bg-primary/10' },
        { label: 'Node Departure', value: stats?.checkOuts || 0, sub: 'Terminal checkout today', icon: Clock, color: 'text-rose-600 bg-rose-50' },
        { label: 'Net Liquidity', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, sub: 'Historical gross valuation', icon: IndianRupee, color: 'text-amber-600 bg-amber-50' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 max-w-[1400px] mx-auto">
            {/* Intel Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                {statCards.map(stat => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group relative overflow-hidden active:scale-95 duration-500">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                            <div className="flex justify-between items-start mb-4 lg:mb-6 relative z-10">
                                <div className={`p-3 lg:p-4 rounded-2xl ${stat.color} transition-all group-hover:shadow-lg shadow-sm border border-transparent group-hover:border-white/50`}>
                                    <Icon size={20} className="lg:w-6 lg:h-6" />
                                </div>
                                <span className="flex items-center gap-1.5 text-[8px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100 uppercase tracking-widest">
                                    <TrendingUp size={10} /> +12%
                                </span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-2xl lg:text-4xl font-black text-secondary tracking-tighter tabular-nums mb-1 lg:mb-2">{stat.value}</p>
                                <div className="space-y-1">
                                    <p className="text-[8px] lg:text-[9px] font-black text-slate-400 uppercase tracking-widest lg:tracking-[0.3em] leading-none mb-1">{stat.label}</p>
                                    <p className="text-[7px] lg:text-[8px] text-slate-300 font-bold italic tracking-tight">{stat.sub}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
                {/* Main Manifest: Guest Arrivals */}
                <div className="lg:col-span-2 space-y-6 lg:space-y-8">
                    <div className="bg-white border border-slate-100 rounded-[2rem] lg:rounded-[3rem] p-6 lg:p-10 shadow-sm overflow-hidden relative">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 lg:mb-10 pb-6 border-b border-slate-50 gap-4">
                            <div>
                                <h3 className="text-xl lg:text-2xl font-black text-secondary tracking-tight lowercase">Guest <span className="text-primary italic">manifest.</span></h3>
                                <p className="text-[9px] lg:text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">Live synchronization in progress</p>
                            </div>
                            <Link to="/admin/bookings" className="w-full sm:w-auto text-center bg-slate-50 text-[8px] font-black text-secondary uppercase tracking-[0.2em] py-3 px-6 rounded-2xl hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-2 group shadow-sm">
                                Full Registry <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="space-y-4 lg:space-y-6">
                            {recentBookings.length > 0 ? recentBookings.map((bk) => (
                                <div key={bk.id || bk._id} className="p-4 lg:p-6 rounded-[1.5rem] lg:rounded-[2.5rem] bg-slate-50/30 border border-slate-100/50 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 flex flex-col md:flex-row items-start md:items-center gap-4 lg:gap-8 group">
                                    <div className="flex items-center gap-4 w-full md:w-auto">
                                        <div className="w-12 h-12 lg:w-16 lg:h-16 bg-secondary text-primary rounded-xl lg:rounded-[1.5rem] flex items-center justify-center text-xl lg:text-2xl font-serif font-black shadow-2xl shadow-secondary/20 shrink-0 group-hover:scale-110 transition-transform duration-500 rotate-3 group-hover:rotate-0">
                                            {bk.user?.name?.[0] || '?'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-black text-secondary text-xs lg:text-sm uppercase tracking-tight truncate max-w-[120px] lg:max-w-none">{bk.user?.name}</h4>
                                                <span className={`text-[6px] lg:text-[7px] px-2 lg:px-2.5 py-0.5 lg:py-1 rounded-full font-black uppercase tracking-widest border ${bk.bookingStatus === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}>
                                                    {bk.bookingStatus}
                                                </span>
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest italic">{bk.bookingId}</p>
                                                <p className="text-[8px] text-primary font-black uppercase tracking-tight leading-none truncate max-w-[200px]">{bk.plan?.planName}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="hidden sm:flex items-center gap-4 lg:gap-6 border-l md:border-x border-slate-100/50 px-4 md:px-8 py-1">
                                        <div className="text-center">
                                            <p className="text-[6px] lg:text-[7px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Inbound</p>
                                            <div className="bg-white text-secondary px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl shadow-sm border border-slate-50">
                                                <p className="text-sm lg:text-base font-black tabular-nums">{new Date(bk.checkIn).getDate()}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={12} className="text-primary/30" />
                                        <div className="text-center">
                                            <p className="text-[6px] lg:text-[7px] font-black text-slate-300 uppercase tracking-widest mb-1 italic">Outbound</p>
                                            <div className="bg-white text-secondary px-2 lg:px-3 py-1 lg:py-1.5 rounded-lg lg:rounded-xl shadow-sm border border-slate-50">
                                                <p className="text-sm lg:text-base font-black tabular-nums">{new Date(bk.checkOut).getDate()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto md:text-right md:ml-auto flex items-center md:items-end justify-between md:flex-col mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                                        <div className="md:hidden flex items-center gap-2">
                                            <Calendar size={12} className="text-slate-300" />
                                            <span className="text-[8px] font-bold text-slate-400 uppercase">{new Date(bk.checkIn).toLocaleDateString()}</span>
                                        </div>
                                        <div>
                                            <p className="text-[7px] lg:text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 italic text-right">Valuation</p>
                                            <p className="text-lg lg:text-xl font-black text-secondary tracking-tighter tabular-nums leading-none">₹{bk.totalPrice?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            )) : (
                                <div className="p-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200">
                                        <CalendarCheck size={32} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No active stay manifestations found today.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Performance & Revenue Visualization */}
                <div className="space-y-8">
                    <div className="bg-secondary rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-secondary/20">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 transition-transform hover:scale-110" />
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h3 className="font-serif italic text-2xl">Liquidity Flow</h3>
                                <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mt-1">Last 7 Days Valuation</p>
                            </div>
                            <IndianRupee className="text-primary" size={32} />
                        </div>
                        <div className="flex items-end gap-1.5 h-32 mb-6">
                            {[30, 45, 25, 60, 85, 40, 70].map((h, i) => (
                                <div key={i} className="flex-1 bg-white/5 hover:bg-primary transition-all rounded-t-lg group relative cursor-pointer" style={{ height: `${h}%` }}>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white text-secondary text-[8px] font-black px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">₹{h * 200}</div>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-between items-center pt-6 border-t border-white/5">
                            <div>
                                <p className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-1">Projected EBITDA</p>
                                <p className="text-lg font-black text-white leading-none">₹8,45,200</p>
                            </div>
                            <div className="text-right">
                                <p className="text-emerald-400 text-xs font-black">+24.8% <TrendingUp size={12} className="inline ml-1" /></p>
                                <p className="text-white/20 text-[8px] uppercase font-black">Since Q1 Sync</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 flex flex-col items-center text-center">
                        <Calendar size={40} className="text-primary mb-4" />
                        <h4 className="text-secondary font-bold text-lg leading-tight uppercase tracking-tighter">Availability Shift</h4>
                        <p className="text-slate-500 text-[10px] font-medium italic mt-1 leading-relaxed max-w-[200px]">Inventory is tightening for the upcoming festival weekend.</p>
                        <Link to="/admin/inventory/availability" className="mt-6 bg-secondary text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-xl shadow-secondary/20">
                            Check Inventory Grid
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;


