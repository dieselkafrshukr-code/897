import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AIRecommendation {
    reason: string;
    products: any[];
}

const PersonalizationEngine: React.FC = () => {
    const { profile } = useUser();
    const [recommendations, setRecommendations] = useState<AIRecommendation | null>(null);

    useEffect(() => {
        if (profile) {
            const recs: AIRecommendation = {
                reason: profile.history.length > 0 ? "Based on your last interest" : "Top Picks for You",
                products: []
            };

            if (profile.points > 1000) {
                recs.reason = "Exclusive Deals for Silver Members";
            }

            setRecommendations(recs);
        }
    }, [profile]);

    if (!profile) return null;

    return (
        <div className="py-12">
            <div className="flex items-center gap-3 mb-8">
                <Sparkles className="text-[#D4AF37]" />
                <h2 className="text-3xl font-bold font-heading">
                    {recommendations?.reason || "AI Personal Shopper"}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass p-8 rounded-3xl col-span-full text-center py-16 border-dashed border-[#D4AF37]/30"
                >
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <Sparkles size={48} className="text-[#D4AF37] animate-pulse" />
                            <div className="absolute inset-0 blur-xl bg-[#D4AF37] opacity-20" />
                        </div>
                    </div>
                    <p className="text-gray-400 italic text-lg max-w-md mx-auto">
                        "Youssef AI is currently studying your aesthetic preferences to generate a personalized gallery..."
                    </p>
                    <div className="flex justify-center mt-8 gap-1">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PersonalizationEngine;
