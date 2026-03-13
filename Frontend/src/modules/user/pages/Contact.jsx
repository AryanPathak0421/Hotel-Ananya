import { MapPin, Phone, Mail, Send, Clock } from 'lucide-react';

const Contact = () => {
    return (
        <div className="pt-0 pb-20 bg-cream min-h-screen">
            <div className="section-container">
                <header className="mb-16 text-center">
                    <h1 className="text-4xl md:text-6xl font-serif mb-4">Get In <span className="text-primary italic">Touch</span></h1>
                    <p className="opacity-70 font-light">We are here to help you plan your perfect getaway.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <div className="space-y-12">
                        <div className="space-y-8">
                            <h2 className="text-3xl font-serif text-secondary lowercase capitalize">Contact Information</h2>
                            <p className="text-slate-500 font-light leading-relaxed">
                                Feel free to reach out to us for bookings, inquiries, or any special requests.
                                Our team is available 24/7 to assist you.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-secondary uppercase text-xs tracking-widest mb-1">Our Location</h4>
                                    <p className="text-sm text-slate-500">New Digha, Digha, West Bengal - 721428</p>
                                    <a href="https://goo.gl/maps/Yrsjyiv6ivuG2Hko7" target="_blank" className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline mt-2 inline-block">View on Google Maps</a>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-secondary uppercase text-xs tracking-widest mb-1">Call Us</h4>
                                    <p className="text-sm text-slate-500">+91 74071 75567</p>
                                    <p className="text-sm text-slate-500">+91 98765 43210 (Support)</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-secondary uppercase text-xs tracking-widest mb-1">Email Us</h4>
                                    <p className="text-sm text-slate-500">hello@ananyahotel.com</p>
                                    <p className="text-sm text-slate-500">bookings@ananyahotel.com</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-6">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-secondary uppercase text-xs tracking-widest mb-1">Reception Hours</h4>
                                    <p className="text-sm text-slate-500">Open 24 Hours / 7 Days a week</p>
                                    <p className="text-sm text-slate-500">Check-in: 12:00 PM | Check-out: 11:00 AM</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">First Name</label>
                                    <input type="text" className="w-full bg-slate-50 border-0 p-4 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm" placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Last Name</label>
                                    <input type="text" className="w-full bg-slate-50 border-0 p-4 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm" placeholder="Doe" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                <input type="email" className="w-full bg-slate-50 border-0 p-4 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm" placeholder="john@example.com" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Subject</label>
                                <select className="w-full bg-slate-50 border-0 p-4 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm cursor-pointer appearance-none">
                                    <option>Room Booking Inquiry</option>
                                    <option>Restaurant Reservation</option>
                                    <option>Special Event / Wedding</option>
                                    <option>General Support</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Message</label>
                                <textarea rows="4" className="w-full bg-slate-50 border-0 p-4 rounded-xl focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm" placeholder="How can we help you?"></textarea>
                            </div>
                            <button type="submit" className="w-full btn-premium flex items-center justify-center space-x-2">
                                <span>Send Message</span>
                                <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Map Embed */}
                <div className="mt-20 h-[450px] bg-slate-200 rounded-3xl overflow-hidden shadow-2xl relative">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3701.3533230635465!2d87.5029377!3d21.6214309!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0327f2c8d23d8b%3A0x47e812d8a0c23945!2sAnanya%20Hotel!5e0!3m2!1sen!2sin!4v1657891234567!5m2!1sen!2sin"
                        className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
                        allowFullScreen=""
                        loading="lazy"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default Contact;
