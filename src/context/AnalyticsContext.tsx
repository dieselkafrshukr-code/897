import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useUser } from './UserContext';

interface UserBehavior {
    path: string;
    dwellTime: number;
    clicks: { x: number, y: number, target: string }[];
    scrollDepth: number;
}

interface AnalyticsContextType {
    trackEvent: (name: string, data?: any) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useUser();
    const [session, setSession] = useState<UserBehavior>({
        path: window.location.pathname,
        dwellTime: 0,
        clicks: [],
        scrollDepth: 0
    });

    useEffect(() => {
        const startTime = Date.now();

        // Track clicks for Heatmap
        const handleClick = (e: MouseEvent) => {
            const clickData = {
                x: e.clientX,
                y: e.clientY,
                target: (e.target as HTMLElement).tagName
            };
            setSession(prev => ({ ...prev, clicks: [...prev.clicks, clickData] }));
        };

        // Track scroll depth
        const handleScroll = () => {
            const depth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            setSession(prev => ({ ...prev, scrollDepth: Math.max(prev.scrollDepth, depth) }));
        };

        window.addEventListener('click', handleClick);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('click', handleClick);
            window.removeEventListener('scroll', handleScroll);

            // Save session data on unload
            const endTime = Date.now();
            const finalData = {
                ...session,
                dwellTime: Math.floor((endTime - startTime) / 1000),
                userId: user?.uid || 'GUEST',
                timestamp: serverTimestamp()
            };

            // In production, use navigator.sendBeacon for more reliability
            if (finalData.dwellTime > 2) {
                addDoc(collection(db, 'sessions'), finalData);
            }
        };
    }, [user]);

    const trackEvent = async (name: string, data: any = {}) => {
        await addDoc(collection(db, 'events'), {
            name,
            data,
            userId: user?.uid || 'GUEST',
            timestamp: serverTimestamp()
        });
    };

    return (
        <AnalyticsContext.Provider value={{ trackEvent }}>
            {children}
        </AnalyticsContext.Provider>
    );
};

export const useAnalytics = () => {
    const context = useContext(AnalyticsContext);
    if (!context) throw new Error('useAnalytics must be used within an AnalyticsProvider');
    return context;
};
