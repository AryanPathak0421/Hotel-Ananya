import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Search, Filter, Shield, Download, Phone, Mail, Calendar, MapPin, UserCheck, UserX } from 'lucide-react';

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

    useEffect(() => { fetchUsers(); }, []);

    const handleAddStaff = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/register', newStaff);
            fetchUsers();
            setIsModalOpen(false);
            setNewStaff({ name: '', email: '', password: '', role: 'admin', mobile: '', country: 'India', city: 'Digha' });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add staff');
        }
    };

    const toggleStatus = async (user) => {
        try {
            const newStatus = user.status === 'active' ? 'blocked' : 'active';
            await api.put(`/users/${user._id}`, { status: newStatus });
            fetchUsers();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const filtered = users.filter(u => {
        const matchesSearch = (u.name || '').toLowerCase().includes(search.toLowerCase()) || (u.email || '').toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'All' || (u.role || '').toLowerCase() === roleFilter.toLowerCase();
        return matchesSearch && matchesRole;
    });

    const downloadCSV = () => {
        const headers = ["Name", "Email", "Mobile", "Role", "City", "Country", "Wallet", "Verified", "Status", "Joined"];
        const rows = filtered.map(u => [
            u.name, u.email, u.mobile, u.role.toUpperCase(), u.city, u.country, u.walletBalance, u.isVerified, u.status, new Date(u.createdAt).toLocaleDateString()
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(r => r.map(cell => `"${cell}"`).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `Ananya_Users_Registry_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link); link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 text-left pb-10">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <label className="text-[9px] font-bold text-primary uppercase tracking-[0.2em] mb-1 block">Account Management</label>
                    <h1 className="text-xl lg:text-2xl font-bold text-secondary uppercase tracking-tight leading-none">Users <span className="text-primary italic">Registry</span></h1>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-primary text-secondary px-4 py-2.5 rounded-sm font-bold uppercase tracking-widest text-[9px] shadow-sm hover:scale-105 active:scale-95 transition-all"
                    >
                        <Shield size={14} /> Add Staff
                    </button>
                    <button
                        onClick={downloadCSV}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-secondary text-white px-4 py-2.5 rounded-sm font-bold uppercase tracking-widest text-[9px] shadow-sm hover:bg-primary hover:text-secondary transition-all"
                    >
                        <Download size={14} /> Export CSV
                    </button>
                </div>
            </header>

            {isModalOpen && (
                <div className="fixed inset-0 bg-secondary/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-sm w-full max-w-lg p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
                        <h3 className="text-xl font-bold text-secondary uppercase mb-6">Create Staff <span className="text-primary italic">Account</span></h3>
                        <form onSubmit={handleAddStaff} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-slate-400">Full Name</label>
                                    <input required value={newStaff.name} onChange={e => setNewStaff({ ...newStaff, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2.5 text-xs font-bold outline-none focus:ring-1 focus:ring-primary uppercase transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-slate-400">Mobile</label>
                                    <input required value={newStaff.mobile} onChange={e => setNewStaff({ ...newStaff, mobile: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2.5 text-xs font-bold outline-none focus:ring-1 focus:ring-primary transition-all" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] font-bold uppercase text-slate-400">Email Address</label>
                                <input required type="email" value={newStaff.email} onChange={e => setNewStaff({ ...newStaff, email: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2.5 text-xs font-bold outline-none focus:ring-1 focus:ring-primary transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-slate-400">City</label>
                                    <input required value={newStaff.city} onChange={e => setNewStaff({ ...newStaff, city: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2.5 text-xs font-bold outline-none focus:ring-1 focus:ring-primary transition-all" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[9px] font-bold uppercase text-slate-400">Password</label>
                                    <input required type="password" value={newStaff.password} onChange={e => setNewStaff({ ...newStaff, password: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-sm px-4 py-2.5 text-xs font-bold outline-none focus:ring-1 focus:ring-primary transition-all" />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-[10px] font-bold uppercase text-slate-400 hover:text-secondary">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-secondary text-white rounded-sm text-[10px] font-bold uppercase hover:bg-primary hover:text-secondary transition-all">Authorize Staff</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-sm border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                        <input
                            type="text"
                            placeholder="SEARCH USERS BY NAME/EMAIL..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-sm text-[10px] font-bold outline-none focus:ring-1 focus:ring-primary uppercase transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-sm border border-slate-200">
                        <Filter size={12} className="text-slate-400 shrink-0" />
                        <select
                            className="bg-transparent text-[9px] font-bold uppercase tracking-widest outline-none cursor-pointer"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option>All Roles</option>
                            <option value="admin">Admins</option>
                            <option value="user">Users</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full min-w-[1200px] table-fixed">
                        <thead>
                            <tr className="bg-slate-50 text-[8px] lg:text-[9px] uppercase font-bold tracking-[0.15em] text-slate-500 border-b border-slate-200">
                                <th className="px-6 py-4 text-left w-20">Veritas</th>
                                <th className="px-6 py-4 text-left">Identity</th>
                                <th className="px-6 py-4 text-left w-44">Contact Details</th>
                                <th className="px-6 py-4 text-left w-40">Presence</th>
                                <th className="px-6 py-4 text-center w-32">Role</th>
                                <th className="px-6 py-4 text-center w-32">Status</th>
                                <th className="px-6 py-4 text-right w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="py-20 text-center">
                                        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">Identity not found.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((u) => (
                                    <tr key={u._id} className="hover:bg-slate-50/50 transition-all text-[11px]">
                                        <td className="px-6 py-4">
                                            {u.isVerified ?
                                                <UserCheck size={16} className="text-emerald-500" /> :
                                                <UserX size={16} className="text-rose-400" />
                                            }
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-secondary uppercase tracking-tight leading-none mb-1">{u.name}</p>
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <Mail size={10} className="text-primary" />
                                                <span className="text-[9px] font-bold truncate">{u.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-secondary font-bold">
                                                <Phone size={10} className="text-primary" />
                                                <span>{u.mobile || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-secondary font-bold uppercase tracking-tight">
                                                <MapPin size={10} className="text-primary" />
                                                <span className="truncate">{u.city || 'N/A'}, {u.country || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-0.5 rounded-sm text-[7px] font-bold uppercase tracking-widest border ${u.role === 'admin' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-2 py-0.5 rounded-sm text-[7px] font-bold uppercase tracking-widest border ${u.status === 'blocked' ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                }`}>
                                                {u.status || 'active'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => toggleStatus(u)}
                                                className={`px-3 py-1 text-[8px] font-bold uppercase tracking-widest rounded-sm border transition-all ${u.status === 'blocked' ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'
                                                    }`}
                                            >
                                                {u.status === 'blocked' ? 'Unblock' : 'Block'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;
