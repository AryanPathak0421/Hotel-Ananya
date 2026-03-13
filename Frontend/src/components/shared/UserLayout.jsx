import { Outlet, Link } from 'react-router-dom';
import Navbar from './Navbar';
import BottomNavbar from './BottomNavbar';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const UserLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pb-16 md:pb-0">
                <Outlet />
            </main>
            <BottomNavbar />

            <footer className="hidden md:block bg-secondary text-white pt-24 pb-12">
                <div className="section-container !py-0">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        <div className="md:col-span-2 space-y-8">
                            <Link to="/" className="inline-block">
                                <img src="/logo.png" alt="Ananya Hotel" className="h-16 w-auto brightness-0 invert" />
                            </Link>
                            <p className="text-white/50 font-light leading-loose max-w-md">
                                A sanctuary where the sound of the ocean meets refined luxury.
                                Located just steps away from the New Digha beach, offering
                                an unparalleled retreat for the discerning traveler.
                            </p>
                            <div className="flex space-x-6">
                                {[Instagram, Facebook, Twitter].map((Icon, i) => (
                                    <Icon key={i} size={20} className="text-white/30 hover:text-primary transition-colors cursor-pointer" />
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Discover</h4>
                            <ul className="space-y-4 text-sm font-light text-white/50">
                                <li><Link to="/rooms" className="hover:text-white transition-colors">Our Sanctuaries</Link></li>
                                <li><Link to="/gallery" className="hover:text-white transition-colors">Visual Story</Link></li>
                                <li><Link to="/about" className="hover:text-white transition-colors">The Heritage</Link></li>
                                <li><Link to="/contact" className="hover:text-white transition-colors">Locate Us</Link></li>
                            </ul>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Contact</h4>
                            <ul className="space-y-4 text-sm font-light text-white/50">
                                <li className="flex items-start space-x-3">
                                    <MapPin size={16} className="text-primary shrink-0" />
                                    <span>New Digha, Near Sea Beach, West Bengal</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Phone size={16} className="text-primary shrink-0" />
                                    <span>+91 98765 43210</span>
                                </li>
                                <li className="flex items-center space-x-3">
                                    <Mail size={16} className="text-primary shrink-0" />
                                    <span>stay@ananyahotel.com</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:row justify-between items-center space-y-4 md:space-y-0 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                        <p>© 2026 Ananya Hotels Pvt. Ltd.</p>
                        <div className="flex space-x-8">
                            <span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span>
                            <span className="cursor-pointer hover:text-white transition-colors">Terms of Stay</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default UserLayout;
