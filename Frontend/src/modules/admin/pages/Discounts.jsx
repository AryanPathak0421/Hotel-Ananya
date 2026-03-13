import { discountCodes } from '../../../utils/dummyData';
import { Ticket, Plus, ToggleLeft, Activity } from 'lucide-react';

const Discounts = () => {
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Promotions & Discounts</h1>
                    <p className="text-sm text-slate-500">Create and manage coupon codes for guests.</p>
                </div>
                <button className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
                    <Plus size={18} />
                    <span>Create New Coupon</span>
                </button>
            </header>

            <div className="bg-white rounded-2xl border shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b">
                                <th className="px-6 py-4">Coupon Code</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Value</th>
                                <th className="px-6 py-4">Usage Count</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {discountCodes.map((d) => (
                                <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-primary/5 rounded-lg flex items-center justify-center text-primary">
                                                <Ticket size={16} />
                                            </div>
                                            <span className="font-black text-secondary tracking-widest">{d.code}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-medium">{d.type}</td>
                                    <td className="px-6 py-4 font-bold text-secondary">
                                        {d.type === 'Percentage' ? `${d.value}%` : `₹${d.value}`}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <Activity size={14} className="text-slate-300" />
                                            <span className="font-medium">{d.used} Redemptions</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${d.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {d.active ? 'Active' : 'Disabled'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-slate-400 hover:text-secondary"><ToggleLeft size={24} className={d.active ? 'text-green-500' : ''} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Discounts;
