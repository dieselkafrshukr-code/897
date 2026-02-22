import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy, X, Send, ChevronRight, HelpCircle, MessageSquare } from 'lucide-react';

const SupportSystem: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'home' | 'ticket' | 'faq'>('home');

    return (
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-28 right-8 z-[2900] w-14 h-14 bg-white/10 glass rounded-full flex items-center justify-center border border-white/20 hover:border-[#D4AF37]/50 transition-colors"
            >
                <LifeBuoy size={24} className="text-[#D4AF37]" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[3100]"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            className="fixed right-0 top-0 h-full w-[400px] glass z-[3200] p-10 flex flex-col border-l border-white/5"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <h2 className="text-3xl font-bold font-heading">Concierge <span className="text-[#D4AF37]">Support</span></h2>
                                <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
                            </div>

                            {view === 'home' && (
                                <div className="space-y-6">
                                    <p className="text-gray-400 text-sm mb-8">How can we assist your luxury journey today?</p>

                                    <button
                                        onClick={() => setView('ticket')}
                                        className="w-full glass p-6 rounded-3xl flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]"><MessageSquare size={20} /></div>
                                            <div>
                                                <p className="font-bold text-sm">Open Support Ticket</p>
                                                <p className="text-[10px] text-gray-500">Typical response: <span className="text-white">12 minutes</span></p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-500 group-hover:translate-x-1" />
                                    </button>

                                    <button
                                        onClick={() => setView('faq')}
                                        className="w-full glass p-6 rounded-3xl flex items-center justify-between group hover:border-[#D4AF37]/30 transition-all text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400"><HelpCircle size={20} /></div>
                                            <div>
                                                <p className="font-bold text-sm">Smart Knowledge Base</p>
                                                <p className="text-[10px] text-gray-500">Find answers instantly</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-500 group-hover:translate-x-1" />
                                    </button>

                                    <div className="pt-12">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] mb-4">Elite Benefits</h4>
                                        <ul className="space-y-2">
                                            {['Priority Handling', '24/7 Global Access', 'Expert Style Advice'].map((b, i) => (
                                                <li key={i} className="text-[11px] text-gray-400 flex items-center gap-2">
                                                    <div className="w-1 h-1 bg-[#D4AF37] rounded-full" /> {b}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {view === 'ticket' && (
                                <div className="space-y-6 flex flex-col h-full">
                                    <button onClick={() => setView('home')} className="text-[#D4AF37] text-xs font-bold mb-4">← Back</button>
                                    <p className="text-sm font-medium mb-4">Describe the issue or inquiry</p>
                                    <div className="flex-grow space-y-4">
                                        <input className="w-full glass p-4 rounded-xl text-sm border-none ring-1 ring-white/10 outline-none" placeholder="Subject" />
                                        <textarea
                                            className="w-full glass p-4 rounded-xl text-sm border-none ring-1 ring-white/10 outline-none h-48 resize-none"
                                            placeholder="What can we help you with?"
                                        />
                                    </div>
                                    <button className="premium-btn w-full py-4 flex items-center justify-center gap-2">
                                        <Send size={18} /> Submit Ticket
                                    </button>
                                </div>
                            )}

                            {view === 'faq' && (
                                <div className="space-y-4">
                                    <button onClick={() => setView('home')} className="text-[#D4AF37] text-xs font-bold mb-8">← Back</button>
                                    {[
                                        "How to track my Aramex shipment?",
                                        "What is the Gold Membership benefit?",
                                        "How to apply for a Vendor account?",
                                        "Do you offer international shipping?"
                                    ].map((q, i) => (
                                        <div key={i} className="glass p-4 rounded-xl text-xs hover:bg-white/5 cursor-pointer border-white/5">
                                            {q}
                                        </div>
                                    ))}
                                </div>
                            )}

                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

export default SupportSystem;
