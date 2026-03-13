import { ArrowRight, Star, Coffee, Waves } from 'lucide-react';

const About = () => {
    return (
        <div className="pt-0 pb-20 bg-cream min-h-screen">
            <div className="section-container">
                <header className="mb-16 text-center max-w-4xl mx-auto">
                    <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs mb-4 block">Our Heritage</span>
                    <h1 className="text-4xl md:text-6xl mb-8 font-serif">Welcome to <span className="text-primary italic">Ananya Hotel</span></h1>
                    <p className="text-xl opacity-70 font-light leading-relaxed">
                        Located just behind the first plot of sea line in New Digha, Ananya Hotel has been a
                        haven for travelers seeking comfort and peace for years. We offer a perfect blend
                        of modern amenities and traditional hospitality.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                    <div className="relative group">
                        <div className="absolute inset-0 border-2 border-primary translate-x-4 translate-y-4 -z-10 transition-transform group-hover:translate-x-6 group-hover:translate-y-6"></div>
                        <img
                            src="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=800&q=80"
                            alt="Hotel Lobby"
                            className="w-full h-[500px] object-cover shadow-2xl"
                        />
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-3xl md:text-4xl font-serif text-secondary lowercase capitalize">Relax, Revitalize, Rejuvenate</h2>
                        <p className="text-slate-600 leading-relaxed font-light">
                            An ideal choice for friends, families & couples to relax and unwind. Give yourself
                            a chance to get close to nature and experience the cool sea breeze. Our proximity
                            to the beach (just a 2-minute walk) makes us one of the most sought-after staycations
                            in New Digha.
                        </p>
                        <div className="grid grid-cols-2 gap-6 pt-6">
                            <div className="flex items-start space-x-3">
                                <Waves className="text-primary mt-1" size={24} />
                                <div>
                                    <h4 className="font-bold text-secondary text-sm uppercase">Near Beach</h4>
                                    <p className="text-xs text-slate-500">2 min walk to the shore</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Star className="text-primary mt-1" size={24} />
                                <div>
                                    <h4 className="font-bold text-secondary text-sm uppercase">Premium Service</h4>
                                    <p className="text-xs text-slate-500">24/7 Guest assistance</p>
                                </div>
                            </div>
                            <div className="flex items-start space-x-3">
                                <Coffee className="text-primary mt-1" size={24} />
                                <div>
                                    <h4 className="font-bold text-secondary text-sm uppercase">Multi-Cuisine</h4>
                                    <p className="text-xs text-slate-500">Delicious local & global food</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Team / Mission section placeholder */}
                <div className="bg-secondary p-12 md:p-20 text-white rounded-3xl text-center">
                    <h3 className="text-3xl font-serif mb-6 italic text-primary">"The Hotel That Makes Every Moment Matters"</h3>
                    <p className="max-w-2xl mx-auto text-cream/70 font-light leading-relaxed mb-8">
                        Our mission is to provide an unforgettable experience for every guest. From our
                        attentive staff to our carefully designed rooms, we ensure that your stay
                        is nothing short of perfection.
                    </p>
                    <button className="flex items-center space-x-2 mx-auto text-primary font-bold tracking-widest uppercase text-xs hover:text-white transition-colors">
                        <span>Read More Reviews</span>
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default About;
