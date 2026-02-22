import React, { useState, useEffect } from 'react';
import { CatalogService } from '../../services/catalogService';
import type { Category } from '../../services/catalogService';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Folder, ChevronRight, Trash2, Edit3, Grid } from 'lucide-react';

const CategoryManager: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState('');
    const [parentSelection, setParentSelection] = useState<string | null>(null);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const data = await CatalogService.getCategories();
        setCategories(data);
    };

    const handleAddCategory = async () => {
        if (!newName.trim()) return;
        await CatalogService.addCategory({
            name: newName,
            parentId: parentSelection,
            slug: newName.toLowerCase().replace(/ /g, '-'),
            order: categories.length
        });
        setNewName('');
        setParentSelection(null);
        loadCategories();
    };

    const buildTree = (parentId: string | null = null, depth = 0): React.ReactNode => {
        return categories
            .filter(c => c.parentId === parentId)
            .map(cat => (
                <div key={cat.id} className="ml-6 space-y-2 mt-2">
                    <div className="flex items-center justify-between glass p-3 rounded-xl border-white/5 group hover:border-[#D4AF37]/30 transition-all">
                        <div className="flex items-center gap-3">
                            <Folder size={16} className={depth === 0 ? "text-[#D4AF37]" : "text-gray-500"} />
                            <span className={`text-sm ${depth === 0 ? "font-bold" : "font-medium text-gray-300"}`}>{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => setParentSelection(cat.id)}
                                className="p-1 hover:text-[#D4AF37]"
                                title="Add Sub-category"
                            >
                                <Plus size={14} />
                            </button>
                            <button className="p-1 hover:text-red-500"><Trash2 size={14} /></button>
                        </div>
                    </div>
                    {buildTree(cat.id, depth + 1)}
                </div>
            ));
    };

    return (
        <div className="glass rounded-3xl p-8 border-white/5">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xl font-bold font-heading">Category Architecture</h3>
                    <p className="text-xs text-gray-500">Manage your product tree and nested departments</p>
                </div>
                <Grid className="text-[#D4AF37]" />
            </div>

            {/* Add Form */}
            <div className="mb-10 space-y-4">
                <div className="flex gap-2">
                    <input
                        className="flex-grow glass p-3 rounded-xl text-sm border-none ring-1 ring-white/10 outline-none focus:ring-[#D4AF37]"
                        placeholder={parentSelection ? `New sub-category for: ${categories.find(c => c.id === parentSelection)?.name}` : "Main category name"}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <button
                        onClick={handleAddCategory}
                        className="bg-[#D4AF37] text-black px-6 rounded-xl font-bold text-xs hover:scale-105 transition-transform"
                    >
                        Create
                    </button>
                </div>
                {parentSelection && (
                    <button
                        onClick={() => setParentSelection(null)}
                        className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest pl-2"
                    >
                        × Cancel Sub-category selection
                    </button>
                )}
            </div>

            {/* Tree View */}
            <div className="space-y-4 bg-black/20 p-4 rounded-3xl min-h-[300px]">
                {categories.filter(c => !c.parentId).length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-48 text-gray-600">
                        <Plus className="mb-2 opacity-20" size={48} />
                        <p className="text-xs">No categories defined. Start building your tree.</p>
                    </div>
                ) : (
                    buildTree(null)
                )}
            </div>
        </div>
    );
};

export default CategoryManager;
