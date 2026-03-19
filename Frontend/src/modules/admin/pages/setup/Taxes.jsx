import { useState, useEffect } from 'react';
import api from '../../../../services/api';
import { Plus, Trash2, Edit2, Percent, IndianRupee, ShieldCheck, X } from 'lucide-react';

const Taxes = () => {
    const [taxes, setTaxes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTax, setEditingTax] = useState(null);
    const [formData, setFormData] = useState({ name: '', rate: '', type: 'Percentage', status: 'Active' });

    const fetchTaxes = async () => {
        try {
            const { data } = await api.get('/setup/taxes');
            setTaxes(data);
        } catch (error) {
            console.error('Error fetching taxes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTaxes();
    }, []);

    const handleOpenModal = (tax = null) => {
        if (tax) {
            setEditingTax(tax);
            setFormData(tax);
        } else {
            setEditingTax(null);
            setFormData({ name: '', rate: '', type: 'Percentage', status: 'Active' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingTax) {
                await api.put(`/setup/taxes/${editingTax._id}`, formData);
            } else {
                await api.post('/setup/taxes', formData);
            }
            fetchTaxes();
            setIsModalOpen(false);
        } catch (error) {
            console.error('Error saving tax:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this tax configuration?')) {
            try {
                await api.delete(`/setup/taxes/${id}`);
                fetchTaxes();
            } catch (error) {
                console.error('Error deleting tax:', error);
            }
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Tax Registry</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage governmental and property-level tax structures.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-secondary text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-secondary/20 active:scale-95"
                >
                    <Plus size={16} /> Add New Tax
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {taxes.map(tax => (
                    <div key={tax._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-xl transition-all">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150" />

                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className="p-3 bg-secondary text-primary rounded-2xl shadow-lg shadow-secondary/10">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleOpenModal(tax)}
                                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-secondary transition-all"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button
                                    onClick={() => handleDelete(tax._id)}
                                    className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-lg font-bold text-secondary">{tax.name}</h3>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1 lowercase truncate max-w-[100px]">{tax._id}</p>

                            <div className="mt-6 flex items-end justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Applied Rate</p>
                                    <div className="flex items-center gap-2">
                                        {tax.type === 'Percentage' ? <Percent size={14} className="text-primary" /> : <IndianRupee size={14} className="text-primary" />}
                                        <span className="text-2xl font-black text-secondary">{tax.rate}{tax.type === 'Percentage' ? '%' : ''}</span>
                                    </div>
                                </div>
                                <button className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full border transition-all ${tax.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'
                                    }`}>
                                    {tax.status}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white rounded-[2.5rem] w-full max-w-md p-10 relative z-10 animate-in zoom-in duration-300">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-secondary"><X size={20} /></button>
                        <h2 className="text-2xl font-bold text-secondary mb-2">{editingTax ? 'Refine Tax Policy' : 'Establish New Tax'}</h2>
                        <p className="text-sm text-slate-500 mb-8 italic">Specify the magnitude and classification for regulatory alignment.</p>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tax Nomenclature</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Service VAT"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Applied Rate</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.rate}
                                        onChange={e => setFormData({ ...formData, rate: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valuation Type</label>
                                    <select
                                        value={formData.type}
                                        onChange={e => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        <option value="Percentage">Percentage (%)</option>
                                        <option value="Fixed">Fixed (₹)</option>
                                    </select>
                                </div>
                            </div>
                            <button className="w-full bg-secondary text-white py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-xl shadow-secondary/10">
                                {editingTax ? 'Update Registry' : 'Commit to Database'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Taxes;
