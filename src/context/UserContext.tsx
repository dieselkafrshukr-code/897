import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';

interface UserProfile {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
    points: number;
    level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    role: 'Customer' | 'Admin' | 'Vendor';
    referralCode: string;
    wishlist: string[];
    history: string[]; // Product IDs viewed
    orders: any[]; // Order objects
    preferences: {
        category?: string;
        budgetRange?: [number, number];
    };
}

interface UserContextType {
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    updateHistory: (productId: string) => void;
    addPoints: (amount: number) => void;
    toggleWishlist: (productId: string) => Promise<boolean>;
    addOrder: (order: any) => Promise<void>;
    logAction: (action: string, details: any) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            if (firebaseUser) {
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                    setProfile(userDoc.data() as UserProfile);
                } else {
                    const newProfile: UserProfile = {
                        uid: firebaseUser.uid,
                        email: firebaseUser.email,
                        displayName: firebaseUser.displayName,
                        photoURL: firebaseUser.photoURL,
                        points: 0,
                        level: 'Bronze',
                        role: firebaseUser.email === '1@gmail.com' ? 'Admin' : 'Customer',
                        referralCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
                        wishlist: [],
                        history: [],
                        orders: [],
                        preferences: {}
                    };
                    await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
                    setProfile(newProfile);
                }
            } else {
                setProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateHistory = async (productId: string) => {
        if (!profile || !user) return;
        const newHistory = [productId, ...profile.history.filter(id => id !== productId)].slice(0, 10);
        await updateDoc(doc(db, 'users', user.uid), { history: newHistory });
        setProfile({ ...profile, history: newHistory });
    };

    const toggleWishlist = async (productId: string) => {
        if (!profile || !user) return false;
        const isInWishlist = profile.wishlist.includes(productId);
        const newWishlist = isInWishlist
            ? profile.wishlist.filter(id => id !== productId)
            : [...profile.wishlist, productId];

        await updateDoc(doc(db, 'users', user.uid), { wishlist: newWishlist });
        setProfile({ ...profile, wishlist: newWishlist });
        return !isInWishlist;
    };

    const addOrder = async (order: any) => {
        if (!profile || !user) return;

        // 1. Update user's private orders
        const newOrders = [order, ...profile.orders];
        await updateDoc(doc(db, 'users', user.uid), { orders: newOrders });
        setProfile({ ...profile, orders: newOrders });

        // 2. Save to global orders collection for admin panel
        const orderId = order.id || `ORD-${Date.now()}`;
        await setDoc(doc(db, 'orders', orderId), {
            ...order,
            userId: user.uid,
            userEmail: user.email,
            status: 'pending',
            createdAt: new Date().toISOString()
        });
    };

    const addPoints = async (amount: number) => {
        if (!profile || !user) return;
        const newPoints = profile.points + amount;
        let newLevel = profile.level;
        if (newPoints > 5000) newLevel = 'Platinum';
        else if (newPoints > 2000) newLevel = 'Gold';
        else if (newPoints > 500) newLevel = 'Silver';

        await updateDoc(doc(db, 'users', user.uid), {
            points: newPoints,
            level: newLevel
        });
        setProfile({ ...profile, points: newPoints, level: newLevel });
    };

    const logAction = async (action: string, details: any) => {
        if (!user) return;
        try {
            await addDoc(collection(db, 'audit_logs'), {
                userId: user.uid,
                userEmail: user.email,
                action,
                details,
                timestamp: serverTimestamp(),
                platform: 'web-v1'
            });
        } catch (e) {
            console.error("Audit log failed:", e);
        }
    };

    return (
        <UserContext.Provider value={{ user, profile, loading, updateHistory, addPoints, toggleWishlist, addOrder, logAction }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be used within a UserProvider');
    return context;
};
