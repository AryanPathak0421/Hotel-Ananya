import { useWallet } from '../../../context/WalletContext';
import { CreditCard, History, Ticket, Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useState } from 'react';

const Wallet = () => {
    const { balance, transactions, coupons, addFunds } = useWallet();
    const [isAdding, setIsAdding] = useState(false);
    const [amount, setAmount] = useState('');

    const handleAddFunds = (e) => {
        e.preventDefault();
        if (amount && !isNaN(amount)) {
            addFunds(Number(amount));
            setAmount('');
            setIsAdding(false);
        }
    };

    return (
        <div className="pt-0 pb-20 bg-cream min-h-screen">
            <div className="section-container">
                <header className="mb-12">
                    <h1 className="text-4xl font-serif text-secondary mb-2">My Digital <span className="text-primary italic">Wallet</span></h1>
                    <p className="opacity-70 font-light">Manage your balance, redeem coupons, and track transactions.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Card */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-secondary rounded-2xl p-8 text-white relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <p className="text-cream/60 text-sm font-medium uppercase tracking-widest mb-1">Available Balance</p>
                                    <h2 className="text-5xl font-bold tracking-tighter">₹{balance.toLocaleString()}</h2>
                                </div>
                                <CreditCard className="text-primary" size={40} />
                            </div>
                            <div className="relative z-10 mt-12 flex space-x-4">
                                <button
                                    onClick={() => setIsAdding(true)}
                                    className="bg-primary hover:bg-accent text-secondary px-6 py-2.5 rounded-lg font-bold flex items-center space-x-2 transition-all"
                                >
                                    <Plus size={20} />
                                    <span>Add Funds</span>
                                </button>
                                <button className="border border-white/20 hover:bg-white/10 px-6 py-2.5 rounded-lg font-medium transition-all">
                                    Withdrawal
                                </button>
                            </div>
                        </div>

                        {/* Transaction History */}
                        <div className="bg-white rounded-2xl p-8 border shadow-sm">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-secondary flex items-center space-x-2">
                                    <History size={20} className="text-primary" />
                                    <span>Recent Activity</span>
                                </h3>
                            </div>

                            <div className="space-y-6">
                                {transactions.length > 0 ? transactions.map((t) => (
                                    <div key={t.id} className="flex items-center justify-between py-4 border-b last:border-0 border-slate-50">
                                        <div className="flex items-center space-x-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {t.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-secondary text-sm">{t.description}</p>
                                                <p className="text-xs text-slate-400 capitalize">{new Date(t.date).toLocaleDateString()} • {t.type}</p>
                                            </div>
                                        </div>
                                        <p className={`font-bold ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                            {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                        </p>
                                    </div>
                                )) : (
                                    <div className="text-center py-12 text-slate-400 italic font-light">
                                        No transactions yet. Start your journey with Ananya!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Coupons */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-2xl p-8 border shadow-sm">
                            <h3 className="text-lg font-bold text-secondary flex items-center space-x-2 mb-6">
                                <Ticket size={20} className="text-primary" />
                                <span>Exclusive Offers</span>
                            </h3>
                            <div className="space-y-4">
                                {coupons.map(coupon => (
                                    <div key={coupon.id} className="p-4 border-2 border-dashed border-primary/30 rounded-xl relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 bg-primary text-secondary px-2 py-0.5 text-[10px] font-bold">
                                            {coupon.discount}% OFF
                                        </div>
                                        <p className="text-sm font-bold text-secondary mb-1">{coupon.code}</p>
                                        <p className="text-xs text-slate-500 font-light">{coupon.description}</p>
                                        <button className="mt-3 text-[10px] font-bold text-primary uppercase tracking-widest hover:text-accent transition-colors">
                                            Copy Code
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-primary/10 rounded-2xl p-6 border border-primary/20">
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Pro Tip</p>
                            <p className="text-sm text-secondary leading-relaxed font-light">
                                Add at least ₹5000 to your wallet to unlock <span className="font-bold">Ananya Platinum</span> status and get free room upgrades!
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Funds Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-secondary/80 backdrop-blur-sm" onClick={() => setIsAdding(false)}></div>
                    <div className="bg-white relative z-10 w-full max-w-md rounded-2xl p-8 animate-in fade-in zoom-in duration-300">
                        <h3 className="text-2xl font-serif mb-6 text-secondary">Add Funds to Wallet</h3>
                        <form onSubmit={handleAddFunds} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Amount (INR)</label>
                                <input
                                    type="text"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount (e.g. 5000)"
                                    className="w-full bg-slate-50 border-0 p-4 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all text-xl font-bold text-secondary"
                                    autoFocus
                                />
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-secondary">Cancel</button>
                                <button type="submit" className="flex-1 btn-premium">Continue</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wallet;
