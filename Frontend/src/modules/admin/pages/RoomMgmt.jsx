import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Search, Plus, Trash2, Edit2, Layers, X, Home, Info, Image as ImageIcon } from 'lucide-react';

const RoomMgmt = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingType, setEditingType] = useState(null);

    const [formData, setFormData] = useState({
        name: '', size: '', capacity: '', bedType: '', totalRooms: 10, amenities: '', images: ''
    });

    const fetchRoomTypes = async () => {
        try {
            const { data } = await api.get('/rooms');
            setRoomTypes(data);
        } catch (error) {
            console.error('Error fetching room types:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRoomTypes(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            amenities: formData.amenities.split(',').map(s => s.trim()),
            images: formData.images.split(',').map(s => s.trim())
        };

        try {
            if (editingType) {
                await api.put(`/rooms/${editingType._id}`, payload);
            } else {
                await api.post('/rooms', payload);
            }
            setIsModalOpen(false);
            setEditingType(null);
            setFormData({ name: '', size: '', capacity: '', bedType: '', totalRooms: 10, amenities: '', images: '' });
            fetchRoomTypes();
        } catch (error) {
            alert('Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this room type and all its configurations?')) return;
        try {
            await api.delete(`/rooms/${id}`);
            fetchRoomTypes();
        } catch (error) { console.error(error); }
    };

    if (loading) return <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 text-left">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-secondary lowercase capitalize">Room <span className="text-primary italic">Architecture</span></h1>
                    <p className="text-xs text-slate-400 font-medium">Define high-level room categories and their physical specifications.</p>
                </div>
                <button
                    onClick={() => { setEditingType(null); setIsModalOpen(true); }}
                    className="bg-secondary text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-slate-800 transition-all flex items-center gap-2"
                >
                    <Plus size={14} /> Global Type Deployment
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {roomTypes.map(type => (
                    <div key={type._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative group overflow-hidden">
                        <div className="flex gap-6 items-start">
                            <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-inner bg-slate-50 flex-shrink-0">
                                {type.images?.[0] ? <img src={type.images[0]} className="w-full h-full object-cover" /> : <ImageIcon className="m-auto mt-7 text-slate-200" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-secondary uppercase tracking-tight">{type.name}</h3>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => {
                                            setEditingType(type);
                                            setFormData({
                                                ...type,
                                                amenities: type.amenities.join(', '),
                                                images: type.images.join(', ')
                                            });
                                            setIsModalOpen(true);
                                        }} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-primary"><Edit2 size={14} /></button>
                                        <button onClick={() => handleDelete(type._id)} className="p-2 bg-rose-50 text-rose-400 rounded-xl hover:text-rose-600"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                        <Layers size={10} className="text-primary" /> {type.totalRooms} Units available
                                    </div>
                                    <div className="text-[9px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-2">
                                        <Home size={10} className="text-primary" /> {type.size}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
                    <div className="bg-white w-full max-w-2xl rounded-[2.5rem] p-10 relative z-10 animate-in zoom-in-95">
                        <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 text-slate-400"><X size={20} /></button>
                        <h2 className="text-2xl font-black text-secondary lowercase capitalize mb-8">{editingType ? 'Update' : 'Deploy'} <span className="text-primary italic">Category</span></h2>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Type Designation</label>
                                <input required placeholder="Double Bed A/C Room" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Physical Footprint</label>
                                <input required placeholder="120 sq ft" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none" value={formData.size} onChange={e => setFormData({ ...formData, size: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Guest Occupancy</label>
                                <input required placeholder="2 Adults + 1 Extra" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Bed Infrastructure</label>
                                <input required placeholder="King Size Bed" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none" value={formData.bedType} onChange={e => setFormData({ ...formData, bedType: e.target.value })} />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Amenities (Comma separated)</label>
                                <textarea rows="2" placeholder="Split AC, WiFi, Television..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none resize-none" value={formData.amenities} onChange={e => setFormData({ ...formData, amenities: e.target.value })} />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Hero Asset URLs (Comma separated)</label>
                                <input placeholder="https://..." className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold outline-none" value={formData.images} onChange={e => setFormData({ ...formData, images: e.target.value })} />
                            </div>
                            <div className="md:col-span-2 pt-4">
                                <button type="submit" className="w-full bg-primary text-secondary py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">Execute Integration</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomMgmt;
