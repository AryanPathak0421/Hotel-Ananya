import { ArrowUpRight, ArrowDownLeft, Search, Filter } from 'lucide-react';

const transactions = [
    { id: 'T001', user: 'John Doe', type: 'credit', amount: 5000, date: '2026-03-12 14:30', description: 'Wallet Topup' },
    { id: 'T002', user: 'Jane Smith', type: 'debit', amount: 3500, date: '2026-03-12 11:20', description: 'Room #205 Booking' },
    { id: 'T003', user: 'Michael Brown', type: 'debit', amount: 5500, date: '2026-03-11 09:15', description: 'Room #302 Booking' },
    { id: 'T004', user: 'Sarah Wilson', type: 'credit', amount: 1000, date: '2026-03-10 18:45', description: 'Loyalty Bonus' },
];

const Transactions = () => {
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Wallet Transactions</h1>
                    <p className="text-sm text-slate-500">Monitor all incoming and outgoing wallet activity.</p>
                </div>
            </header>

            <div className="bg-white rounded-2xl border shadow-sm">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Search user or transaction..." className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-lg text-sm outline-none" />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b">
                                <th className="px-6 py-4">Transaction ID</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {transactions.map((t) => (
                                <tr key={t.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-400">{t.id}</td>
                                    <td className="px-6 py-4 font-bold text-secondary">{t.user}</td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded text-[10px] font-bold uppercase ${t.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                            }`}>
                                            {t.type === 'credit' ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
                                            <span>{t.type}</span>
                                        </div>
                                    </td>
                                    <td className={`px-6 py-4 font-black ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                        {t.type === 'credit' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500">{t.description}</td>
                                    <td className="px-6 py-4 text-xs text-slate-400">{t.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
