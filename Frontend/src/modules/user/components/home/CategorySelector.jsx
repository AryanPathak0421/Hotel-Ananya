import React from 'react';
import { useNavigate } from 'react-router-dom';

const categories = ['Overview', 'Suites', 'Pool', 'Dine', 'Spas'];

const CategorySelector = () => {
    const navigate = useNavigate();

    return (
        <section className="py-4 overflow-hidden border-b border-slate-100 bg-white">
            <div className="flex overflow-x-auto px-4 space-x-1.5 no-scrollbar">
                {categories.map((cat, i) => (
                    <button
                        key={i}
                        onClick={() => i === 1 ? navigate('/rooms') : i === 4 ? navigate('/about') : null}
                        className={`flex-shrink-0 px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'bg-secondary text-white shadow-md' : 'bg-white text-secondary/40 border border-slate-100 hover:border-primary/20'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </section>
    );
};

export default CategorySelector;
