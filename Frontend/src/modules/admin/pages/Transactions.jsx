import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { ArrowUpRight, ArrowDownLeft, Search, Filter, Download } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const { data } = await api.get('/transactions');
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const filtered = transactions.filter(t => {
        const userName = t.user?.name || '';
        const txnId = t._id || '';
        const matchesSearch = userName.toLowerCase().includes(search.toLowerCase()) || txnId.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'All Types' || t.type === typeFilter.toLowerCase();
        return matchesSearch && matchesType;
    });

    const handleExportCSV = () => {
        const headers = ['TXN ID', 'User', 'Type', 'Amount', 'Description', 'Date'];
        const csvContent = [
            headers.join(','),
            ...transactions.map(t => [
                t._id,
                t.user?.name || 'Unknown',
                t.type,
                t.amount,
                t.description,
                new Date(t.createdAt).toLocaleString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `transactions_ledger_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return <div className="p-20 text-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Financial Ledger</h1>
                    <p className="text-sm text-slate-500 font-medium">Monitor all incoming and outgoing wallet activity across the platform.</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="bg-white border border-slate-200 text-secondary px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
                >
                    <Download size={14} className="text-primary" /> Export CSV
                </button>
            </header>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Find transaction or user..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm">
                            <Filter size={14} className="text-slate-400" />
                            <select
                                className="bg-transparent text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                            >
                                <option>All Types</option>
                                <option>Credit</option>
                                <option>Debit</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 border-b border-slate-100">
                                <th className="px-8 py-5">TXN Hash</th>
                                <th className="px-6 py-5">Involved Party</th>
                                <th className="px-6 py-5">Classification</th>
                                <th className="px-6 py-5 text-right">Magnitude</th>
                                <th className="px-6 py-5">Reference</th>
                                <th className="px-8 py-5">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm">
                            {filtered.map((t) => (
                                <tr key={t._id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-8 py-6 font-mono text-[9px] text-slate-300 group-hover:text-secondary group-hover:font-black transition-all uppercase">{t._id.slice(-8)}</td>
                                    <td className="px-6 py-6 font-bold text-secondary">{t.user?.name || 'Unknown'}</td>
                                    <td className="px-6 py-6">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${t.type === 'credit' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                                            }`}>
                                            {t.type === 'credit' ? <ArrowDownLeft size={10} /> : <ArrowUpRight size={10} />}
                                            {t.type}
                                        </div>
                                    </td>
                                    <td className={`px-6 py-6 text-right font-black text-lg ${t.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {t.type === 'credit' ? '+' : '-'} ₹{t.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-6 text-slate-500 font-medium italic text-xs">{t.description}</td>
                                    <td className="px-8 py-6 text-[10px] text-slate-400 font-black uppercase tracking-tighter">{new Date(t.createdAt).toLocaleString()}</td>
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

