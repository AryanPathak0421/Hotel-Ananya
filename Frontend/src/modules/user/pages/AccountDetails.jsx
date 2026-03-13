import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Camera, ChevronLeft, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const AccountDetails = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    // Sample state - would be connected to actual user context/API
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '+91 98765 43210',
        address: 'Kolkata, West Bengal',
        notifications: true
    });

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleSave = () => {
        setIsEditing(false);
        // Logic to save changes would go here
    };

    return (
        <div className="pt-0 pb-20 bg-cream min-h-screen">
            <div className="section-container max-w-2xl">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-12">
                    <button
                        onClick={() => navigate('/profile')}
                        className="p-3 bg-white rounded-2xl border border-slate-100 text-secondary hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-4xl font-serif text-secondary">Account <span className="text-primary italic">Identity</span></h1>
                        <p className="text-slate-400 text-sm mt-1 uppercase tracking-[0.2em] font-bold">Your private details</p>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="space-y-8">
                    {/* Visual Profile */}
                    <div className="bg-white rounded-[2.5rem] shadow-luxury border border-slate-50 overflow-hidden relative">
                        <div className="bg-primary h-32 opacity-80"></div>
                        <div className="px-10 pb-10">
                            <div className="relative -mt-12 flex flex-col items-center text-center">
                                <div className="relative group">
                                    <div className="w-32 h-32 bg-white rounded-[2.5rem] p-1 shadow-2xl overflow-hidden">
                                        <div className="w-full h-full bg-slate-50 rounded-[2.2rem] flex items-center justify-center text-primary font-serif text-4xl font-black border-2 border-slate-100">
                                            {user.name[0]}
                                        </div>
                                    </div>
                                    <button className="absolute bottom-2 right-2 p-2 bg-primary text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
                                        <Camera size={16} />
                                    </button>
                                </div>
                                <div className="mt-6 flex flex-col items-center">
                                    <h2 className="text-2xl font-bold text-secondary">{user.name}</h2>
                                    <span className="mt-2 inline-flex items-center px-4 py-1.5 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                                        <Shield size={12} className="mr-2" /> Verified {user.role}
                                    </span>
                                </div>
                            </div>

                            {/* Details Grid */}
                            <div className="mt-12 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-slate-400">
                                            <User size={14} className="text-primary" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Full Name</span>
                                        </div>
                                        {isEditing ? (
                                            <input
                                                className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl focus:border-primary outline-none transition-all font-bold"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        ) : (
                                            <p className="font-bold text-secondary text-lg">{formData.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-slate-400">
                                            <Mail size={14} className="text-primary" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Email Address</span>
                                        </div>
                                        <p className="font-bold text-secondary/60 text-lg">{user.email}</p>
                                        <p className="text-[9px] text-green-500 font-bold uppercase flex items-center"><CheckCircle2 size={10} className="mr-1" /> Email Verified</p>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-slate-400">
                                            <Phone size={14} className="text-primary" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Phone Number</span>
                                        </div>
                                        {isEditing ? (
                                            <input
                                                className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl focus:border-primary outline-none transition-all font-bold"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            />
                                        ) : (
                                            <p className="font-bold text-secondary text-lg">{formData.phone}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2 text-slate-400">
                                            <MapPin size={14} className="text-primary" />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Address</span>
                                        </div>
                                        {isEditing ? (
                                            <input
                                                className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl focus:border-primary outline-none transition-all font-bold"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        ) : (
                                            <p className="font-bold text-secondary text-lg">{formData.address}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-50 flex justify-between items-center">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Notifications</p>
                                        <p className="text-sm font-bold text-secondary">WhatsApp & Email Updates</p>
                                    </div>
                                    <div className={`w-12 h-6 rounded-full relative transition-colors ${formData.notifications ? 'bg-primary' : 'bg-slate-200'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.notifications ? 'left-7' : 'left-1'}`}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex space-x-4">
                                {isEditing ? (
                                    <>
                                        <button onClick={handleSave} className="flex-1 btn-premium !py-4 shadow-none">Save Changes</button>
                                        <button onClick={() => setIsEditing(false)} className="flex-1 btn-outline !py-4">Discard</button>
                                    </>
                                ) : (
                                    <button onClick={() => setIsEditing(true)} className="w-full btn-premium !py-4 shadow-none">Edit Profile</button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-secondary/5 rounded-3xl border border-primary/5 space-y-3">
                        <div className="flex items-center space-x-2 text-primary">
                            <Shield size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Privacy & Security</span>
                        </div>
                        <p className="text-slate-500 text-sm font-light leading-relaxed">Your data is encrypted and managed under our premium hospitality privacy standards. We never share your stay details with third parties.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountDetails;
