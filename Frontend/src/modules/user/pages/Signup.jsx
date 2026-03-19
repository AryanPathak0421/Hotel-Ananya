import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import {
    Mail, Lock, UserPlus, User, Eye, EyeOff, Sparkles, Phone,
    Globe, MapPin, Image as ImageIcon, Languages, Ticket,
    ShieldCheck, ChevronRight, ChevronLeft, CheckCircle2
} from 'lucide-react';

const Signup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '', email: '', mobile: '',
        password: '', confirmPassword: '',
        country: '', city: '',
        profilePicture: '', preferredLanguage: 'English', referralCode: '',
        termsAccepted: false
    });
    const [otp, setOtp] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validateStep = (s) => {
        if (s === 1) {
            if (!formData.name.trim()) { alert("Please enter your full name"); return false; }
            if (!formData.email.trim()) { alert("Please enter a valid email address"); return false; }
            if (!formData.mobile.trim()) { alert("Please provide your mobile number"); return false; }
        }
        if (s === 2) {
            if (!formData.password) { alert("Please set a security password"); return false; }
            if (formData.password.length < 6) { alert("Password must be at least 6 characters"); return false; }
            if (formData.password !== formData.confirmPassword) { alert("Passwords do not match"); return false; }
        }
        if (s === 3) {
            if (!formData.country.trim()) { alert("Please specify your country"); return false; }
            if (!formData.city.trim()) { alert("Please specify your city"); return false; }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep(step)) {
            setStep(s => s + 1);
        }
    };

    const prevStep = () => setStep(s => s - 1);

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return alert("Passwords don't match");
        }
        if (!formData.termsAccepted) {
            return alert("Please accept the terms and conditions");
        }

        setLoading(true);
        const result = await signup(formData);
        if (result.success) {
            setStep(5); // Go to OTP verification
        } else {
            alert(result.message);
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/verify-otp', {
                email: formData.email,
                otp
            });
            if (data.success) {
                navigate('/');
            }
        } catch (error) {
            alert(error.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Basic Info
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <User size={10} className="text-primary" /> Full Name
                            </label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange}
                                placeholder="e.g. Aryan Pathak"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-sm px-4 py-3.5 rounded-xl outline-none transition-all text-secondary font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Mail size={10} className="text-primary" /> Email Address
                            </label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-sm px-4 py-3.5 rounded-xl outline-none transition-all text-secondary font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Phone size={10} className="text-primary" /> Mobile Number
                            </label>
                            <input type="tel" name="mobile" required value={formData.mobile} onChange={handleChange}
                                placeholder="+91 00000 00000"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-sm px-4 py-3.5 rounded-xl outline-none transition-all text-secondary font-medium"
                            />
                        </div>
                        <button onClick={nextStep} className="w-full flex items-center justify-center gap-3 py-4 bg-secondary text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-primary transition-all active:scale-95 shadow-lg shadow-secondary/20 mt-4">
                            Next Step <ChevronRight size={18} />
                        </button>
                    </div>
                );
            case 2: // Account Info
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Lock size={10} className="text-primary" /> Password
                            </label>
                            <div className="relative">
                                <input type={showPass ? 'text' : 'password'} name="password" required value={formData.password} onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-sm px-4 py-3.5 rounded-xl outline-none transition-all text-secondary font-medium"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-secondary">
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <ShieldCheck size={10} className="text-primary" /> Confirm Password
                            </label>
                            <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-sm px-4 py-3.5 rounded-xl outline-none transition-all text-secondary font-medium"
                            />
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button onClick={prevStep} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                                <ChevronLeft size={16} /> Back
                            </button>
                            <button onClick={nextStep} className="flex-[2] py-4 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2">
                                Next Step <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                );
            case 3: // Location Details
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Globe size={10} className="text-primary" /> Country
                            </label>
                            <input type="text" name="country" required value={formData.country} onChange={handleChange}
                                placeholder="e.g. India"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-sm px-4 py-3.5 rounded-xl outline-none transition-all text-secondary font-medium"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <MapPin size={10} className="text-primary" /> City
                            </label>
                            <input type="text" name="city" required value={formData.city} onChange={handleChange}
                                placeholder="e.g. Digha"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-primary focus:bg-white text-sm px-4 py-3.5 rounded-xl outline-none transition-all text-secondary font-medium"
                            />
                        </div>
                        <div className="flex gap-3 mt-4">
                            <button onClick={prevStep} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-2">
                                <ChevronLeft size={16} /> Back
                            </button>
                            <button onClick={nextStep} className="flex-[2] py-4 bg-secondary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all flex items-center justify-center gap-2">
                                Next Step <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                );
            case 4: // Optional & Terms
                return (
                    <form onSubmit={handleRegister} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Languages size={10} className="text-primary" /> Language
                                </label>
                                <select name="preferredLanguage" value={formData.preferredLanguage} onChange={handleChange}
                                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-3.5 rounded-xl outline-none text-secondary font-medium">
                                    <option>English</option>
                                    <option>Hindi</option>
                                    <option>Bengali</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Ticket size={10} className="text-primary" /> Referral
                                </label>
                                <input type="text" name="referralCode" value={formData.referralCode} onChange={handleChange}
                                    placeholder="Optional"
                                    className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-3.5 rounded-xl outline-none text-secondary font-medium"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                <ImageIcon size={10} className="text-primary" /> Profile Picture URL
                            </label>
                            <input type="text" name="profilePicture" value={formData.profilePicture} onChange={handleChange}
                                placeholder="https://image-url.com"
                                className="w-full bg-slate-50 border border-slate-200 text-sm px-4 py-3.5 rounded-xl outline-none text-secondary font-medium"
                            />
                        </div>

                        <label className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                            <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} className="mt-1 accent-primary w-4 h-4" />
                            <span className="text-[10px] text-slate-500 leading-relaxed">
                                I accept the <span className="text-primary font-bold">Terms & Conditions</span> and privacy policy of Hotel Ananya.
                            </span>
                        </label>

                        <div className="flex gap-3 mt-4">
                            <button type="button" onClick={prevStep} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
                                <ChevronLeft size={16} /> Back
                            </button>
                            <button type="submit" disabled={loading} className="flex-[2] py-4 bg-primary text-secondary rounded-xl text-xs font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                                {loading ? 'Registering...' : 'Complete Signup'} <Sparkles size={16} />
                            </button>
                        </div>
                    </form>
                );
            case 5: // OTP Verification
                return (
                    <div className="space-y-6 animate-in zoom-in duration-500 text-center">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-emerald-100 shadow-xl shadow-emerald-500/10">
                            <ShieldCheck size={40} />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif text-secondary lowercase capitalize">Final <span className="text-primary italic">Verification</span></h2>
                            <p className="text-xs text-slate-400 mt-2">Enter the verification code sent to <br /><span className="text-secondary font-bold">{formData.email}</span></p>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="text"
                                maxLength="4"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                placeholder="1234"
                                className="w-32 mx-auto bg-slate-100 border-2 border-slate-200 focus:border-emerald-500 text-2xl font-black text-center tracking-[0.5em] py-4 rounded-2xl outline-none"
                            />
                            <p className="text-[10px] text-slate-400 italic">Hint: use default code 1234</p>

                            <button
                                onClick={handleVerifyOtp}
                                disabled={loading || otp.length < 4}
                                className="w-full py-4 bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-emerald-600 active:scale-95 transition-all shadow-xl shadow-emerald-500/20"
                            >
                                {loading ? 'Checking...' : 'Verify & Enter Portal'}
                            </button>
                        </div>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-md">
                {/* Brand Logo Above Card */}
                <div className="flex flex-col items-center mb-10 transition-all duration-700 animate-in fade-in slide-in-from-top-6">
                    <img src="/logo.png" alt="Ananya Hotel" className="h-20 w-auto drop-shadow-2xl" />
                    <div className="mt-2 text-center">
                        <p className="text-[10px] font-black tracking-[0.6em] text-secondary uppercase">Ananya</p>
                        <p className="text-[7px] font-bold text-primary tracking-[0.3em] uppercase opacity-60">Hotel & Spa</p>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden relative">
                    <div className="px-8 py-10">
                        {step < 5 && (
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <p className="text-[9px] font-black text-primary uppercase tracking-[0.5em]">Membership</p>
                                    <h1 className="text-2xl font-serif text-secondary lowercase capitalize mt-1">Refined <span className="text-primary italic">Signup</span></h1>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-slate-300">Step</span>
                                    <p className="text-xl font-black text-secondary leading-none">{step}<span className="text-primary">/4</span></p>
                                </div>
                            </div>
                        )}

                        {renderStep()}

                        {step < 5 && (
                            <p className="text-center text-[10px] font-bold text-slate-400 mt-10 uppercase tracking-widest">
                                Already registered?{' '}
                                <Link to="/login" className="text-primary border-b border-primary/30 pb-0.5 ml-1">Secure Sign In</Link>
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;

