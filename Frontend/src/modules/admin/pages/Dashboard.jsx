const Dashboard = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Rooms', value: '46', sub: 'Fixed Inventory' },
                    { label: 'Active Bookings', value: '32', sub: '70% Occupancy' },
                    { label: 'Today\'s Revenue', value: '₹42,500', sub: '+12% from yesterday' },
                    { label: 'Pending Wallet Trans', value: '8', sub: 'Requires Review' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white p-6 rounded-xl border">
                        <p className="text-sm text-slate-500 font-medium mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-secondary">{stat.value}</p>
                        <p className="text-xs text-green-600 mt-2">{stat.sub}</p>
                    </div>
                ))}
            </div>
            <div className="bg-white border rounded-xl p-8 h-96 flex items-center justify-center text-slate-400 italic">
                Occupancy Chart Placeholder
            </div>
        </div>
    );
};

export default Dashboard;
