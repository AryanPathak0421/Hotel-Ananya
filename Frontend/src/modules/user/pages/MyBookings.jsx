import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { Calendar, MapPin, ChevronLeft, Tag, CheckCircle2, Clock, BedDouble, Phone, X, AlertTriangle, Coffee } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const STATUS_CONFIG = {
    Confirmed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-100', dot: 'bg-emerald-500', icon: CheckCircle2 },
    Completed: { color: 'bg-slate-50 text-slate-500 border-slate-100', dot: 'bg-slate-400', icon: CheckCircle2 },
    Cancelled: { color: 'bg-red-50 text-red-600 border-red-100', dot: 'bg-red-500', icon: X },
    Pending: { color: 'bg-amber-50 text-amber-700 border-amber-100', dot: 'bg-amber-500', icon: Clock },
};

const TABS = ['All', 'Upcoming', 'Completed', 'Cancelled'];



const BookingCard = ({ booking, onManage }) => {
    const status = (booking.bookingStatus || 'pending').charAt(0).toUpperCase() + (booking.bookingStatus || 'pending').slice(1);
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    const Icon = cfg.icon;

    const ci = new Date(booking.checkIn);
    const co = new Date(booking.checkOut);
    const nightsStay = Math.max(1, Math.ceil((co - ci) / (1000 * 60 * 60 * 24)));
    const fmt = (d) => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500">
            {/* Image Strip */}
            <div className="relative h-32 overflow-hidden">
                <img src={booking.variant?.images?.[0] || booking.roomType?.images?.[0] || '/hero-luxury.jpg'} alt={booking.variant?.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent" />

                <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest backdrop-blur-md ${cfg.color}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
                    {status}
                </div>

                <div className="absolute bottom-3 left-3">
                    <p className="text-primary text-[8px] font-bold uppercase tracking-[0.3em] mb-1">{booking.roomType?.name}</p>
                    <h3 className="text-white font-serif text-sm tracking-tight">{booking.variant?.name}</h3>
                </div>
            </div>

            <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400">
                        <Tag size={10} className="text-primary" />
                        <span className="text-[8px] font-black uppercase tracking-widest">#{booking.bookingId}</span>
                    </div>
                    {booking.plan && (
                        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                            <Coffee size={10} className="text-primary" />
                            <span className="text-[8px] font-bold text-secondary uppercase tracking-tighter">
                                {booking.plan.ratePlan?.code ? `${booking.plan.ratePlan.code} - ` : ''}{booking.plan.planName}
                            </span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Arrival', value: fmt(booking.checkIn) },
                        { label: 'Departure', value: fmt(booking.checkOut) },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-slate-50/50 border border-slate-100 rounded-2xl p-3">
                            <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest block mb-1">{label}</span>
                            <p className="text-secondary text-[10px] font-bold">{value}</p>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div>
                        <p className="text-[7px] text-slate-400 font-bold uppercase tracking-widest mb-1">
                            {nightsStay} Night{nightsStay > 1 ? 's' : ''} · {booking.roomsCount} Unit{booking.roomsCount > 1 ? 's' : ''} · {booking.roomDetails?.reduce((s, r) => s + r.adults, 0)}A {booking.roomDetails?.reduce((s, r) => s + r.children, 0) > 0 ? `· ${booking.roomDetails?.reduce((s, r) => s + r.children, 0)}C` : ''}
                        </p>
                        <p className="text-emerald-600 font-mono font-black text-lg tracking-tighter">₹{booking.totalPrice.toLocaleString()}</p>
                    </div>
                    <button
                        onClick={() => onManage(booking)}
                        className="px-5 py-2.5 bg-secondary text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl active:scale-95 transition-all shadow-lg shadow-secondary/20 hover:bg-slate-800"
                    >
                        Manage
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyBookings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchBookings = async () => {
        if (!user) return;
        try {
            const { data } = await api.get(`/bookings/my/${user._id}`);
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, [user]);

    const handleCancel = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this reservation?')) return;
        setIsUpdating(true);
        try {
            await api.put(`/bookings/${bookingId}/status`, { status: 'cancelled' });
            await fetchBookings();
            setSelectedBooking(null);
        } catch (error) {
            alert('Error cancelling booking. Please contact support.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (!user) { navigate('/login'); return null; }
    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const filtered = activeTab === 'All' ? bookings : bookings.filter(b => {
        const s = (b.bookingStatus || 'pending').toLowerCase();
        if (activeTab === 'Upcoming') return s === 'confirmed' || s === 'pending';
        return s === activeTab.toLowerCase();
    });

    return (
        <div className="min-h-screen bg-slate-50 pb-6 md:pb-10 relative">
            {/* Details Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-secondary/80 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-b border-slate-100">
                            <div>
                                <p className="text-[7px] font-black text-primary uppercase tracking-[0.3em] mb-0.5">Reservation Archive</p>
                                <h3 className="font-serif italic text-base text-secondary lowercase">Booking Details</h3>
                            </div>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="w-8 h-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-secondary transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            <div className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                                <img
                                    src={selectedBooking.variant?.images?.[0] || '/hero-luxury.jpg'}
                                    className="w-16 h-16 object-cover rounded-xl"
                                />
                                <div>
                                    <p className="text-[8px] font-bold text-slate-400 uppercase">{selectedBooking.roomType?.name}</p>
                                    <h4 className="font-serif italic text-sm text-secondary leading-tight">{selectedBooking.variant?.name}</h4>
                                    <div className={`mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[6px] font-black uppercase tracking-widest ${STATUS_CONFIG[selectedBooking.bookingStatus.charAt(0).toUpperCase() + selectedBooking.bookingStatus.slice(1)]?.color}`}>
                                        {selectedBooking.bookingStatus}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-3">
                                    <div className="bg-white p-3 rounded-xl border border-slate-50 shadow-sm">
                                        <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Check In</p>
                                        <p className="text-secondary font-bold text-xs">{new Date(selectedBooking.checkIn).toLocaleDateString()}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-slate-50 shadow-sm">
                                        <p className="text-[7px] font-black text-slate-400 uppercase mb-1">Check Out</p>
                                        <p className="text-secondary font-bold text-xs">{new Date(selectedBooking.checkOut).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="bg-secondary p-4 rounded-xl text-white flex flex-col justify-between">
                                    <p className="text-[7px] font-black text-white/50 uppercase">Total Amount</p>
                                    <div>
                                        <p className="text-xl font-black font-mono tracking-tighter text-primary">₹{selectedBooking.totalPrice.toLocaleString()}</p>
                                        <p className="text-[6px] text-white/30 uppercase mt-0.5">Inclusive of Taxes</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h5 className="text-[8px] font-black text-secondary uppercase tracking-widest flex items-center gap-2">
                                    <BedDouble size={12} className="text-primary" /> Multi-Unit Breakdown
                                </h5>
                                {selectedBooking.roomDetails?.map((room, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                        <span className="text-[8px] font-bold text-slate-600">Unit {idx + 1} Configuration</span>
                                        <span className="text-[8px] font-black text-secondary uppercase italic">{room.adults} Adults · {room.children} Children</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 pt-0 flex gap-3">
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="flex-1 py-3 bg-slate-100 text-slate-600 font-black uppercase text-[9px] tracking-widest rounded-xl active:scale-95 transition-all"
                            >
                                Close Window
                            </button>
                            {(selectedBooking.bookingStatus === 'pending' || selectedBooking.bookingStatus === 'confirmed') && (
                                <button
                                    onClick={() => handleCancel(selectedBooking._id)}
                                    disabled={isUpdating}
                                    className="flex-1 py-3 bg-red-500 text-white font-black uppercase text-[9px] tracking-widest rounded-xl shadow-xl shadow-red-500/20 active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isUpdating ? 'Modifying...' : 'Cancel'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white border-b border-slate-50/50 px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
                <button onClick={() => navigate('/profile')}
                    className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 active:scale-90 transition-all hover:text-secondary">
                    <ChevronLeft size={16} />
                </button>
                <div>
                    <p className="text-[7px] font-bold text-primary uppercase tracking-[0.4em]">Reservation History</p>
                    <h1 className="text-xs font-bold text-secondary uppercase tracking-widest">My Bookings</h1>
                </div>
                <div className="ml-auto bg-primary/5 text-primary px-2.5 py-1.5 rounded-lg border border-primary/10">
                    <span className="text-[8px] font-bold uppercase tracking-widest">{bookings.length} Total</span>
                </div>
            </div>

            <div className="max-w-2xl mx-auto px-4 pt-4 space-y-4">
                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: 'Confirmed', count: bookings.filter(b => b.bookingStatus === 'confirmed').length, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                        { label: 'Completed', count: bookings.filter(b => b.bookingStatus === 'completed').length, color: 'text-slate-500 bg-slate-50 border-slate-100' },
                        { label: 'Cancelled', count: bookings.filter(b => b.bookingStatus === 'cancelled').length, color: 'text-red-500 bg-red-50 border-red-100' },
                    ].map(({ label, count, color }) => (
                        <div key={label} className={`py-4 px-2 rounded-2xl border text-center ${color} shadow-sm`}>
                            <p className="text-xl font-black font-mono tracking-tighter">{count}</p>
                            <p className="text-[7px] font-black uppercase tracking-[0.2em] mt-1 opacity-60">{label}</p>
                        </div>
                    ))}
                </div>

                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {TABS.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`flex-shrink-0 px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all active:scale-95
                                ${activeTab === tab ? 'bg-secondary text-white' : 'bg-white border border-slate-200 text-slate-400 hover:border-primary/30'}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Booking Cards */}
                {filtered.length > 0 ? (
                    <div className="space-y-4">
                        {filtered.map(b => <BookingCard key={b._id} booking={b} onManage={setSelectedBooking} />)}
                    </div>
                ) : (
                    <div className="py-20 text-center space-y-2">
                        <BedDouble size={32} className="text-slate-200 mx-auto" />
                        <p className="text-secondary font-serif text-base">No bookings found</p>
                        <p className="text-slate-400 text-[10px] font-medium tracking-tight">Your recent stays and history will appear here.</p>
                        <button onClick={() => navigate('/rooms')}
                            className="mt-4 px-6 py-2.5 bg-secondary text-white rounded-lg text-[9px] font-bold uppercase tracking-widest hover:bg-primary transition-all active:scale-95">
                            Browse Rooms
                        </button>
                    </div>
                )}

                {/* Support banner */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-white text-primary rounded-lg flex items-center justify-center flex-shrink-0 border border-slate-100">
                        <Phone size={16} />
                    </div>
                    <div className="flex-1">
                        <p className="text-secondary font-bold text-xs">Help & Support</p>
                        <p className="text-slate-400 text-[9px] mt-0.5">24/7 priority assistance for all guests.</p>
                    </div>
                    <button onClick={() => navigate('/contact')}
                        className="px-4 py-2 bg-secondary text-white text-[8px] font-bold uppercase tracking-widest rounded-lg active:scale-90 transition-all hover:bg-primary">
                        Contact
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyBookings;

