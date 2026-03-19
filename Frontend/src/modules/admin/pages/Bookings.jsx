import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Search, Filter, Calendar, User, CreditCard, ChevronRight, CheckCircle, XCircle, Clock, Info } from 'lucide-react';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [loading, setLoading] = useState(true);

    const fetchBookings = async () => {
        try {
            const { data } = await api.get('/bookings');
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const updateStatus = async (id, newStatus) => {
        try {
            await api.put(`/bookings/${id}/status`, { status: newStatus });
            fetchBookings();
        } catch (error) { alert('Failed to update status'); }
    };

    const filtered = bookings.filter(bk => {
        const guestName = bk.user?.name || '';
        const bookingId = bk.bookingId || '';
        const matchesSearch = guestName.toLowerCase().includes(search.toLowerCase()) || bookingId.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'All Status' || bk.bookingStatus.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 text-left">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-secondary lowercase capitalize tracking-tight">Reservation <span className="text-primary italic">Ledger</span></h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Tracking {bookings.length} multifaceted guest stays.</p>
                </div>
            </header>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30 font-sans">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search guests, booking IDs..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100">
                            <Filter size={14} className="text-slate-400" />
                            <select
                                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option>All Status</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="pending">Pending</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 border-b border-slate-100">
                                <th className="px-8 py-5 text-left">Stay Signature</th>
                                <th className="px-6 py-5 text-left">Guest Profile</th>
                                <th className="px-6 py-5 text-center">Lifecycle</th>
                                <th className="px-6 py-5 text-left">Valuation</th>
                                <th className="px-8 py-5 text-right">Protocol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map((bk) => (
                                <tr key={bk._id} className="hover:bg-slate-50/80 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-1.5 h-12 bg-primary rounded-full" />
                                            <div>
                                                <p className="font-black text-secondary uppercase tracking-[0.1em] leading-none mb-1 text-sm">{bk.bookingId}</p>
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{bk.roomType?.name} · {bk.variant?.name} · {bk.roomsCount} Rooms</p>
                                                <p className="text-[9px] text-primary font-black uppercase tracking-widest mt-1">
                                                    {bk.plan?.ratePlan?.code ? `${bk.plan.ratePlan.code} - ` : ''}{bk.plan?.planName}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-secondary text-primary rounded-xl flex items-center justify-center font-black text-xs border border-primary/20">
                                                {bk.user?.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-secondary text-xs uppercase leading-none mb-1">{bk.user?.name}</p>
                                                <p className="text-[9px] text-slate-400 font-medium lowercase tracking-tighter">{bk.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col items-center justify-center">
                                            <span className="text-[10px] font-black text-secondary bg-slate-100 px-3 py-1 rounded-lg tabular-nums tracking-tighter">{bk.checkIn}</span>
                                            <ChevronRight size={10} className="my-1.5 text-primary rotate-90 md:rotate-0" />
                                            <span className="text-[10px] font-black text-primary bg-primary/5 px-3 py-1 rounded-lg tabular-nums tracking-tighter">{bk.checkOut}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <p className="font-black text-secondary text-sm font-mono tracking-tighter">₹{bk.totalPrice.toLocaleString()}</p>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1">via {bk.paymentMethod}</p>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${bk.bookingStatus === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                bk.bookingStatus === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                                                }`}>
                                                {bk.bookingStatus}
                                            </span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {bk.bookingStatus === 'pending' && <button onClick={() => updateStatus(bk._id, 'confirmed')} className="p-1.5 text-emerald-600 bg-emerald-50 rounded-lg"><CheckCircle size={12} /></button>}
                                                <button onClick={() => updateStatus(bk._id, 'cancelled')} className="p-1.5 text-rose-500 bg-rose-50 rounded-lg"><XCircle size={12} /></button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Bookings;
