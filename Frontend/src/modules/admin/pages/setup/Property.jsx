import { useState, useEffect } from 'react';
import { Building2, MapPin, Globe, Phone, Mail, Clock, ShieldCheck, Camera } from 'lucide-react';
import api from '../../../../services/api';

const Property = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [loading, setLoading] = useState(true);
    const [property, setProperty] = useState({
        name: '', slogan: '', about: '', email: '', phone: '', website: '', address: '',
        checkInTime: '', checkOutTime: '', cancellationWindow: ''
    });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const { data } = await api.get('/setup/property');
                setProperty(data);
            } catch (error) {
                console.error('Error fetching property:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { data } = await api.put('/setup/property', property);
            setProperty(data);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } catch (error) {
            console.error('Error saving property:', error);
            alert('Failed to sync metadata.');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4 duration-700 relative text-left">
            {/* Success Toast */}
            {showToast && (
                <div className="fixed top-24 right-10 z-[100] bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-right-8 duration-500 font-bold">
                    <ShieldCheck size={20} />
                    <p>Global Property Data Synced Successfully</p>
                </div>
            )}

            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Property Aesthetics & Identity</h1>
                    <p className="text-sm text-slate-500 font-medium">Control the global settings and visual identity of Hotel Ananya.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-secondary text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl shadow-secondary/20 disabled:opacity-50 active:scale-95"
                >
                    {isSaving ? 'Syncing...' : 'Sync to Metadata'}
                </button>
            </header>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Visual Identity */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                        <div className="h-48 bg-secondary relative">
                            <img src="/hero-luxury.jpg" alt="Hero" className="w-full h-full object-cover opacity-60" />
                            <div className="absolute inset-0 bg-gradient-to-t from-secondary to-transparent" />
                            <div className="absolute -bottom-8 left-12 group">
                                <div className="w-32 h-32 bg-white rounded-[2rem] p-2 shadow-2xl relative">
                                    <div className="w-full h-full bg-slate-50 rounded-[1.5rem] flex items-center justify-center border border-slate-100 overflow-hidden">
                                        <img src="/logo.png" alt="Logo" className="w-20" />
                                    </div>
                                    <button className="absolute bottom-2 right-2 p-2 bg-primary text-secondary rounded-xl opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                                        <Camera size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 pb-10 px-12 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Establishment Name</label>
                                    <input
                                        type="text"
                                        value={property.name}
                                        onChange={e => setProperty({ ...property, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-secondary outline-none focus:ring-2 focus:ring-primary/20 transition-all font-serif italic text-lg shadow-inner"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Official Branding Slogan</label>
                                    <input
                                        type="text"
                                        value={property.slogan}
                                        onChange={e => setProperty({ ...property, slogan: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 font-bold text-secondary outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm italic"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">About the Property</label>
                                <textarea
                                    rows={4}
                                    value={property.about}
                                    onChange={e => setProperty({ ...property, about: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 font-medium text-slate-600 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm leading-relaxed resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                <MapPin size={20} />
                            </div>
                            <h3 className="font-bold text-secondary">Contact Architecture</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { icon: Globe, label: 'Official Website', field: 'website' },
                                { icon: Phone, label: 'Reservations Desk', field: 'phone' },
                                { icon: Mail, label: 'Concierge Email', field: 'email' },
                                { icon: MapPin, label: 'Physical GPS', field: 'address' },
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50 rounded-2xl border border-dotted border-slate-200">
                                    <div className="flex items-center gap-2">
                                        <item.icon size={12} className="text-primary shrink-0" />
                                        <label className="text-[9px] text-slate-400 font-black uppercase tracking-widest leading-none">{item.label}</label>
                                    </div>
                                    <input
                                        type="text"
                                        value={property[item.field]}
                                        onChange={e => setProperty({ ...property, [item.field]: e.target.value })}
                                        className="w-full bg-transparent border-none text-xs font-bold text-secondary outline-none focus:text-primary transition-colors"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: System Info */}
                <div className="space-y-6">
                    <div className="bg-secondary p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
                        <ShieldCheck size={40} className="text-primary mb-6" />
                        <h4 className="font-serif italic text-2xl mb-2">Global Policies</h4>
                        <div className="space-y-1 mt-6">
                            {[
                                { label: 'Check-in Standard', field: 'checkInTime' },
                                { label: 'Check-out Standard', field: 'checkOutTime' },
                                { label: 'Cancellation Window', field: 'cancellationWindow' },
                            ].map(policy => (
                                <div key={policy.field} className="py-4 border-b border-white/5 last:border-0">
                                    <label className="text-[10px] text-white/50 font-medium italic block mb-2">{policy.label}</label>
                                    <input
                                        type="text"
                                        value={property[policy.field]}
                                        onChange={e => setProperty({ ...property, [policy.field]: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-black text-primary uppercase outline-none focus:border-primary transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary/5 rounded-[2.5rem] p-8 border-2 border-dashed border-primary/20 flex flex-col items-center text-center">
                        <Clock size={32} className="text-primary mb-4" />
                        <h4 className="text-secondary font-bold text-sm mb-1 tracking-tight">System Operational Time</h4>
                        <p className="text-xs text-slate-500 font-medium italic mb-6">Last global sync: {new Date(property.updatedAt || Date.now()).toLocaleTimeString()}</p>
                        <button className="text-secondary text-[10px] font-black uppercase underline decoration-primary underline-offset-4 hover:text-primary transition-colors">
                            Force Server Re-sync
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Property;
