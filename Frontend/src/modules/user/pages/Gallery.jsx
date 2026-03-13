import { useState } from 'react';
import { Maximize2, X } from 'lucide-react';

const images = [
    { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', category: 'Exterior' },
    { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', category: 'Pool' },
    { url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80', category: 'Lobby' },
    { url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80', category: 'Rooms' },
    { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', category: 'Rooms' },
    { url: 'https://images.unsplash.com/photo-1551882547-ff43c69e5cf2?auto=format&fit=crop&w=800&q=80', category: 'Restaurant' },
    { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', category: 'Exterior' },
    { url: 'https://images.unsplash.com/photo-1596422846543-b5c64863e939?auto=format&fit=crop&w=800&q=80', category: 'Pool' },
];

const Gallery = () => {
    const [filter, setFilter] = useState('All');
    const [selectedImg, setSelectedImg] = useState(null);

    const categories = ['All', 'Exterior', 'Pool', 'Lobby', 'Rooms', 'Restaurant'];

    const filteredImages = filter === 'All'
        ? images
        : images.filter(img => img.category === filter);

    return (
        <div className="pt-0 pb-20 bg-cream min-h-screen">
            <div className="section-container">
                <header className="mb-20 text-center max-w-4xl mx-auto space-y-6">
                    <div className="inline-block px-4 py-1.5 border border-primary/20 bg-primary/5 rounded-full">
                        <span className="text-primary font-bold tracking-[0.4em] uppercase text-[9px] block">Aesthetic Journey</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-serif lowercase leading-none tracking-tight">
                        Our Visual <br />
                        <span className="text-primary italic">Story.</span>
                    </h1>
                    <div className="w-12 h-[1px] bg-primary/30 mx-auto"></div>
                    <p className="text-lg text-slate-500 font-light leading-relaxed max-w-2xl mx-auto">
                        Capturing the soulful moments of boutique luxury.
                        From the golden hues of dawn to the refined interiors of our sanctuaries.
                    </p>
                </header>

                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-xs font-bold tracking-widest uppercase transition-all ${filter === cat
                                ? 'bg-primary text-white shadow-lg'
                                : 'bg-white text-secondary hover:bg-slate-100'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredImages.map((img, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl overflow-hidden group relative cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 aspect-square"
                            onClick={() => setSelectedImg(img.url)}
                        >
                            <img src={img.url} alt={img.category} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-secondary/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 size={32} className="text-white animate-in zoom-in duration-300" />
                            </div>
                            <div className="absolute bottom-4 left-4 bg-primary text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest">
                                {img.category}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Lightbox */}
            {selectedImg && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-secondary/95 backdrop-blur-xl" onClick={() => setSelectedImg(null)}></div>
                    <button className="absolute top-8 right-8 text-white hover:text-primary transition-colors z-10" onClick={() => setSelectedImg(null)}>
                        <X size={40} />
                    </button>
                    <img
                        src={selectedImg}
                        className="relative z-10 max-w-full max-h-[90vh] object-contain shadow-2xl animate-in zoom-in duration-300"
                        alt="Zoomed"
                    />
                </div>
            )}
        </div>
    );
};

export default Gallery;
