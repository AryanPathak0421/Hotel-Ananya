import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Coffee, Wifi, Car, Utensils, Zap, X, Star, Clock } from 'lucide-react';
import api from '../../../../services/api';

const iconMap = { Car, Utensils, Wifi, Zap, Coffee, Star };

const Charges = () => {
    const [charges, setCharges] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCharge, setEditingCharge] = useState(null);
    const [formData, setFormData] = useState({ name: '', amount: '', category: 'Services', icon: 'Star' });

    const fetchCharges = async () => {
        try {
            const { data } = await api.get('/setup/charges');
            setCharges(data);
        } catch (error) {
            console.error('Error fetching charges:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCharges();
    }, []);

    const handleOpenModal = (charge = null) => {
        if (charge) {
            setEditingCharge(charge);
            setFormData(charge);
        } else {
            setEditingCharge(null);
            setFormData({ name: '', amount: '', category: 'Services', icon: 'Star' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingCharge) {
                await api.put(`/setup/charges/${editingCharge._id}`, formData);
            } else {
                await api.post('/setup/charges', formData);
            }
            fetchCharges();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving charge:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this service charge template?')) {
            try {
                await api.delete(`/setup/charges/${id}`);
                fetchCharges();
            } catch (error) {
                console.error('Error deleting charge:', error);
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Service Charges</h1>
                    <p className="text-sm text-slate-500 font-medium">Define pricing for add-on services and amenities.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-secondary text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-secondary/20 active:scale-95"
                >
                    <Plus size={16} /> Create Service
                </button>
            </header>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50/50 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 border-b border-slate-100">
                            <th className="px-8 py-5">Service Details</th>
                            <th className="px-6 py-5">Managed Category</th>
                            <th className="px-6 py-5 text-right">Standard Rate</th>
                            <th className="px-8 py-5 text-right">Management</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {charges.map((charge) => {
                            const Icon = iconMap[charge.icon] || Star;
                            return (
                                <tr key={charge._id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-slate-50 text-secondary rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:text-secondary group-hover:border-primary transition-all shadow-sm">
                                                <Icon size={20} />
                                            </div>
                                            <div>
                                                <p className="font-black text-secondary uppercase tracking-widest leading-none mb-1">{charge.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold lowercase truncate max-w-[100px]">{charge._id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6 font-bold text-slate-500 italic text-sm">{charge.category}</td>
                                    <td className="px-6 py-6 text-right font-black text-lg text-secondary">
                                        {charge.amount === 0 ? <span className="text-emerald-500 lowercase italic">Complimentary</span> : `₹${charge.amount}`}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleOpenModal(charge)}
                                                className="p-2.5 bg-white border border-slate-100 hover:border-primary rounded-xl text-slate-400 hover:text-secondary transition-all shadow-sm"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(charge._id)}
                                                className="p-2.5 bg-white border border-slate-100 hover:border-red-100 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 relative z-10 animate-in zoom-in duration-300">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-secondary"><X size={20} /></button>
                        <h2 className="text-2xl font-bold text-secondary mb-2">{editingCharge ? 'Modify Service' : 'Initialize Service'}</h2>
                        <p className="text-sm text-slate-500 mb-8 italic">Define the value Proposition and operational category.</p>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Label</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Magnitude (₹)</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.amount}
                                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option>Accommodation</option>
                                        <option>Food & Beverage</option>
                                        <option>Transport</option>
                                        <option>Services</option>
                                        <option>Health & Wellness</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Visual Icon</label>
                                    <select
                                        value={formData.icon}
                                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        {Object.keys(iconMap).map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                </div>
                            </div>
                            <button className="w-full bg-primary text-secondary py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:brightness-110 transition-all shadow-xl shadow-primary/20">
                                {editingCharge ? 'Sync Service Data' : 'Establish Registry Item'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Charges;
