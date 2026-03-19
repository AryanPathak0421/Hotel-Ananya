import { useState, useEffect } from 'react';
import api from '../../../../services/api';
import { Calendar, ChevronLeft, ChevronRight, Check, X, AlertCircle } from 'lucide-react';

const Availability = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(new Date());

    const dates = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(startDate);
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() + i);
        return d;
    });

    useEffect(() => {
        const fetchAvailability = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/rooms/availability-matrix?startDate=${startDate.toISOString()}`);
                setCategories(data);
            } catch (error) {
                console.error('Error fetching availability:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAvailability();
    }, [startDate]);

    const navigateDate = (days) => {
        const nextDate = new Date(startDate);
        nextDate.setDate(startDate.getDate() + days);
        setStartDate(nextDate);
    };

    const [hoveredCell, setHoveredCell] = useState(null);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Inventory Grid & Flow</h1>
                    <p className="text-sm text-slate-500 font-medium">Monitoring inventory flow from {startDate.toLocaleDateString()} for 14 operational cycles.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigateDate(-14)}
                        className="p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button className="px-6 py-2.5 bg-white border border-slate-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
                        <Calendar size={14} className="text-primary" /> {startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </button>
                    <button
                        onClick={() => navigateDate(14)}
                        className="p-2.5 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </header>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] uppercase font-black tracking-widest text-slate-400 sticky left-0 bg-slate-50 z-20 w-64 border-r">Suite Category</th>
                                {dates.map((date, i) => (
                                    <th key={i} className="px-4 py-6 text-center border-r border-slate-100 min-w-[80px]">
                                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-tighter leading-none mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                        <p className={`text-sm font-black ${i === 0 ? 'text-primary' : 'text-secondary'}`}>{date.getDate()}</p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat, i) => (
                                <tr key={cat._id} className="group hover:bg-slate-50/50 transition-all text-left">
                                    <td className="px-8 py-5 sticky left-0 bg-white group-hover:bg-slate-50 z-10 border-r border-slate-100 font-bold text-secondary text-sm">
                                        <div className="flex flex-col">
                                            <span>{cat.name}</span>
                                            <span className="text-[9px] text-slate-300 font-black uppercase tracking-widest mt-1">Total {cat.totalRooms} Units</span>
                                        </div>
                                    </td>
                                    {cat.availability.map((day, idx) => {
                                        const { available } = day;
                                        return (
                                            <td
                                                key={idx}
                                                className={`px-4 py-5 text-center border-r border-b border-slate-50 transition-colors relative cursor-pointer ${available === 0 ? 'bg-rose-50/30' : available < 3 ? 'bg-amber-50/30' : ''
                                                    }`}
                                                onMouseEnter={() => setHoveredCell(`${i}-${idx}`)}
                                                onMouseLeave={() => setHoveredCell(null)}
                                            >
                                                <span className={`text-xs font-black ${available === 0 ? 'text-rose-500' : available < 3 ? 'text-amber-500' : 'text-emerald-500'
                                                    }`}>
                                                    {available}
                                                </span>
                                                {available === 0 && <X size={10} className="absolute top-1 right-1 text-rose-300" />}
                                                {available > 0 && available < 3 && <AlertCircle size={10} className="absolute top-1 right-1 text-amber-300" />}
                                                {hoveredCell === `${i}-${idx}` && (
                                                    <div className="absolute inset-0 border-2 border-primary pointer-events-none z-10" />
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-6 px-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-emerald-500" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Healthy Inventory</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-amber-500" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Critical Alert (&lt;3)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-rose-500" />
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Sold Out Cycle</span>
                </div>
            </div>
        </div>
    );
};

export default Availability;
