import { useState, useEffect } from 'react';
import { generateIndividualRooms } from '../../../utils/roomData';
import { Search, Filter, MoreVertical, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';

const RoomMgmt = () => {
    const [rooms, setRooms] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');

    useEffect(() => {
        setRooms(generateIndividualRooms());
    }, []);

    const filteredRooms = rooms.filter(room => {
        const matchesSearch = room.roomNumber.includes(search) || room.type.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || room.status === filter;
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-700';
            case 'occupied': return 'bg-red-100 text-red-700';
            case 'maintenance': return 'bg-yellow-100 text-yellow-700';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-secondary">Inventory Management</h1>
                    <p className="text-sm text-slate-500">Managing {rooms.length} total units across all categories.</p>
                </div>
                <button className="bg-secondary text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-800 transition-all flex items-center space-x-2">
                    <span>+ Add New Room</span>
                </button>
            </header>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search room number or type..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <Filter size={18} className="text-slate-400" />
                    <select
                        className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="all">All Rooms</option>
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredRooms.map((room) => (
                    <div key={room.id} className="bg-white border rounded-xl p-5 hover:shadow-md transition-all group relative">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-2xl font-black text-secondary/10 group-hover:text-primary/20 transition-colors">#{room.roomNumber}</span>
                            <button className="text-slate-300 hover:text-secondary"><MoreVertical size={16} /></button>
                        </div>
                        <div className="space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{room.type}</p>
                            <div className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${getStatusColor(room.status)}`}>
                                {room.status === 'available' ? <CheckCircle size={10} className="mr-1" /> : <Clock size={10} className="mr-1" />}
                                {room.status}
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                            <span className="text-[10px] text-slate-400">Last cleaned: {room.lastCleaned}</span>
                            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-secondary"><Edit2 size={14} /></button>
                                <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomMgmt;
