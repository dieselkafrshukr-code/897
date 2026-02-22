import React, { useState, useEffect } from 'react';
import { CatalogService, Product } from '../../services/catalogService';
import { motion, AnimatePresence } from 'framer-motion';
import {
    DollarSign, Package, Users, BarChart3, ArrowUpRight,
    ShieldCheck, Activity, Warehouse, Plus, LayoutGrid, ListTree, ShoppingBag
} from 'lucide-react';
import SystemHealth from './SystemHealth';
import CategoryManager from './CategoryManager';
import ProductCreator from './ProductCreator';
import OrderManager from './OrderManager';
import { usePermissions } from '../../hooks/usePermissions';

const MarketplaceDashboard: React.FC = () => {
    const { hasPermission } = usePermissions();
    const [activeTab, setActiveTab] = useState<'business' | 'catalog' | 'system' | 'inventory' | 'orders'>('business');
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        loadCatalogInfo();
    }, []);

    const loadCatalogInfo = async () => {
        const cats = await CatalogService.getCategories();
        setCategories(cats);
    };

    const stats = [
        { label: 'Total Revenue', value: '$124,500.00', icon: <DollarSign />, trend: '+12.5%' },
        { label: 'Market Categories', value: categories.length.toString(), icon: <ListTree />, trend: 'Dynamic' },
        { label: 'Market Reach', value: '12 Countries', icon: <Users />, trend: '+2' },
        { label: 'Conversion Rate', value: '4.8%', icon: <BarChart3 />, trend: '+0.8%' },
    ];

    return (
        <div className="py-24 container mx-auto px-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <ShieldCheck className="text-[#D4AF37]" size={20} />
                        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Secured Command Center</span>
                    </div>
                    <h2 className="text-5xl font-bold font-heading tracking-tighter uppercase">Enterprise <span className="text-[#D4AF37]">Studio</span></h2>
                </div>

                <div className="flex glass p-1 rounded-full border-none ring-1 ring-white/10 overflow-x-auto">
                    {[
                        { id: 'business', label: 'Overview', icon: <BarChart3 size={14} /> },
                        { id: 'catalog', label: 'Catalog Engine', icon: <LayoutGrid size={14} />, perm: 'MANAGE_PRODUCTS' },
                        { id: 'orders', label: 'Order Hub', icon: <ShoppingBag size={14} />, perm: 'MANAGE_ORDERS' },
                        { id: 'inventory', label: 'Warehousing', icon: <Warehouse size={14} />, perm: 'MANAGE_INVENTORY' },
                        { id: 'system', label: 'Core', icon: <Activity size={14} />, perm: 'VIEW_SYSTEM_HEALTH' },
                    ].map((tab) => {
                        if (tab.perm && !hasPermission(tab.perm as any)) return null;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] uppercase font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {tab.icon} {tab.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'catalog' && (
                    <motion.div
                        key="catalog"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                    >
                        <CategoryManager />
                        <ProductCreator categories={categories} onComplete={loadCatalogInfo} />
                    </motion.div>
                )}

                {activeTab === 'business' && (
                    <motion.div key="business" className="space-y-12">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {stats.map((s, i) => (
                                <div key={i} className="glass p-8 rounded-[2rem] group border-white/5 hover:border-[#D4AF37]/50 transition-all">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                                            {s.icon}
                                        </div>
                                    </div>
                                    <p className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">{s.label}</p>
                                    <h4 className="text-3xl font-bold font-heading">{s.value}</h4>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'system' && <motion.div key="system"><SystemHealth /></motion.div>}

                {activeTab === 'orders' && (
                    <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <OrderManager />
                    </motion.div>
                )}

                {activeTab === 'inventory' && (
                    <motion.div key="warehouse" className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="glass p-8 rounded-[2.5rem] border-white/5">
                                <h4 className="text-lg font-bold mb-4 font-heading">Hub #{i}</h4>
                                <p className="text-xs text-gray-500 mb-4">Stock sync active with Google Cloud Nodes</p>
                                <button className="w-full glass py-3 rounded-2xl text-[10px] uppercase font-bold text-[#D4AF37]">Manage</button>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MarketplaceDashboard;
