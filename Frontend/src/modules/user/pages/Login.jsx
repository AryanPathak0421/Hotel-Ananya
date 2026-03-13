import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Mail, Lock, LogIn, ShieldCheck } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Simple mock login logic
        if (email === 'admin@ananya.com' && password === 'admin123') {
            login({ name: 'System Admin', email, role: 'admin' });
            navigate('/admin');
        } else if (email === 'user@ananya.com' && password === 'user123') {
            login({ name: 'Guest User', email, role: 'user' });
            navigate('/');
        } else {
            setError('Invalid credentials. Use admin@ananya.com / admin123 or user@ananya.com / user123');
        }
    };

    return (
        <div className="min-h-screen pt-12 bg-cream flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100">
                    <div className="bg-primary p-8 text-white text-center">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-md">
                            <ShieldCheck size={32} />
                        </div>
                        <h1 className="text-2xl font-serif">Welcome Back</h1>
                        <p className="text-white/70 text-sm mt-1">Access your Ananya Hotel account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 text-xs p-4 rounded-xl font-bold border border-red-100">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full btn-premium flex items-center justify-center space-x-2 py-4">
                            <span>Sign In</span>
                            <LogIn size={18} />
                        </button>

                        <div className="text-center space-y-4">
                            <p className="text-xs text-slate-500">
                                Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Get Started</Link>
                            </p>
                            <div className="pt-4 border-t border-slate-50">
                                <p className="text-[10px] uppercase font-black text-slate-300 tracking-[0.2em] mb-3">Dev Access</p>
                                <div className="flex flex-col gap-2">
                                    <button
                                        type="button"
                                        onClick={() => { setEmail('admin@ananya.com'); setPassword('admin123'); }}
                                        className="text-[10px] bg-secondary text-white py-2 rounded-lg font-bold hover:bg-primary transition-colors"
                                    >
                                        Auto-fill Admin (admin@ananya.com)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setEmail('user@ananya.com'); setPassword('user123'); }}
                                        className="text-[10px] border py-2 rounded-lg font-bold text-slate-400 hover:border-primary hover:text-primary transition-all"
                                    >
                                        Auto-fill User
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
