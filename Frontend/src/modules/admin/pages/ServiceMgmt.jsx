import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Search, Plus, Trash2, Edit2, X, Coffee, Waves, Heart, Image as ImageIcon } from 'lucide-react';

const ServiceMgmt = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dine'); // 'dine', 'dip', 'care'
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        type: 'dine',
        category: 'General',
        description: '',
        price: 0,
        image: '',
        isActive: true
    });

    const fetchServices = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/services');
            setServices(data);
        } catch (error) {
            console.error('Error fetching services:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingItem) {
                await api.put(`/services/${editingItem._id}`, formData);
            } else {
                await api.post('/services', formData);
            }
            setIsModalOpen(false);
            setEditingItem(null);
            resetForm();
            fetchServices();
        } catch (error) {
            alert('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this service item?')) return;
        try {
            await api.delete(`/services/${id}`);
            fetchServices();
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: activeTab,
            category: 'General',
            description: '',
            price: 0,
            image: '',
            isActive: true
        });
    };

    const filteredServices = services.filter(s => s.type === activeTab);

    if (loading) return (
        <div className="p-20 text-center">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 text-left">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-secondary lowercase capitalize">
                        Service <span className="text-primary italic">Management</span>
                    </h1>
                    <p className="text-xs text-slate-400 font-medium tracking-wide">Configure dining, water activities, and wellness offerings.</p>
                </div>
                <button
                    onClick={() => {
                        setEditingItem(null);
                        setFormData({ ...formData, type: activeTab });
                        setIsModalOpen(true);
                    }}
                    className="bg-secondary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                >
                    <Plus size={14} /> Deploy New Service
                </button>
            </header>

            {/* Tab Selector */}
            <div className="flex gap-2 bg-slate-100/50 p-1.5 rounded-[1.5rem] w-fit">
                {[
                    { id: 'dine', icon: Coffee, label: 'Dining' },
                    { id: 'dip', icon: Waves, label: 'Pool/Dip' },
                    { id: 'care', icon: Heart, label: 'Wellness' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                            ${activeTab === tab.id ? 'bg-white text-secondary shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <tab.icon size={12} className={activeTab === tab.id ? 'text-primary' : ''} />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-100 rounded-[3rem]">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">No {activeTab} assets deployed yet.</p>
                    </div>
                ) : (
                    filteredServices.map(item => (
                        <div key={item._id} className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm relative group overflow-hidden hover:shadow-xl transition-all duration-500">
                            <div className="flex gap-5 items-start">
                                <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-inner bg-slate-50 flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt={item.name} />
                                    ) : (
                                        <ImageIcon className="m-auto mt-6 text-slate-200" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-sm font-black text-secondary uppercase tracking-tight truncate">{item.name}</h3>
                                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => {
                                                setEditingItem(item);
                                                setFormData(item);
                                                setIsModalOpen(true);
                                            }} className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:text-primary"><Edit2 size={12} /></button>
                                            <button onClick={() => handleDelete(item._id)} className="p-1.5 bg-rose-50 text-rose-400 rounded-lg hover:text-rose-600"><Trash2 size={12} /></button>
                                        </div>
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1">{item.category}</p>
                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-[9px] font-black uppercase text-primary bg-primary/5 px-2.5 py-1 rounded-lg">
                                            ₹{item.price || 'NA'}
                                        </span>
                                        <div className={`w-2 h-2 rounded-full ${item.isActive ? 'bg-emerald-400' : 'bg-slate-300'}`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 relative z-10 animate-in zoom-in-95 shadow-2xl">
                        <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 text-slate-400 hover:text-secondary"><X size={20} /></button>
                        <h2 className="text-2xl font-black text-secondary lowercase capitalize mb-8">
                            {editingItem ? 'Update' : 'Deploy'} <span className="text-primary italic">Service</span>
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Name</label>
                                    <input required placeholder="e.g. Infinity Pool" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Type</label>
                                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="dine">Dining</option>
                                        <option value="dip">Pool/Dip</option>
                                        <option value="care">Wellness/Care</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Classification</label>
                                    <input placeholder="e.g. Breakfast, Massage" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Starting Price (₹)</label>
                                    <input type="number" placeholder="0" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea rows="3" placeholder="Brief narrative for this offering..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Asset Image URL</label>
                                <input placeholder="https://..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
                            </div>

                            <div className="pt-4">
                                <button type="submit" className="w-full bg-primary text-secondary py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
                                    Execute Integration
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceMgmt;
