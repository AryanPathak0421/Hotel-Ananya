import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Calendar, Layout, Award, Zap, X } from 'lucide-react';
import api from '../../../../services/api';

const RatePlans = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({ name: '', code: '', description: '', inclusions: '' });

    const fetchPlans = async () => {
        try {
            const { data } = await api.get('/setup/rate-plans');
            setPlans(data);
        } catch (error) {
            console.error('Error fetching rate plans:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleOpenModal = (plan = null) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData(plan);
        } else {
            setEditingPlan(null);
            setFormData({ name: '', code: '', description: '', inclusions: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingPlan) {
                await api.put(`/setup/rate-plans/${editingPlan._id}`, formData);
            } else {
                await api.post('/setup/rate-plans', formData);
            }
            fetchPlans();
            setIsModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Error saving rate plan');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this global rate plan? This won\'t affect existing pricing but will remove it from future selections.')) {
            try {
                await api.delete(`/setup/rate-plans/${id}`);
                fetchPlans();
            } catch (error) {
                console.error('Error deleting rate plan:', error);
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
            <header className="flex justify-between items-center text-left">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Global Rate Plans</h1>
                    <p className="text-sm text-slate-500 font-medium">Define your property's pricing strategies (EP, CP, MAP, AP).</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-secondary text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-secondary/20 active:scale-95"
                >
                    <Plus size={16} /> New Strategy
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
                {plans.length === 0 ? (
                    <div className="lg:col-span-2 py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
                        <Zap size={40} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No rate plans initialized.</p>
                    </div>
                ) : (
                    plans.map(plan => (
                        <div key={plan._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mb-16 -mr-16" />

                            <div className="flex justify-between items-start relative z-10">
                                <div>
                                    <h3 className="text-xl font-bold text-secondary tracking-tight">{plan.name}</h3>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{plan.code}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(plan)} className="h-10 w-10 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 hover:text-secondary hover:bg-primary transition-all">
                                        <Edit2 size={14} />
                                    </button>
                                    <button onClick={() => handleDelete(plan._id)} className="h-10 w-10 flex items-center justify-center bg-slate-50 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8 space-y-4 relative z-10">
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                    <Award size={18} className="text-primary shrink-0" />
                                    <div>
                                        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Inclusions</p>
                                        <p className="text-xs font-bold text-secondary italic leading-tight">{plan.inclusions || 'No specific inclusions noted.'}</p>
                                    </div>
                                </div>
                                <p className="text-[11px] text-slate-400 font-medium leading-relaxed pr-8 line-clamp-2">
                                    {plan.description || 'Global rate strategy for property-wide inventory allocation and yield management.'}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-10 relative z-10 animate-in zoom-in duration-300 text-left">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-secondary"><X size={20} /></button>
                        <h2 className="text-2xl font-bold text-secondary mb-2">{editingPlan ? 'Refine Strategy' : 'Initialize Strategy'}</h2>
                        <p className="text-sm text-slate-500 mb-8 italic">Define the global nomenclature and service inclusions.</p>

                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Name</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="e.g. Continental Plan"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Plan Code</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="CP"
                                        value={formData.code}
                                        onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Inclusions Summary</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. Bed and Breakfast Included"
                                    value={formData.inclusions}
                                    onChange={e => setFormData({ ...formData, inclusions: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deep Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-bold outline-none focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none"
                                    placeholder="Describe the operational scope of this rate plan..."
                                />
                            </div>

                            <button className="w-full bg-primary text-secondary py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:brightness-110 transition-all shadow-xl shadow-primary/20">
                                {editingPlan ? 'Sync Strategic Data' : 'Establish Strategy'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RatePlans;
