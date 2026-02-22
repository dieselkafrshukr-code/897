import { useState, useEffect } from 'react';

export const useDynamicPrice = (basePrice: number) => {
    const [price, setPrice] = useState(basePrice);
    const [multiplier, setMultiplier] = useState(1);

    useEffect(() => {
        // Dynamic Pricing Algorithm
        // Simulating demand/seasonal changes
        const checkPricing = () => {
            const hour = new Date().getHours();
            let m = 1;

            // Peak hours (demand high)
            if (hour >= 18 && hour <= 22) m = 1.1;
            // Early morning (offer)
            if (hour >= 2 && hour <= 6) m = 0.9;

            // Stock factor (simulated randomness)
            const stockFactor = Math.random() > 0.8 ? 1.05 : 1;

            setMultiplier(m * stockFactor);
            setPrice(basePrice * m * stockFactor);
        };

        checkPricing();
        const interval = setInterval(checkPricing, 60000); // Check every minute
        return () => clearInterval(interval);
    }, [basePrice]);

    return { price, multiplier };
};
