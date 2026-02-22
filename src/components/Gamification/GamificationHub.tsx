import React from 'react';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { Trophy, Star, Shield, Zap, Gift } from 'lucide-react';

const GamificationHub: React.FC = () => {
    const { profile } = useUser();

    if (!profile) return null;

    const levels = [
        { name: 'Bronze', color: '#CD7F32', min: 0, icon: <Shield /> },
        { name: 'Silver', color: '#C0C0C0', min: 500, icon: <Star /> },
        { name: 'Gold', color: '#D4AF37', min: 2000, icon: <Trophy /> },
        { name: 'Platinum', color: '#E5E4E2', min: 5000, icon: <Zap /> },
    ];

    const currentLevelIndex = levels.findIndex(l => l.name === profile.level);
    const currentLevel = levels[currentLevelIndex] || levels[0];
    const nextLevel = levels[currentLevelIndex + 1];
    const progress = nextLevel ? (profile.points / nextLevel.min) * 100 : 100;

    return (
        <div className="glass p-8 rounded-[2rem] border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
                <Trophy size={120} />
            </div>

            <div className="flex flex-col md:flex-row gap-12 items-center">
                <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 6, repeat: Infinity }}
                    className="w-32 h-32 rounded-full flex items-center justify-center text-4xl shadow-2xl relative"
                    style={{ background: `linear-gradient(135deg, ${currentLevel.color}, #000)` }}
                >
                    {currentLevel.icon}
                    <div className="absolute inset-0 rounded-full animate-ping border-2 border-white/20" />
                </motion.div>

                <div className="flex-grow">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                            <h3 className="text-3xl font-bold font-heading">{profile.level} Elite</h3>
                            <p className="text-gray-400">Current Balance: <span className="text-[#D4AF37] font-bold">{profile.points} XP</span></p>
                        </div>
                        {nextLevel && (
                            <p className="text-xs text-gray-500 uppercase tracking-widest">
                                {nextLevel.min - profile.points} XP until {nextLevel.name}
                            </p>
                        )}
                    </div>

                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden mb-8 ring-1 ring-white/10">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-[#D4AF37] to-[#F9E2AF]"
                        />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { label: 'Total Orders', value: '12', icon: <Gift size={14} /> },
                            { label: 'Referrals', value: '3', icon: <Star size={14} /> },
                            { label: 'Review Points', value: '450', icon: <Shield size={14} /> },
                            { label: 'Lucky Spins', value: '2', icon: <Zap size={14} /> },
                        ].map((stat, i) => (
                            <div key={i} className="glass p-4 rounded-xl flex items-center gap-3">
                                <div className="text-[#D4AF37]">{stat.icon}</div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase">{stat.label}</p>
                                    <p className="font-bold">{stat.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamificationHub;
