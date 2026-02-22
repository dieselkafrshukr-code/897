import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Plus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const AIUpsellPredictor: React.FC = () => {
    const { cart, addToCart } = useCart();
    const [suggestion, setSuggestion] = useState<any>(null);

    useEffect(() => {
        // Simulated AI Logic for "AI Upsell Predictor"
        if (cart.length > 0) {
            // Simple rule-based suggestion
            const hasApparel = cart.some(i => i.name.toLowerCase().includes('suit') || i.name.toLowerCase().includes('dress'));
            if (hasApparel) {
                setSuggestion({
                    id: 201,
                    name: "Signature Silk Tie",
                    price: 85,
                    image: "https://images.unsplash.com/photo-1589756823851-411590bc206f?auto=format&fit=crop&q=80&w=200",
                    reason: "Perfectly complements your selection"
                });
            }
        } else {
            setSuggestion(null);
        }
    }, [cart]);

    if (!suggestion) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 glass rounded-2xl border-[#D4AF37]/20 relative overflow-hidden"
        >
            <div className="flex items-center gap-2 mb-3 text-[#D4AF37]">
                <Sparkles size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">AI Upsell Prediction</span>
            </div>

            <div className="flex gap-3 items-center">
                <img src={suggestion.image} alt={suggestion.name} className="w-12 h-12 object-cover rounded-lg" />
                <div className="flex-grow">
                    <p className="text-xs font-bold">{suggestion.name}</p>
                    <p className="text-[10px] text-gray-400">{suggestion.reason}</p>
                </div>
                <button
                    onClick={() => addToCart({ ...suggestion, quantity: 1 })}
                    className="w-8 h-8 rounded-full bg-[#D4AF37] text-black flex items-center justify-center hover:scale-110 transition-transform"
                >
                    <Plus size={16} />
                </button>
            </div>
        </motion.div>
    );
};

export default AIUpsellPredictor;
