import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { useWallet } from '../../../context/WalletContext';
import {
    Calendar, Users, ShieldCheck, ArrowRight, CreditCard,
    Wifi, Coffee, Wind, Tv, ChevronLeft, Star, MapPin,
    BedDouble, Maximize2, CheckCircle2, ChevronRight, Info, Plus, X, ChevronDown
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../../services/api';

/* ─── helpers ─────────────────────────────────────── */
const nights = (ci, co) => {
    if (!ci || !co) return 1;
    const diff = (new Date(co) - new Date(ci)) / 86400000;
    return diff > 0 ? diff : 1;
};

const BookingFlow = () => {
    const { user } = useAuth();
    const { balance } = useWallet();
    const navigate = useNavigate();
    const location = useLocation();
    const room = location.state?.room;

    const [step, setStep] = useState(1);
    const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
    const [isAvailable, setIsAvailable] = useState(false);
    const [checking, setChecking] = useState(false);

    // Dynamic data
    const [variants, setVariants] = useState([]);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [availableCount, setAvailableCount] = useState(0);

    // Modal state (Guest details)
    const [numRooms, setNumRooms] = useState(1);
    const [roomDetails, setRoomDetails] = useState([{ adults: 2, children: 0 }]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [taxes, setTaxes] = useState([]);
    const [bookingId] = useState(`AN-${Math.floor(Math.random() * 90000) + 10000}`);

    useEffect(() => {
        if (room) {
            api.get(`/rooms/variants/${room._id}`).then(res => setVariants(res.data));
            api.get('/setup/taxes').then(res => setTaxes(res.data));
        }
    }, [room]);

    useEffect(() => {
        if (selectedVariant) {
            api.get(`/rooms/pricing/${selectedVariant._id}`).then(res => setPlans(res.data));
        }
    }, [selectedVariant]);

    // Load Razorpay Script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            if (document.body.contains(script)) document.body.removeChild(script);
        };
    }, []);

    useEffect(() => {
        const count = parseInt(numRooms) || 1;
        setRoomDetails(prev => {
            const next = [...prev];
            if (next.length < count) {
                for (let i = next.length; i < count; i++) next.push({ adults: 2, children: 0 });
            } else {
                return next.slice(0, count);
            }
            return next;
        });
    }, [numRooms]);

    const handleCheckAvailability = async (variant) => {
        if (!dates.checkIn || !dates.checkOut) return alert('Please select dates first');
        setChecking(true);
        try {
            const { data } = await api.post('/rooms/check-availability', {
                roomTypeId: room._id,
                variantId: variant._id,
                checkIn: dates.checkIn,
                checkOut: dates.checkOut
            });
            if (data.available) {
                setSelectedVariant(variant);
                setAvailableCount(data.availableCount);
                setStep(2); // Go to Plans
            } else {
                alert(`No ${variant.name} rooms available for these dates.`);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setChecking(false);
        }
    };

    const calculateRoomBase = (details, plan) => {
        let p = 0;
        if (details.adults === 1) p = plan.adult1Price;
        else if (details.adults === 2) p = plan.adult2Price;
        else p = plan.adult2Price + plan.extraAdultPrice;

        p += (details.children * plan.childPrice);
        return p;
    };

    const stayNights = nights(dates.checkIn, dates.checkOut);
    const totalBase = selectedPlan ? roomDetails.reduce((sum, d) => sum + calculateRoomBase(d, selectedPlan), 0) * stayNights : 0;
    const taxTotal = taxes.reduce((sum, t) => sum + (totalBase * t.rate / 100), 0);
    const grandTotal = totalBase + taxTotal;

    const handleWalletPayment = async () => {
        try {
            await api.post('/bookings', {
                userId: user._id,
                roomType: room._id,
                variant: selectedVariant._id,
                plan: selectedPlan._id,
                checkIn: dates.checkIn,
                checkOut: dates.checkOut,
                roomsCount: numRooms,
                roomDetails,
                totalPrice: grandTotal,
                bookingId
            });
            setStep(4);
        } catch (error) {
            alert(error.response?.data?.message || 'Booking failed');
        }
    };

    const handleRazorpayPayment = async () => {
        if (!window.Razorpay) {
            api.get('/rooms/categories'); // dummy to trigger refresh if script failed
            alert('Payment gateway is still loading. Please wait a few seconds.');
            return;
        }

        if (!user) {
            alert('Your session has expired. Please log in again to continue.');
            navigate('/login');
            return;
        }

        try {
            const { data: order } = await api.post('/payments/create-order', {
                amount: Math.round(grandTotal),
                receipt: bookingId
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: 'Hotel Ananya',
                description: `${selectedVariant?.name}: ${selectedPlan?.planName}`,
                order_id: order.id,
                handler: async (response) => {
                    try {
                        const { data: verifyData } = await api.post('/payments/verify-payment', response);
                        if (verifyData.success) {
                            await api.post('/bookings', {
                                userId: user._id,
                                roomType: room?._id,
                                variant: selectedVariant?._id,
                                plan: selectedPlan?._id,
                                checkIn: dates.checkIn,
                                checkOut: dates.checkOut,
                                roomsCount: numRooms,
                                roomDetails,
                                totalPrice: grandTotal,
                                bookingId,
                                paymentMethod: 'razorpay',
                                paymentId: response.razorpay_payment_id
                            });
                            setStep(4);
                        }
                    } catch (err) {
                        alert('Payment verification failed.');
                    }
                },
                prefill: { name: user?.name || '', email: user?.email || '' },
                theme: { color: '#1e293b' },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (r) => alert(`Payment Failure: ${r.error.description}`));
            rzp.open();

        } catch (error) {
            const serverMsg = error.response?.data?.message || 'Gateway unreachable';
            alert(`Payment Error: ${serverMsg}`);
        }
    };

    if (!room) return <div className="p-20 text-center"><button onClick={() => navigate('/rooms')} className="bg-secondary text-white px-8 py-3 rounded-xl">Go Back</button></div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <button
                    onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)}
                    className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-[7px] font-bold text-primary uppercase tracking-[0.4em]">Hotel Ananya</span>
                    <h2 className="text-xs font-bold text-secondary uppercase tracking-widest">
                        {step === 1 ? 'Select Variant' : step === 2 ? 'Choose Plan' : step === 3 ? 'Finalize' : 'Confirm'}
                    </h2>
                </div>
                <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-secondary font-bold text-[10px]">
                    {step}
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-6 mt-8">
                {step === 1 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Elegant Dates Header */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
                            <div className="flex flex-col md:flex-row gap-6 items-center">
                                <div className="flex-1 w-full grid grid-cols-2 gap-6 relative">
                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black text-primary uppercase tracking-[0.3em] block ml-1">Arrival</label>
                                        <div className="relative">
                                            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/50" />
                                            <input
                                                type="date"
                                                value={dates.checkIn}
                                                onChange={e => setDates({ ...dates, checkIn: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-3.5 text-[10px] font-black text-secondary outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em] block ml-1">Departure</label>
                                        <div className="relative">
                                            <Calendar size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                                            <input
                                                type="date"
                                                value={dates.checkOut}
                                                onChange={e => setDates({ ...dates, checkOut: e.target.value })}
                                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-10 pr-4 py-3.5 text-[10px] font-black text-secondary outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none uppercase"
                                            />
                                        </div>
                                    </div>
                                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 mt-3 hidden md:block">
                                        <div className="w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-primary shadow-sm">
                                            <ArrowRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Variants Header */}
                        <div className="flex items-center justify-between px-2">
                            <div>
                                <h3 className="font-serif italic text-2xl text-secondary lowercase">Select your <span className="text-primary">sanctuary.</span></h3>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Found {variants.length} available configurations</p>
                            </div>
                        </div>

                        {/* Variants Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {variants.map(v => (
                                <div key={v._id} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-md group hover:shadow-xl transition-all duration-500">
                                    <div className="h-60 relative overflow-hidden">
                                        <img src={v.images?.[0] || room.images?.[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 via-transparent to-transparent opacity-40" />

                                        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                                            {v.name.toLowerCase().includes('classic') && (
                                                <span className="bg-primary/90 text-white text-[7px] font-black px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm">Popular Choice</span>
                                            )}
                                            {v.name.toLowerCase().includes('beach') && (
                                                <span className="bg-emerald-500/90 text-white text-[7px] font-black px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm">Best View</span>
                                            )}
                                        </div>

                                        <div className="absolute bottom-5 left-6 right-6">
                                            <p className="text-primary text-[8px] font-black uppercase tracking-[0.4em] mb-1">{room.name}</p>
                                            <h3 className="text-white font-serif text-xl italic lowercase leading-tight">{v.name}</h3>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-6">
                                        <div className="flex items-center gap-4 py-1">
                                            {[
                                                { icon: Wifi, label: 'Wifi' },
                                                { icon: Wind, label: 'AC' },
                                                { icon: Tv, label: 'TV' },
                                                { icon: Coffee, label: 'Bar' }
                                            ].map(({ icon: Icon, label }) => (
                                                <div key={label} className="flex items-center gap-1.5 opacity-60">
                                                    <Icon size={12} className="text-secondary" />
                                                    <span className="text-[7px] font-bold text-secondary uppercase italic">{label}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex items-center justify-between gap-4 pt-2">
                                            <div className="flex gap-1.5">
                                                {v.amenities?.slice(0, 2).map(a => (
                                                    <span key={a} className="text-[6.5px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100/50">{a}</span>
                                                ))}
                                            </div>
                                            <button
                                                onClick={() => handleCheckAvailability(v)}
                                                disabled={checking}
                                                className="bg-secondary text-white py-2.5 px-5 rounded-2xl font-black uppercase tracking-widest text-[8px] hover:bg-primary transition-all flex items-center justify-center gap-2 shadow-lg shadow-secondary/10 group/btn"
                                            >
                                                {checking ? '...' : (
                                                    <>
                                                        Explore
                                                        <ArrowRight size={10} className="group-hover/btn:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-700">
                        <div className="text-center space-y-3">
                            <span className="text-primary text-[9px] font-black uppercase tracking-[0.5em] block">{selectedVariant?.name}</span>
                            <h2 className="text-3xl font-serif text-secondary lowercase italic">Explore our <span className="text-primary italic">offerings.</span></h2>
                            <p className="text-[8px] text-slate-400 font-black uppercase tracking-[0.2em]">Live availability: {availableCount} sanctuaries remaining</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {plans.map(plan => (
                                <div key={plan._id}
                                    onClick={() => { setSelectedPlan(plan); setIsModalOpen(true); }}
                                    className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
                                >
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                {plan.mealsIncluded?.toLowerCase().includes('room') ? <BedDouble size={24} /> : <Coffee size={24} />}
                                            </div>
                                            <div className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[6px] font-black uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Best Value</div>
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-secondary tracking-tight mb-2 group-hover:text-primary transition-colors">{plan.planName}</h3>
                                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-4 leading-relaxed">{plan.mealsIncluded}</p>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <Check size={10} className="text-emerald-500" />
                                                    <span className="text-[8px] font-medium text-slate-500 italic lowercase tracking-tight line-clamp-1">{plan.ratePlan?.inclusions || 'sanctuary access included'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-10 pt-6 border-t border-slate-50 flex items-center justify-between">
                                        <div>
                                            <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-1">Nightly rate</p>
                                            <p className="text-2xl font-black text-secondary tracking-tighter italic">₹{plan.adult2Price.toLocaleString()}</p>
                                        </div>
                                        <div className="w-10 h-10 bg-secondary text-white rounded-full flex items-center justify-center transition-all group-hover:bg-primary active:scale-90 shadow-lg shadow-secondary/10">
                                            <ChevronRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl space-y-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[8px] font-black text-primary uppercase tracking-[0.5em] mb-2">Final Step</p>
                                    <h1 className="text-3xl font-serif text-secondary lowercase italic leading-none">Complete your <span className="text-primary italic">reservation.</span></h1>
                                </div>
                                <ShieldCheck size={40} className="text-emerald-500/80" />
                            </div>

                            <div className="bg-slate-50/80 backdrop-blur-sm rounded-[2rem] p-8 border border-white shadow-inner grid grid-cols-2 gap-x-10 gap-y-6">
                                <div className="space-y-1.5">
                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em]">Sanctuary</p>
                                    <p className="text-[11px] font-black text-secondary uppercase tracking-tight italic">{selectedVariant?.name}</p>
                                </div>
                                <div className="space-y-1.5 text-right">
                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em]">Lifecycle</p>
                                    <p className="text-[10px] font-black font-mono text-secondary">{new Date(dates.checkIn).toLocaleDateString()} — {new Date(dates.checkOut).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-1.5">
                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em]">Tier Level</p>
                                    <p className="text-[11px] font-black text-primary uppercase tracking-tight italic line-clamp-1">{selectedPlan?.planName}</p>
                                </div>
                                <div className="space-y-1.5 text-right">
                                    <p className="text-[7px] font-black text-slate-400 uppercase tracking-[0.3em]">Stay Metrics</p>
                                    <p className="text-[11px] font-black text-secondary uppercase tracking-tight italic">{numRooms} Units · {stayNights} Nights</p>
                                </div>
                            </div>

                            <div className="space-y-4 px-2">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <span>Accommodation Summary</span>
                                    <span className="text-secondary tabular-nums">₹{totalBase.toLocaleString()}</span>
                                </div>
                                {taxes.map(t => (
                                    <div key={t._id} className="flex justify-between text-[10px] font-bold text-slate-400">
                                        <span className="uppercase tracking-widest italic">{t.name} ({t.rate}%)</span>
                                        <span className="text-secondary tabular-nums">₹{(totalBase * t.rate / 100).toLocaleString()}</span>
                                    </div>
                                ))}
                                <div className="pt-6 border-t border-slate-100 flex justify-between items-center">
                                    <p className="text-[10px] font-black text-secondary uppercase tracking-[0.4em]">Investment</p>
                                    <p className="text-4xl font-black text-emerald-600 tracking-tighter italic">₹{grandTotal.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                <button
                                    onClick={handleWalletPayment}
                                    className="bg-secondary text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-xl shadow-secondary/20 hover:bg-primary transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <CreditCard size={16} /> Wallet (₹{balance.toLocaleString()})
                                </button>
                                <button
                                    onClick={handleRazorpayPayment}
                                    className="bg-white text-secondary border-2 border-slate-100 py-4 rounded-2xl font-black uppercase tracking-widest text-[9px] hover:border-emerald-500/20 hover:bg-emerald-500/5 transition-all flex items-center justify-center gap-3 active:scale-95 group"
                                >
                                    <Zap size={16} className="text-amber-500 group-hover:scale-110 transition-transform" /> Razorpay Secured
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="max-w-md mx-auto text-center space-y-10 animate-in zoom-in-95 duration-1000">
                        <div className="relative inline-block">
                            <div className="w-28 h-28 bg-emerald-50 text-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner border border-emerald-100/50 rotate-3">
                                <CheckCircle2 size={56} className="animate-in fade-in zoom-in duration-700 delay-300 -rotate-3" />
                            </div>
                            <Sparkles size={24} className="absolute -top-2 -right-2 text-primary animate-pulse" />
                        </div>

                        <div className="space-y-3">
                            <h1 className="text-5xl font-serif text-secondary lowercase italic leading-none">Voucher <span className="text-primary italic">active.</span></h1>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em]">Stay Reference: {bookingId}</p>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl space-y-6 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12" />

                            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Sanctuary</span>
                                <span className="text-[11px] font-black text-secondary uppercase tracking-tight italic">{selectedVariant?.name}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Arrival</span>
                                <span className="text-[11px] font-black font-mono text-secondary tracking-tighter">{new Date(dates.checkIn).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Net Valuation</span>
                                <span className="text-[16px] font-black text-emerald-600 tracking-tighter italic">₹{grandTotal.toLocaleString()}</span>
                            </div>
                        </div>

                        <button onClick={() => navigate('/profile/bookings')} className="w-full bg-secondary text-white py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-secondary/20 hover:bg-primary transition-all active:scale-95">
                            Access My Archive
                        </button>
                    </div>
                )}
            </div>

            {isModalOpen && selectedPlan && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-secondary/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-[340px] rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="bg-slate-50 px-8 py-5 flex items-center justify-between border-b border-slate-100">
                            <div>
                                <p className="text-[7px] font-black text-primary uppercase tracking-[0.3em] mb-0.5">Configuration</p>
                                <h2 className="text-secondary text-base font-serif lowercase italic">Guest <span className="text-primary italic">Distribution.</span></h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-secondary transition-all">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">
                            <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-[9px] font-black text-secondary uppercase tracking-widest">Sanctuary Units</span>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setNumRooms(Math.max(1, numRooms - 1))}
                                        className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-secondary hover:border-primary/30 transition-all active:scale-90"
                                    ><ChevronLeft size={16} /></button>
                                    <span className="font-black text-lg w-6 text-center tabular-nums">{numRooms}</span>
                                    <button
                                        onClick={() => setNumRooms(Math.min(availableCount, numRooms + 1))}
                                        className="w-10 h-10 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-secondary hover:border-primary/30 transition-all active:scale-90"
                                    ><ChevronRight size={16} /></button>
                                </div>
                            </div>

                            <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                                {roomDetails.map((details, index) => (
                                    <div key={index} className="p-5 rounded-[2rem] border border-slate-100 bg-white shadow-sm space-y-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                            <span className="text-[8px] font-black text-secondary uppercase tracking-[0.2em]">Sanctuary No. {index + 1}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest block ml-1">Adults</label>
                                                <div className="relative">
                                                    <select
                                                        value={details.adults}
                                                        onChange={e => {
                                                            const copy = [...roomDetails];
                                                            copy[index].adults = parseInt(e.target.value);
                                                            setRoomDetails(copy);
                                                        }}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[10px] font-black text-secondary outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                                                    >
                                                        <option value="1">1 Person</option>
                                                        <option value="2">2 Persons</option>
                                                        <option value="3">3 (Extra)</option>
                                                    </select>
                                                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[7px] font-black text-slate-400 uppercase tracking-widest block ml-1">Children</label>
                                                <div className="relative">
                                                    <select
                                                        value={details.children}
                                                        onChange={e => {
                                                            const copy = [...roomDetails];
                                                            copy[index].children = parseInt(e.target.value);
                                                            setRoomDetails(copy);
                                                        }}
                                                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-[10px] font-black text-secondary outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                                                    >
                                                        <option value="0">None</option>
                                                        <option value="1">1 Child</option>
                                                        <option value="2">2 Children</option>
                                                    </select>
                                                    <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-8 bg-slate-50 flex flex-col gap-4 border-t border-slate-100">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Valuation</span>
                                <p className="text-2xl font-black text-secondary tracking-tighter italic">₹{totalBase.toLocaleString()}</p>
                            </div>
                            <button
                                onClick={() => { setIsModalOpen(false); setStep(3); }}
                                className="w-full bg-secondary hover:bg-primary text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-secondary/20"
                            >
                                Continue to Confirmation
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default BookingFlow;
