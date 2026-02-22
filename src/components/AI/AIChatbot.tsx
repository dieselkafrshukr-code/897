import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';

const AIChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ai', text: 'Welcome to Youssef Luxury. I am your personal AI assistant. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: 'user', text: input }];
        setMessages(newMessages);
        setInput('');

        // Simulated AI Response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: 'ai',
                text: `I've analyzed your request regarding "${input}". At Youssef Store, we prioritize your elegance. Would you like me to show you our limited edition obsidian collection?`
            }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-8 right-8 z-[3000]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[350px] h-[500px] glass rounded-[2.5rem] flex flex-col overflow-hidden shadow-2xl border-white/10"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-r from-[#D4AF37] to-[#A68010] text-black flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Sparkles size={18} />
                                <span className="font-bold text-sm">YOUSSEF AI</span>
                            </div>
                            <button onClick={() => setIsOpen(false)}><X size={20} /></button>
                        </div>

                        {/* Chat Messages */}
                        <div className="flex-grow overflow-y-auto p-6 space-y-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'ai' ? 'justify-start' : 'justify-end'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${m.role === 'ai' ? 'glass text-white' : 'bg-[#D4AF37] text-black font-medium'
                                        }`}>
                                        {m.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-6 border-t border-white/5 bg-black/20">
                            <div className="flex gap-2 items-center glass p-2 rounded-xl">
                                <input
                                    type="text"
                                    placeholder="Type your question..."
                                    className="bg-transparent border-none outline-none text-xs flex-grow px-2"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                />
                                <button
                                    onClick={handleSend}
                                    className="w-8 h-8 rounded-lg bg-[#D4AF37] text-black flex items-center justify-center hover:scale-110 transition-transform"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-16 h-16 rounded-full bg-[#D4AF37] text-black shadow-2xl flex items-center justify-center relative group"
            >
                <MessageSquare size={24} />
                <div className="absolute inset-0 rounded-full bg-[#D4AF37] animate-ping opacity-20 pointer-events-none" />

                {/* Tooltip */}
                <div className="absolute right-full mr-4 bg-black text-white text-[10px] py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10 uppercase tracking-widest font-bold">
                    AI Assistant Online
                </div>
            </motion.button>
        </div>
    );
};

export default AIChatbot;
