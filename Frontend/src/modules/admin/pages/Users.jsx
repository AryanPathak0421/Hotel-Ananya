import { users } from '../../../utils/dummyData';
import { Mail, Shield, User as UserIcon, MoreHorizontal } from 'lucide-react';

const Users = () => {
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Registered Users</h1>
                    <p className="text-sm text-slate-500">Managing {users.length} registered guests and administrators.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map(user => (
                    <div key={user.id} className="bg-white p-6 rounded-2xl border shadow-sm space-y-4 group hover:shadow-lg transition-all">
                        <div className="flex justify-between items-start">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-serif text-xl font-bold">
                                {user.name[0]}
                            </div>
                            <button className="text-slate-300 hover:text-secondary transition-colors"><MoreHorizontal size={20} /></button>
                        </div>

                        <div>
                            <h3 className="font-bold text-secondary text-lg">{user.name}</h3>
                            <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                                <Mail size={12} />
                                <span>{user.email}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex items-center space-x-2">
                                <Shield size={14} className={user.role === 'admin' ? 'text-red-500' : 'text-primary'} />
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${user.role === 'admin' ? 'text-red-500' : 'text-primary'}`}>
                                    {user.role}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest leading-none mb-1">Balance</p>
                                <p className="font-bold text-secondary">₹{user.balance.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Users;
