import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, ChevronLeft, CreditCard, Tag, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const MyBookings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Sample data - in a real app, this would come from an API
    const [bookings] = useState([
        {
            id: 'BK-7892',
            roomName: 'Double Bed A/C Deluxe',
            checkIn: 'Mar 15, 2026',
            checkOut: 'Mar 18, 2026',
            status: 'Confirmed',
            totalPrice: 7500,
            image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'
        },
        {
            id: 'BK-4521',
            roomName: 'Deluxe Triple Bed',
            checkIn: 'Jan 10, 2026',
            checkOut: 'Jan 12, 2026',
            status: 'Completed',
            totalPrice: 4200,
            image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80'
        }
    ]);

    if (!user) {
        navigate('/login');
        return null;
    }

    return (
        <div className="pt-0 pb-20 bg-cream min-h-screen">
            <div className="section-container max-w-4xl">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-12">
                    <button
                        onClick={() => navigate('/profile')}
                        className="p-3 bg-white rounded-2xl border border-slate-100 text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-serif text-secondary">My <span className="text-primary italic">Bookings</span></h1>
                        <p className="text-slate-400 text-sm mt-1 uppercase tracking-[0.2em] font-bold">Your journey at Ananya</p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex space-x-8 border-b border-slate-200 mb-10 overflow-x-auto pb-4 scrollbar-hide">
                    {['All Bookings', 'Upcoming', 'Completed', 'Cancelled'].map((tab, idx) => (
                        <button
                            key={tab}
                            className={`whitespace-nowrap pb-2 text-sm font-bold uppercase tracking-widest transition-all ${idx === 0 ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-secondary'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Booking List */}
                <div className="space-y-8">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-luxury border border-slate-50 flex flex-col md:flex-row group transition-all duration-500 hover:shadow-2xl">
                            {/* Room Image */}
                            <div className="md:w-1/3 h-64 md:h-auto relative overflow-hidden">
                                <img src={booking.image} alt={booking.roomName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg ${booking.status === 'Confirmed' ? 'bg-green-500 text-white' : 'bg-slate-500 text-white'
                                        }`}>
                                        {booking.status}
                                    </span>
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div className="flex-1 p-8 md:p-10 flex justify-between flex-col md:flex-row gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center space-x-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-2">
                                            <Tag size={12} />
                                            <span>ID: {booking.id}</span>
                                        </div>
                                        <h3 className="text-2xl font-serif text-secondary">{booking.roomName}</h3>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 text-slate-400">
                                                <Calendar size={14} className="text-primary" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Check In</span>
                                            </div>
                                            <p className="font-bold text-secondary">{booking.checkIn}</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2 text-slate-400">
                                                <Calendar size={14} className="text-primary" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Check Out</span>
                                            </div>
                                            <p className="font-bold text-secondary">{booking.checkOut}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 pt-4 text-slate-400 text-xs italic">
                                        <MapPin size={12} className="text-primary" />
                                        <span>Ananya Hotel, New Digha</span>
                                    </div>
                                </div>

                                <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-slate-100 pt-8 md:pt-0 md:pl-10">
                                    <div className="text-right">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Paid</p>
                                        <p className="text-3xl font-black text-secondary">₹{booking.totalPrice.toLocaleString()}</p>
                                    </div>
                                    <div className="flex flex-col space-y-3 w-full sm:w-auto">
                                        <button className="btn-premium !py-3 !text-[9px] !px-8 shadow-none">View Invoice</button>
                                        {booking.status === 'Confirmed' && (
                                            <button className="text-[9px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Cancel Booking</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State Help */}
                <div className="mt-16 p-12 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center space-y-4">
                    <p className="text-secondary font-serif italic text-lg">Need help with your stay?</p>
                    <p className="text-slate-400 text-xs font-light max-w-sm mx-auto">Our guest support team is available 24/7 to assist you with any modifications or special requests.</p>
                    <button className="text-primary font-bold text-[10px] uppercase tracking-widest border-b border-primary pt-4 pb-1">Contact Guest Support</button>
                </div>
            </div>
        </div>
    );
};

export default MyBookings;
