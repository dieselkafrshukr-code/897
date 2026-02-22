import { db } from '../config/firebase';
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy
} from 'firebase/firestore';

export interface Category {
    id: string;
    name: string;
    parentId: string | null; // null for top-level
    slug: string;
    order: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    basePrice: number;
    categoryId: string;
    images: string[];
    stock: number;
    attributes: Record<string, any>; // For sizes, colors, etc.
    status: 'active' | 'draft' | 'archived';
    createdAt: any;
}

const CATEGORIES_COL = 'categories';
const PRODUCTS_COL = 'products';

export const CatalogService = {
    // Categories
    async getCategories() {
        const q = query(collection(db, CATEGORIES_COL), orderBy('order', 'asc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
    },

    async addCategory(category: Omit<Category, 'id'>) {
        return await addDoc(collection(db, CATEGORIES_COL), category);
    },

    // Products
    async getProducts(filters: { categoryId?: string, status?: string } = {}) {
        let q = query(collection(db, PRODUCTS_COL), orderBy('createdAt', 'desc'));

        if (filters.categoryId) {
            q = query(q, where('categoryId', '==', filters.categoryId));
        }
        if (filters.status) {
            q = query(q, where('status', '==', filters.status));
        }

        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    },

    async addProduct(product: Omit<Product, 'id'>) {
        return await addDoc(collection(db, PRODUCTS_COL), {
            ...product,
            createdAt: new Date()
        });
    }
};
