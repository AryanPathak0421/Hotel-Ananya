import { useNavigate } from 'react-router-dom';
import { roomCategories } from '../../../utils/roomData';
import { Bed, Users, Square, CheckCircle2 } from 'lucide-react';

const Rooms = () => {
    const navigate = useNavigate();

    return (
        <div className="pt-0 pb-40 bg-cream min-h-screen">
            <div className="section-container">
                <header className="mb-20 text-center max-w-4xl mx-auto space-y-6">
                    <div className="inline-block px-4 py-1.5 border border-primary/20 bg-primary/5 rounded-full">
                        <span className="text-primary font-bold tracking-[0.4em] uppercase text-[9px] block">Exclusive Living</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-serif lowercase leading-none tracking-tight">
                        Our <br />
                        <span className="text-primary italic">Sanctuaries.</span>
                    </h1>
                    <div className="w-12 h-[1px] bg-primary/30 mx-auto"></div>
                    <p className="text-lg text-slate-500 font-light leading-relaxed max-w-2xl mx-auto">
                        Each of our 46 rooms is a testament to boutique luxury,
                        where coastal charm meets modern comfort. Crafted for those who seek the sublime.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                    {roomCategories.map((room) => (
                        <div
                            key={room.type}
                            className="luxury-card group overflow-hidden bg-white"
                        >
                            <div className="aspect-[4/5] overflow-hidden relative">
                                <img
                                    src={room.image}
                                    alt={room.type}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute top-6 right-6 px-4 py-2 glass rounded-full text-[10px] font-bold text-secondary uppercase tracking-widest">
                                    ₹{room.price} <span className="opacity-40">/ Night</span>
                                </div>
                            </div>

                            <div className="p-10 space-y-6 text-center lg:text-left">
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-serif text-secondary">{room.type}</h3>
                                    <div className="flex items-center justify-center lg:justify-start space-x-4 text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">
                                        <span>{room.size}</span>
                                        <div className="w-1 h-1 bg-primary/30 rounded-full"></div>
                                        <span>{room.bed} Bed</span>
                                    </div>
                                </div>

                                <p className="text-slate-500 font-light text-sm leading-loose">
                                    Experience the perfect blend of coastal serenity and modern luxury in our {room.type.toLowerCase()}. Designed with an eye for detail.
                                </p>

                                <div className="flex flex-wrap justify-center lg:justify-start gap-2 pt-2">
                                    {room.amenities.slice(0, 3).map(amenity => (
                                        <span key={amenity} className="text-[9px] uppercase tracking-widest font-bold border border-slate-100 px-3 py-1.5 text-slate-400 rounded-md">
                                            {amenity}
                                        </span>
                                    ))}
                                </div>

                                <button
                                    onClick={() => navigate('/book', { state: { room } })}
                                    className="w-full btn-premium !py-5 flex items-center justify-center space-x-4 group/btn"
                                >
                                    <span>Check Availability</span>
                                    <div className="w-0 group-hover/btn:w-4 h-[1px] bg-white transition-all duration-500"></div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Rooms;
