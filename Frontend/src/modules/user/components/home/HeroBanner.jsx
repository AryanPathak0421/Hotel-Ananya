import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const banners = [
    {
        tag: 'Limited Offer',
        title: 'Summer escapes flat 30% off.',
        img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
        btn: 'Explore Secret Deals'
    },
    {
        tag: 'New Season',
        title: 'Monsoon retreats in style.',
        img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
        btn: 'View Packages'
    },
    {
        tag: 'Fine Dining',
        title: 'Royal feasts at Ananya.',
        img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
        btn: 'Book a Table'
    }
];

const HeroBanner = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }, 8000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="pt-0 overflow-hidden">
            <div className="relative h-44 bg-secondary shadow-lg">
                {banners.map((slide, index) => (
                    <div
                        key={index}
                        onClick={() => navigate('/rooms')}
                        className={`absolute inset-0 cursor-pointer transition-all duration-[1.5s] ease-in-out ${index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}
                    >
                        <img
                            src={slide.img}
                            className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[0.5]"
                            alt={slide.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/40 to-transparent"></div>
                        <div className="absolute inset-y-0 left-0 w-full p-6 flex flex-col justify-center space-y-2 z-10">
                            <div className="inline-block bg-accent text-secondary text-[7px] font-black px-1.5 py-0.5 rounded-[2px] w-fit uppercase tracking-widest">{slide.tag}</div>
                            <h2 className="text-white font-serif text-lg leading-tight lowercase max-w-[200px]">
                                {slide.title.split(' ').map((word, i) => (
                                    i % 2 !== 0 ? <span key={i} className="text-primary italic"> {word} </span> : word + ' '
                                ))}
                            </h2>
                            <button className="text-[9px] font-black text-white/80 uppercase tracking-widest flex items-center group/btn w-fit pt-2">
                                {slide.btn} <ChevronRight size={10} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                ))}

                <div className="absolute bottom-4 left-6 flex space-x-1.5 z-20">
                    {banners.map((_, i) => (
                        <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === currentSlide ? 'w-4 bg-primary' : 'w-1 bg-white/30'}`}></div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroBanner;
