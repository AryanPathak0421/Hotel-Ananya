import { bookings } from '../../../utils/dummyData';
import { Search, Filter, Calendar, User, CreditCard } from 'lucide-react';

const Bookings = () => {
    return (
        <div className="space-y-6">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Reservations</h1>
                    <p className="text-sm text-slate-500">Manage all guest bookings and check-in status.</p>
                </div>
                <div className="flex space-x-3">
                    <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/20">Download Report</button>
                    <button className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-bold">New Booking</button>
                </div>
            </header>

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between bg-slate-50/50">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" placeholder="Search guests, rooms..." className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/50" />
                    </div>
                    <div className="flex space-x-2">
                        <select className="bg-white border rounded-lg px-3 py-2 text-sm outline-none">
                            <option>All Status</option>
                            <option>Confirmed</option>
                            <option>Pending</option>
                            <option>Completed</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-[10px] uppercase font-bold tracking-widest text-slate-400 border-b">
                                <th className="px-6 py-4">Booking ID</th>
                                <th className="px-6 py-4">Guest</th>
                                <th className="px-6 py-4">Room</th>
                                <th className="px-6 py-4">Check In/Out</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                            {bookings.map((bk) => (
                                <tr key={bk.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 font-bold text-secondary">{bk.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-secondary font-bold text-xs uppercase">
                                                {bk.guest.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span>{bk.guest}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">#{bk.room}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-xs text-slate-500">
                                            <Calendar size={14} className="text-primary" />
                                            <span>{bk.checkIn} → {bk.checkOut}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold">₹{bk.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${bk.status === 'Confirmed' ? 'bg-blue-50 text-blue-600' :
                                                bk.status === 'Pending' ? 'bg-yellow-50 text-yellow-600' :
                                                    bk.status === 'Checked In' ? 'bg-green-50 text-green-600' :
                                                        'bg-slate-100 text-slate-600'
                                            }`}>
                                            {bk.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-primary hover:underline font-bold text-xs">View Data</button>
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

export default Bookings;
