import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Ticket, Plus, ToggleLeft, ToggleRight, Activity, Percent, Tag, X, Check, Trash2 } from 'lucide-react';

const Discounts = () => {
    const [discounts, setDiscounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCoupon, setNewCoupon] = useState({ code: '', type: 'Percentage', value: 0 });

    const fetchDiscounts = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/discounts');
            setDiscounts(data);
        } catch (error) {
            console.error('Error fetching discounts:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const handleAddCoupon = async (e) => {
        e.preventDefault();
        try {
            await api.post('/discounts', newCoupon);
            fetchDiscounts();
            setIsModalOpen(false);
            setNewCoupon({ code: '', type: 'Percentage', value: 0 });
        } catch (error) {
            alert(error.response?.data?.message || 'Error creating coupon');
        }
    };

    const toggleStatus = async (id) => {
        try {
            await api.patch(`/discounts/${id}/toggle`);
            fetchDiscounts();
        } catch (error) {
            console.error('Error toggling coupon:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this coupon permanently?')) return;
        try {
            await api.delete(`/discounts/${id}`);
            fetchDiscounts();
        } catch (error) {
            console.error('Error deleting coupon:', error);
        }
    };

    return (
        <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Promotions & Marketing</h1>
                    <p className="text-sm text-slate-500 font-medium">Create and manage coupon codes for guests and loyalty members.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-primary text-secondary px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-primary/10 hover:scale-105 active:scale-95 transition-all"
                >
                    <Plus size={18} />
                    <span>Generate New Coupon</span>
                </button>
            </header>

            {isModalOpen && (
                <div className="fixed inset-0 bg-secondary/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                            <X size={20} />
                        </button>
                        <h3 className="text-xl font-bold text-secondary mb-6">Forge Reward Token</h3>
                        <form onSubmit={handleAddCoupon} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Activation Code</label>
                                <input required value={newCoupon.code} onChange={e => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-black tracking-widest outline-none focus:ring-2 focus:ring-primary/20 transition-all uppercase"
                                    placeholder="ANANYA2026" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Logic Type</label>
                                    <select value={newCoupon.type} onChange={e => setNewCoupon({ ...newCoupon, type: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                                        <option>Percentage</option>
                                        <option>Fixed</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">{newCoupon.type === 'Percentage' ? 'Factor (%)' : 'Magnitude (₹)'}</label>
                                    <input required type="number" value={newCoupon.value} onChange={e => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-black outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-secondary transition-colors">Abort</button>
                                <button type="submit" className="flex-1 py-3 bg-secondary text-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-secondary/20 hover:scale-105 active:scale-95 transition-all outline-none">Initialize Coupon</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="py-20 flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verifying Ledger...</p>
                </div>
            ) : (
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50/50 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 border-b border-slate-100">
                                    <th className="px-8 py-5">Campaign / Code</th>
                                    <th className="px-6 py-5 text-center">Incentive Type</th>
                                    <th className="px-6 py-5">Value</th>
                                    <th className="px-6 py-5">Redemption Velocity</th>
                                    <th className="px-6 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Switch</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm font-medium">
                                {discounts.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-20 text-center text-slate-400 italic">No coupons found. Create your first campaign.</td>
                                    </tr>
                                ) : discounts.map((d) => (
                                    <tr key={d._id} className="hover:bg-slate-50/50 transition-all group">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-secondary text-primary rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/5">
                                                    <Ticket size={20} />
                                                </div>
                                                <div>
                                                    <span className="block font-black text-secondary tracking-[0.1em] text-base group-hover:text-primary transition-colors">{d.code}</span>
                                                    <span className="text-[10px] text-slate-300 font-black uppercase tracking-tighter lowercase">{d._id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 text-center">
                                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${d.type === 'Percentage' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                                                }`}>
                                                {d.type === 'Percentage' ? <Percent size={10} /> : <Tag size={10} />}
                                                {d.type}
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-black text-secondary text-lg">
                                            {d.type === 'Percentage' ? `${d.value}%` : `₹${d.value}`}
                                        </td>
                                        <td className="px-6 py-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${Math.min((d.used || 0) / 2, 100)}%` }} />
                                                </div>
                                                <span className="text-[10px] font-black text-secondary">{d.used || 0} Uses</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-6 font-bold">
                                            <div className={`flex items-center gap-1.5 ${d.active ? 'text-emerald-500' : 'text-rose-400'}`}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${d.active ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
                                                <span className="text-[10px] uppercase tracking-widest font-black">{d.active ? 'Live' : 'Paused'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => toggleStatus(d._id)}
                                                    className={`transition-all hover:scale-110 active:scale-90 ${d.active ? 'text-primary' : 'text-slate-200'}`}
                                                >
                                                    {d.active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(d._id)}
                                                    className="p-2 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-xl transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Quick Analytics Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-secondary rounded-[2rem] p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 transition-transform group-hover:scale-110" />
                    <h3 className="font-serif text-2xl italic mb-2">Campaign Performance</h3>
                    <p className="text-white/40 text-xs font-medium mb-6">Promotional codes have contributed to 18% of total bookings this month.</p>
                    <div className="flex items-end gap-1 h-20">
                        {[40, 20, 60, 30, 80, 50, 90].map((h, i) => (
                            <div key={i} className="flex-1 bg-primary/20 hover:bg-primary transition-all rounded-t-md" style={{ height: `${h}%` }} />
                        ))}
                    </div>
                </div>
                <div className="bg-primary rounded-[3rem] p-8 text-secondary flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <Tag size={32} className="opacity-20" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Pro Tip</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1 leading-tight tracking-tight">Personalize Your Promos</h3>
                        <p className="text-secondary/60 text-[10px] font-medium leading-relaxed italic">"Dynamic discounts based on guest loyalty tier can increase redemption rates by up to 24%."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Discounts;

