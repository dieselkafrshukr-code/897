import React, { useState } from 'react';
import { CatalogService } from '../../services/catalogService';
import type { Product } from '../../services/catalogService';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, DollarSign, Image, Tag, Layers, X, Save } from 'lucide-react';

interface ProductCreatorProps {
    categories: any[];
    onComplete: () => void;
}

const ProductCreator: React.FC<ProductCreatorProps> = ({ categories, onComplete }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: 0,
        basePrice: 0,
        categoryId: '',
        image: '',
        stock: 0
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.categoryId) return alert('Please select a category');

        await CatalogService.addProduct({
            ...formData,
            images: [formData.image],
            status: 'active',
            attributes: {},
            createdAt: new Date()
        });

        onComplete();
        setFormData({ name: '', description: '', price: 0, basePrice: 0, categoryId: '', image: '', stock: 0 });
    };

    return (
        <form onSubmit={handleSubmit} className="glass p-8 rounded-[2.5rem] border-white/5 h-full">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold font-heading">Release New Masterpiece</h3>
                <Package className="text-[#D4AF37]" />
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-2">Product Identity</label>
                        <input
                            required
                            className="w-full glass p-3 rounded-xl text-sm outline-none ring-1 ring-white/10 focus:ring-[#D4AF37]"
                            placeholder="Name (e.g. Royal Diamond Ring)"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-2">Category Assignment</label>
                        <select
                            required
                            className="w-full glass p-3 rounded-xl text-sm outline-none ring-1 ring-white/10 focus:ring-[#D4AF37] appearance-none"
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-2">Pricing (USD)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                            <input
                                type="number"
                                className="w-full glass p-3 pl-10 rounded-xl text-sm outline-none ring-1 ring-white/10"
                                placeholder="Market Price"
                                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value), basePrice: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-2">Inventory Stock</label>
                        <div className="relative">
                            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                            <input
                                type="number"
                                className="w-full glass p-3 pl-10 rounded-xl text-sm outline-none ring-1 ring-white/10"
                                placeholder="Initial Units"
                                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-2">Visual Showcase (Image URL)</label>
                    <div className="relative">
                        <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
                        <input
                            className="w-full glass p-3 pl-10 rounded-xl text-sm outline-none ring-1 ring-white/10"
                            placeholder="Cloud/CDN Image Link"
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-2">Narrative</label>
                    <textarea
                        className="w-full glass p-3 rounded-xl text-sm outline-none ring-1 ring-white/10 h-32 resize-none"
                        placeholder="Product craftsmanship details..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <button
                    type="submit"
                    className="premium-btn w-full py-4 mt-4 flex items-center justify-center gap-2"
                >
                    <Plus size={18} /> Publish to Storefront
                </button>
            </div>
        </form>
    );
};

export default ProductCreator;
