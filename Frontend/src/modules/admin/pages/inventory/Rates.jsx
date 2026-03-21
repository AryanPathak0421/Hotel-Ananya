import React, { useState, useEffect } from 'react';
import api from '../../../../services/api';
import {
    ChevronLeft, ChevronRight, Save, Search,
    Users, Copy, ChevronDown
} from 'lucide-react';

const Rates = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [dates, setDates] = useState([]);
    const [matrix, setMatrix] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedRT, setSelectedRT] = useState('all');
    const [pendingUpdates, setPendingUpdates] = useState({}); // {roomTypeId-date: { planUpdates: [] }}

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/inventory/matrix?startDate=${startDate}&roomTypeId=${selectedRT}`);
            setDates(data.dates);
            setMatrix(data.matrix);
            setPendingUpdates({});
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        api.get('/rooms').then(res => setRoomTypes(res.data)).catch(console.error);
        fetchData();
    }, []);

    const navigateDate = (days) => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + days);
        setStartDate(d.toISOString().split('T')[0]);
        setLoading(true);
        api.get(`/inventory/matrix?startDate=${d.toISOString().split('T')[0]}&roomTypeId=${selectedRT}`)
            .then(res => {
                setDates(res.data.dates);
                setMatrix(res.data.matrix);
                setLoading(false);
            });
    };

    const updateRate = (rtId, date, planId, field, value) => {
        const key = `${rtId}-${date}`;

        setPendingUpdates(prev => {
            const next = { ...prev };
            const current = next[key] || { roomTypeId: rtId, date, planUpdates: [] };

            // Create a deep copy of planUpdates to avoid reference issues
            const planUpdates = JSON.parse(JSON.stringify(current.planUpdates));
            let planUpdate = planUpdates.find(p => p.planId === planId);
            if (!planUpdate) {
                planUpdate = { planId };
                planUpdates.push(planUpdate);
            }
            planUpdate[field] = value;

            next[key] = { ...current, planUpdates };
            return next;
        });

        setMatrix(prev => prev.map(m => {
            if (m._id !== rtId) return m;
            return {
                ...m,
                plans: m.plans.map(p => {
                    if (p.planId !== planId) return p;
                    return {
                        ...p,
                        dailyRates: p.dailyRates.map(dr => {
                            if (dr.date !== date) return dr;
                            return { ...dr, [field]: value };
                        })
                    };
                })
            };
        }));
    };

    const handleCopyRate = (rtId, planId) => {
        const row = matrix.find(m => m._id === rtId);
        const plan = row.plans.find(p => p.planId === planId);
        const first = plan.dailyRates[0];
        plan.dailyRates.forEach(dr => {
            updateRate(rtId, dr.date, planId, 'adult1Price', first.adult1Price);
            updateRate(rtId, dr.date, planId, 'adult2Price', first.adult2Price);
            updateRate(rtId, dr.date, planId, 'extraAdultPrice', first.extraAdultPrice);
            updateRate(rtId, dr.date, planId, 'childPrice', first.childPrice);
        });
    };

    const handleSave = async () => {
        const updates = Object.values(pendingUpdates);
        if (updates.length === 0) return alert('No changes to save.');
        setLoading(true);
        try {
            await api.post('/inventory/save-batch', { updates });
            alert('Rates saved successfully');
            fetchData();
        } catch (error) {
            alert('Save failed');
        } finally {
            setLoading(false);
        }
    };

    if (loading && matrix.length === 0) return (
        <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
    );

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 text-left">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl lg:text-3xl font-black text-secondary lowercase capitalize tracking-tighter leading-none mb-1">Yield <span className="text-emerald-600 italic">Matrix</span></h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">Daily Pricing & Strategy Control</p>
                </div>
                <button
                    onClick={handleSave}
                    className="w-full sm:w-auto bg-emerald-600 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                >
                    <Save size={14} /> Save Rates
                </button>
            </header>

            <div className="flex flex-wrap items-center gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2">
                    <button onClick={() => navigateDate(-1)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all active:scale-90"><ChevronLeft size={16} /></button>
                    <input type="date" className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs font-bold outline-none" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    <button onClick={() => navigateDate(1)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 transition-all active:scale-90"><ChevronRight size={16} /></button>
                </div>
                <div className="relative flex-grow lg:flex-none lg:w-64">
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-xs font-bold outline-none appearance-none" value={selectedRT} onChange={e => setSelectedRT(e.target.value)}>
                        <option value="all">All Room Types</option>
                        {roomTypes.map(rt => <option key={rt._id} value={rt._id}>{rt.name}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <button onClick={fetchData} className="bg-secondary text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-secondary/10">
                    <Search size={14} /> Search
                </button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse min-w-[1400px]">
                        <thead>
                            <tr className="bg-slate-50/50">
                                <th className="px-8 py-10 sticky left-0 bg-white z-20 border-r border-slate-100 min-w-[300px]">
                                    <p className="text-[10px] font-black text-secondary tracking-[0.2em] uppercase">Inventory <span className="text-slate-300">Rates</span></p>
                                </th>
                                {dates.map((d, i) => {
                                    const dateObj = new Date(d);
                                    const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                                    return (
                                        <th key={i} className={`px-4 py-8 text-center border-r border-slate-100 min-w-[110px] ${isWeekend ? 'bg-rose-50/30' : ''}`}>
                                            <p className={`text-[9px] font-black uppercase tracking-tighter mb-1 ${isWeekend ? 'text-rose-500' : 'text-slate-400'}`}>{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                            <p className="text-xl font-black text-secondary leading-none">{dateObj.getDate()}</p>
                                            <p className="text-[7px] font-bold text-slate-300 uppercase mt-1 tracking-widest">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</p>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {matrix.map((row) => (
                                <React.Fragment key={row._id}>
                                    <tr className="bg-slate-50/30">
                                        <td colSpan={dates.length + 1} className="px-8 py-3 border-b border-t border-slate-100">
                                            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">{row.name}</span>
                                        </td>
                                    </tr>
                                    {row.plans.map((plan) => (
                                        <React.Fragment key={plan.planId}>
                                            {[
                                                { label: '1 Guest', key: 'adult1Price' },
                                                { label: '2 Guest', key: 'adult2Price' },
                                                { label: 'Extra Adult 1', key: 'extraAdultPrice' },
                                                { label: 'Extra Child 1', key: 'childPrice' }
                                            ].map((occ, occIdx) => (
                                                <tr key={occ.key} className="group border-b border-slate-50">
                                                    <td className="px-8 py-4 sticky left-0 bg-white group-hover:bg-slate-50/50 z-10 border-r border-slate-100 transition-all">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex flex-col">
                                                                {occIdx === 0 && <span className="text-[9px] font-black text-emerald-600 uppercase mb-1">{plan.planName}</span>}
                                                                <span className="text-[8px] font-bold text-slate-400 uppercase flex items-center gap-2">
                                                                    <Users size={10} /> {occ.label}
                                                                </span>
                                                            </div>
                                                            {occIdx === 0 && (
                                                                <button onClick={() => handleCopyRate(row._id, plan.planId)} className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[7px] font-black uppercase flex items-center gap-1 hover:bg-primary transition-all">
                                                                    <Copy size={8} /> Copy
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                    {plan.dailyRates.map((dr, i) => (
                                                        <td key={i} className={`px-4 py-3 border-r border-slate-100 transition-all ${new Date(dr.date).getDay() === 0 ? 'bg-rose-50/10' : ''}`}>
                                                            <input
                                                                type="text"
                                                                className="w-full bg-white border border-slate-200 rounded-xl px-2 py-2 text-center text-[11px] font-black text-secondary shadow-sm focus:border-primary tabular-nums"
                                                                value={dr[occ.key]}
                                                                onChange={(e) => updateRate(row._id, dr.date, plan.planId, occ.key, parseInt(e.target.value.replace(/\D/g, '')) || 0)}
                                                            />
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Global Pricing Strategy */}
            <div className="bg-secondary rounded-[3rem] p-10 lg:p-14 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full -mr-48 -mt-48 blur-3xl transition-transform duration-1000 group-hover:scale-110" />
                <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-end">
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <h2 className="text-3xl lg:text-4xl font-black lowercase italic tracking-tighter leading-none">Standard <span className="text-emerald-400 italic">Configuration.</span></h2>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em]">Propagate standard rates across entire inventory</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Room Category</label>
                                <div className="relative">
                                    <select
                                        id="std-roomType"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold outline-none appearance-none focus:bg-white/10 transition-all text-white"
                                    >
                                        <option value="" className="text-secondary">Select Category</option>
                                        {roomTypes.map(rt => <option key={rt._id} value={rt._id} className="text-secondary">{rt.name}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Variant Type</label>
                                <div className="relative">
                                    <select
                                        id="std-variant"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold outline-none appearance-none focus:bg-white/10 transition-all text-white"
                                    >
                                        <option value="Normal" className="text-secondary">Normal</option>
                                        <option value="View Facing" className="text-secondary">View Facing</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Meal Strategy</label>
                                <div className="relative">
                                    <select
                                        id="std-plan"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold outline-none appearance-none focus:bg-white/10 transition-all text-white"
                                    >
                                        <option value="NORMAL ROOM (ROOM ONLY)" className="text-secondary">NORMAL ROOM (ROOM ONLY)</option>
                                        <option value="ROOM WITH BREAKFAST" className="text-secondary">ROOM WITH BREAKFAST</option>
                                        <option value="ROOM WITH BREAKFAST, LUNCH, SNACKS AND DINNER" className="text-secondary">ALL MEALS (B+L+S+D)</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 ml-1">Standard Rate (₹)</label>
                                <input
                                    id="std-price"
                                    type="number"
                                    placeholder="e.g. 4500"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:bg-white/10 transition-all text-white placeholder:text-white/20"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={async () => {
                            const rtValue = document.getElementById('std-roomType').value;
                            const vtValue = document.getElementById('std-variant').value;
                            const plValue = document.getElementById('std-plan').value;
                            const prValue = document.getElementById('std-price').value;

                            if (!rtValue || !prValue) return alert('Please select room type and enter price');

                            try {
                                setLoading(true);
                                await api.post('/pricing/upsert-standard', {
                                    roomTypeId: rtValue,
                                    variantName: vtValue,
                                    planName: plValue,
                                    price: prValue
                                });
                                alert('Global rates synchronized successfully');
                                fetchData();
                            } catch (err) {
                                alert('Synchronization failed');
                            } finally {
                                setLoading(false);
                            }
                        }}
                        className="bg-emerald-500 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-emerald-500/20 hover:bg-emerald-400 active:scale-95 transition-all flex items-center gap-3"
                    >
                        <Save size={16} /> Synchronize Global Rates
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Rates;
