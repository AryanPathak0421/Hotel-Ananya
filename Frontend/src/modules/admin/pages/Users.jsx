import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Mail, Shield, User as UserIcon, MoreHorizontal, Search, Filter, Calendar } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newStaff, setNewStaff] = useState({
        name: '', email: '', password: '', role: 'admin',
        mobile: '', country: 'India', city: 'Digha'
    });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const { data } = await api.get('/users');
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/register', newStaff);
            // After register, data contains _id, name, email, etc.
            // We fetch the list again or append manually
            setUsers([...users, { ...newStaff, _id: data._id, createdAt: new Date(), isVerified: true }]);
            setIsModalOpen(false);
            setNewStaff({ name: '', email: '', password: '', role: 'admin', mobile: '', country: 'India', city: 'Digha' });
        } catch (error) {
            console.error('Error adding staff:', error);
            alert(error.response?.data?.message || 'Update failed');
        }
    };

    const filtered = users.filter(u => {
        const matchesSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'All' || (u.role || '').toLowerCase() === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Community & Access</h1>
                    <p className="text-sm text-slate-500 font-medium">Managing {users.length} registered guests and administrators.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-secondary text-white px-6 py-2.5 rounded-xl font-bold text-xs hover:bg-slate-800 transition-all shadow-lg shadow-secondary/20"
                >
                    + Add New Staff
                </button>
            </header>

            {isModalOpen && (
                <div className="fixed inset-0 bg-secondary/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400">
                            <Shield size={20} />
                        </button>
                        <h3 className="text-xl font-bold text-secondary mb-6">Create Staff Identity</h3>
                        <form onSubmit={handleAddStaff} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Identity</label>
                                    <input required value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Full name" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Mobile</label>
                                    <input required value={newStaff.mobile} onChange={e => setNewStaff({ ...newStaff, mobile: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="+91..." />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Protocol Email</label>
                                <input required type="email" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="admin@hotelananya.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">City</label>
                                    <input required value={newStaff.city} onChange={e => setNewStaff({ ...newStaff, city: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="City" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Country</label>
                                    <input required value={newStaff.country} onChange={e => setNewStaff({ ...newStaff, country: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        placeholder="Country" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Access Phrase</label>
                                <input required type="password" value={newStaff.password} onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="••••••••" />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-secondary transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-primary text-secondary rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Authorize Staff</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-xs font-bold"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 bg-slate-50 px-4 py-1.5 rounded-xl border border-slate-100">
                    <Filter size={14} className="text-slate-400" />
                    <select
                        className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option>All Roles</option>
                        <option>Admin</option>
                        <option>User</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(user => (
                    <div key={user._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5 group hover:shadow-xl hover:shadow-slate-200/50 transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-full -mr-10 -mt-10" />

                        <div className="flex justify-between items-start relative z-10">
                            <div className="w-14 h-14 bg-secondary text-primary rounded-2xl flex items-center justify-center text-xl font-serif font-black shadow-lg shadow-secondary/10">
                                {user.name[0]}
                            </div>
                            <div className="flex flex-col items-end">
                                <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${user.role === 'admin' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    }`}>
                                    {user.role}
                                </span>
                                <p className="text-[10px] text-slate-300 mt-2 font-black uppercase tracking-tighter">{user._id}</p>
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="font-bold text-secondary text-lg group-hover:text-primary transition-colors">{user.name}</h3>
                            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1 font-medium">
                                <Mail size={12} className="text-primary" />
                                <span>{user.email}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between relative z-10">
                            <div className="space-y-1">
                                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none">Registered</p>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-secondary">
                                    <Calendar size={12} className="text-primary" />
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="flex flex-col items-end">
                                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Status</p>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${user.isVerified ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                                    {user.isVerified ? 'Verified' : 'Pending'}
                                </span>
                            </div>
                        </div>

                        {/* Location Details */}
                        <div className="grid grid-cols-2 gap-4 pb-4">
                            <div className="space-y-1">
                                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none">Location</p>
                                <p className="text-xs font-bold text-secondary truncate">{user.city}, {user.country}</p>
                            </div>
                            <div className="space-y-1 text-right">
                                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none">Contact</p>
                                <p className="text-xs font-bold text-secondary">{user.mobile}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-5 border-t border-slate-50 relative z-10">
                            <div className="space-y-1">
                                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none">Role Access</p>
                                <p className="text-xs font-black text-primary uppercase tracking-widest">{user.role}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest leading-none mb-1">Balance</p>
                                <p className="font-black text-xl text-secondary">₹{user.walletBalance.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-100">
                    <p className="text-slate-400 text-sm italic">No users matching your search criteria.</p>
                </div>
            )}
        </div>
    );
};

export default Users;

