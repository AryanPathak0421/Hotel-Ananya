import { useState, useEffect } from 'react';
import {
    Save, Plus, Trash2, Scale, Clock, AlertCircle, FileText,
    Shield, Lock, Users, Gavel, DoorOpen, CreditCard, Ban, Globe, Anchor, FileWarning
} from 'lucide-react';
import api from '../../../../services/api';

const ICONS = [
    'Shield', 'FileText', 'Lock', 'Users', 'AlertCircle', 'Scale',
    'Gavel', 'DoorOpen', 'CreditCard', 'Ban', 'Globe', 'Anchor', 'FileWarning'
];

const TermsMgmt = () => {
    const [terms, setTerms] = useState({ lastUpdated: '', sections: [] });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchTerms = async () => {
            try {
                const { data } = await api.get('/terms');
                setTerms(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchTerms();
    }, []);

    const handleAdd = () => {
        setTerms(prev => ({
            ...prev,
            sections: [...prev.sections, { icon: 'FileText', title: '', content: '' }]
        }));
    };

    const handleRemove = (idx) => {
        setTerms(prev => ({
            ...prev,
            sections: prev.sections.filter((_, i) => i !== idx)
        }));
    };

    const handleSectionChange = (idx, field, val) => {
        const newSections = [...terms.sections];
        newSections[idx][field] = val;
        setTerms({ ...terms, sections: newSections });
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post('/terms', terms);
            alert('Legal protocols synchronized successfully.');
        } catch (err) { alert('Synchronization failure.'); }
        finally { setSaving(false); }
    };

    if (loading) return <div className="p-20 text-center text-primary animate-pulse font-black text-xs tracking-widest uppercase">Initializing Legal Vault...</div>;

    return (
        <div className="space-y-10 animate-in fade-in duration-700 text-left pb-20">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                    <h1 className="text-xl lg:text-3xl font-black text-secondary lowercase capitalize tracking-tight leading-none mb-1">Legal <span className="text-primary italic">Protocols</span></h1>
                    <p className="text-[10px] lg:text-xs text-slate-400 font-medium tracking-tight mt-1">Configure the terms and conditions governing the Ananya platform.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleAdd} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
                        <Plus size={14} /> Add Clause
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-8 py-3 bg-secondary text-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-secondary/10 flex items-center gap-2"
                    >
                        {saving ? <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Save size={14} />}
                        Synchronize Vault
                    </button>
                </div>
            </header>

            <div className="max-w-4xl space-y-8">
                <div className="bg-white p-6 lg:p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />
                    <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start sm:items-end">
                        <div className="space-y-1.5 flex-grow">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Clock size={10} className="text-primary" /> Temporal Marker
                            </label>
                            <input
                                type="text"
                                value={terms.lastUpdated}
                                onChange={e => setTerms(prev => ({ ...prev, lastUpdated: e.target.value }))}
                                placeholder="e.g. October 15, 2025"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-xs lg:text-sm px-4 py-3 rounded-xl outline-none transition-all font-bold text-secondary"
                            />
                        </div>
                        <div className="shrink-0 p-4 bg-primary/10 rounded-2xl border border-primary/20">
                            <Scale size={20} className="text-primary" />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {terms.sections.map((section, idx) => (
                        <div key={idx} className="bg-white p-6 lg:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500 delay-100 relative group hover:border-primary/20 transition-colors">
                            <button
                                onClick={() => handleRemove(idx)}
                                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-rose-500 transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                                <div className="lg:col-span-1 space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Visual Token</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {ICONS.map(icon => (
                                                <button
                                                    key={icon}
                                                    onClick={() => handleSectionChange(idx, 'icon', icon)}
                                                    className={`p-2 rounded-lg border flex items-center justify-center transition-all 
                                                        ${section.icon === icon ? 'bg-primary border-primary text-secondary scale-110 shadow-lg' : 'bg-slate-50 border-slate-100 text-slate-400 hover:border-primary/30'}`}
                                                >
                                                    {(() => {
                                                        const IconComp = { Shield, FileText, Lock, Users, AlertCircle, Scale, Gavel, DoorOpen, CreditCard, Ban, Globe, Anchor, FileWarning }[icon];
                                                        return <IconComp size={14} />;
                                                    })()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-3 space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Clause Title</label>
                                        <input
                                            type="text"
                                            value={section.title}
                                            onChange={e => handleSectionChange(idx, 'title', e.target.value)}
                                            placeholder="e.g. Agreement to Terms"
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-xs lg:text-sm px-4 py-3 rounded-xl outline-none transition-all font-black text-secondary leading-none"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Legal Narrative</label>
                                        <textarea
                                            rows="4"
                                            value={section.content}
                                            onChange={e => handleSectionChange(idx, 'content', e.target.value)}
                                            placeholder="Detailed textual transmission of the legal protocol..."
                                            className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-xs lg:text-sm px-4 py-3 rounded-xl outline-none transition-all font-medium text-slate-500 leading-relaxed italic resize-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {terms.sections.length === 0 && (
                    <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <FileText size={40} className="mx-auto text-slate-200 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No legal clauses detected in the ledger.</p>
                        <button onClick={handleAdd} className="mt-4 text-primary font-black text-[9px] uppercase tracking-widest border-b border-primary/40">Initialize First Clause</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TermsMgmt;
