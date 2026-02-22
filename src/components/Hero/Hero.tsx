import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ShoppingCart } from 'lucide-react';

interface HeroProps {
    onShopNow?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onShopNow }) => {
    return (
        <div className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Cinematic Elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37] opacity-10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#A68010] opacity-5 blur-[100px] rounded-full" />
            </div>

            <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[#D4AF37] font-bold tracking-[0.3em] uppercase text-xs mb-4 block"
                    >
                        Spring Summer 2026 Collection
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-5xl lg:text-7xl font-bold mb-6 leading-tight"
                    >
                        Redefining <br />
                        <span className="bg-gradient-to-r from-[#D4AF37] to-[#F9E2AF] bg-clip-text text-transparent">Digital Luxury</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-gray-400 text-lg mb-10 max-w-lg leading-relaxed"
                    >
                        Discover the pinnacle of elegance with our curated collection of haute couture.
                        Crafted for those who demand nothing but perfection.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-center gap-6"
                    >
                        <button onClick={onShopNow} className="premium-btn flex items-center gap-2 px-8 py-4">
                            Explore Now <ArrowRight size={20} />
                        </button>
                        <button className="flex items-center gap-3 font-bold hover:text-[#D4AF37] transition-colors group">
                            <span className="w-12 h-12 glass rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play size={18} fill="#D4AF37" color="#D4AF37" />
                            </span>
                            Watch Film
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-16 flex gap-12"
                    >
                        <div>
                            <p className="text-3xl font-bold">12k+</p>
                            <p className="text-gray-500 text-sm">Unique Pieces</p>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div>
                            <p className="text-3xl font-bold">24</p>
                            <p className="text-gray-500 text-sm">Fashion Awards</p>
                        </div>
                        <div className="w-px h-12 bg-white/10" />
                        <div>
                            <p className="text-3xl font-bold">100%</p>
                            <p className="text-gray-500 text-sm">Handcrafted</p>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative"
                >
                    <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden glass border-white/5">
                        <motion.div
                            animate={{
                                scale: [1, 1.05, 1],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="w-full h-full bg-[url('https://images.unsplash.com/photo-1539109132314-34a77bf4cd10?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center"
                        />
                    </div>

                    {/* Floating Card */}
                    <motion.div
                        animate={{ y: [0, -20, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -bottom-10 -left-10 glass p-6 rounded-2xl max-w-xs shadow-2xl"
                    >
                        <div className="flex items-center gap-4 mb-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                <ShoppingCart size={18} className="text-[#D4AF37]" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Premium Silk Scarf</p>
                                <p className="text-xs text-[#D4AF37]">$249.00</p>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400">Limited edition handmade piece from our latest collection.</p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default Hero;
