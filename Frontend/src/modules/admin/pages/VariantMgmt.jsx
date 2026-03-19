import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Plus, Edit2, Trash2, X, ChevronDown, Layers } from 'lucide-react';

const EMPTY_FORM = { roomType: '', name: '', totalRooms: 5, images: '', amenities: '', isActive: true };

const VariantMgmt = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [filterType, setFilterType] = useState('');

    const fetchData = async () => {
        try {
            const roomsRes = await api.get('/rooms');
            setRoomTypes(roomsRes.data);
            const all = await Promise.all(roomsRes.data.map(rt => api.get(`/rooms/variants/${rt._id}`)));
            const flat = all.flatMap((r, i) => r.data.map(v => ({ ...v, roomTypeObj: roomsRes.data[i] })));
            setVariants(flat);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const openCreate = () => {
        setEditingVariant(null);
        setFormData(EMPTY_FORM);
        setIsModalOpen(true);
    };

    const openEdit = (v) => {
        setEditingVariant(v);
        setFormData({
            roomType: v.roomType?._id || v.roomType || '',
            name: v.name,
            totalRooms: v.totalRooms,
            images: v.images?.join(', ') || '',
            amenities: v.amenities?.join(', ') || '',
            isActive: v.isActive
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            images: formData.images ? formData.images.split(',').map(s => s.trim()).filter(Boolean) : [],
            amenities: formData.amenities ? formData.amenities.split(',').map(s => s.trim()).filter(Boolean) : []
        };
        try {
            if (editingVariant) {
                await api.put(`/rooms/variants/${editingVariant._id}`, payload);
            } else {
                await api.post('/rooms/variants', payload);
            }
            setIsModalOpen(false);
            fetchData();
        } catch (err) {
            alert('Operation failed. Check all fields.');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this variant? All its pricing plans will be affected.')) return;
        try {
            await api.delete(`/rooms/variants/${id}`);
            fetchData();
        } catch (err) { console.error(err); }
    };

    const filtered = filterType ? variants.filter(v => (v.roomType?._id || v.roomType) === filterType) : variants;

    if (loading) return <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-500 text-left">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-secondary lowercase capitalize tracking-tight">
                        Room <span className="text-primary italic">Variants</span>
                    </h1>
                    <p className="text-xs text-slate-400 font-medium">
                        Define Standard & Beach Facing variants per room type · {variants.length} variants
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-secondary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                    <Plus size={14} /> New Variant
                </button>
            </header>

            {/* Filter by Room Type */}
            <div className="flex items-center gap-3">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Filter:</label>
                <div className="relative">
                    <select
                        value={filterType}
                        onChange={e => setFilterType(e.target.value)}
                        className="pl-4 pr-8 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none appearance-none"
                    >
                        <option value="">All Types</option>
                        {roomTypes.map(rt => <option key={rt._id} value={rt._id}>{rt.name}</option>)}
                    </select>
                    <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
            </div>

            {/* Variants Grid */}
            {filtered.length === 0 ? (
                <div className="py-24 text-center text-slate-300">
                    <Layers size={40} className="mx-auto mb-4 opacity-40" />
                    <p className="font-bold uppercase tracking-widest text-[10px]">No variants configured yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filtered.map(v => (
                        <div key={v._id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden group hover:shadow-xl transition-all">
                            {v.images?.[0] && (
                                <div className="h-32 overflow-hidden">
                                    <img src={v.images[0]} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                </div>
                            )}
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
                                            {v.roomTypeObj?.name || '—'}
                                        </span>
                                        <h3 className="text-base font-bold text-secondary mt-2">{v.name}</h3>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openEdit(v)} className="p-1.5 text-slate-300 hover:text-primary transition-colors"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(v._id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-3">
                                    <div className="bg-slate-50 px-3 py-1.5 rounded-lg">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rooms</p>
                                        <p className="text-sm font-black text-secondary">{v.totalRooms}</p>
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border ${v.isActive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                                        {v.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white w-full max-w-xl rounded-[2.5rem] p-10 relative z-10 animate-in zoom-in-95 my-6">
                        <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 text-slate-400 hover:text-secondary"><X size={20} /></button>
                        <h2 className="text-2xl font-black text-secondary lowercase capitalize mb-8">
                            {editingVariant ? 'Update' : 'Create'} <span className="text-primary italic">Variant</span>
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Room Type */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Parent Room Type</label>
                                <div className="relative">
                                    <select required
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none appearance-none"
                                        value={formData.roomType}
                                        onChange={e => setFormData(f => ({ ...f, roomType: e.target.value }))}
                                    >
                                        <option value="">Select room type...</option>
                                        {roomTypes.map(rt => <option key={rt._id} value={rt._id}>{rt.name}</option>)}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Variant Name */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Variant Name</label>
                                <input required placeholder="Standard / Beach Facing"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none"
                                    value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} />
                            </div>

                            {/* Total Rooms */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Number of Rooms</label>
                                <input type="number" required min="1"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold font-mono outline-none"
                                    value={formData.totalRooms} onChange={e => setFormData(f => ({ ...f, totalRooms: parseInt(e.target.value) || 1 }))} />
                            </div>

                            {/* Images */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Image URLs (comma separated)</label>
                                <input placeholder="https://..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none"
                                    value={formData.images} onChange={e => setFormData(f => ({ ...f, images: e.target.value }))} />
                            </div>

                            {/* Amenities */}
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Extra Amenities (comma separated)</label>
                                <input placeholder="Sea View, Private Balcony..."
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none"
                                    value={formData.amenities} onChange={e => setFormData(f => ({ ...f, amenities: e.target.value }))} />
                            </div>

                            {/* Active toggle */}
                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData(f => ({ ...f, isActive: e.target.checked }))} className="w-4 h-4 accent-primary" />
                                <label htmlFor="isActive" className="text-xs font-bold text-secondary cursor-pointer">Active (visible to guests)</label>
                            </div>

                            <button type="submit"
                                className="w-full bg-primary text-secondary py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 active:scale-95 transition-all hover:brightness-110">
                                {editingVariant ? 'Update Variant' : 'Create Variant'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VariantMgmt;
