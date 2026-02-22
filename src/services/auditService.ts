import { db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type AuditAction =
    | 'LOGIN_ATTEMPT'
    | 'PRODUCT_CREATE'
    | 'PRODUCT_UPDATE'
    | 'PRODUCT_DELETE'
    | 'ORDER_STATUS_CHANGE'
    | 'ROLE_CHANGE'
    | 'INVENTORY_ADJUST';

export const logActivity = async (
    userId: string,
    userEmail: string,
    action: AuditAction,
    details: string,
    metadata: any = {}
) => {
    try {
        await addDoc(collection(db, 'audit_logs'), {
            userId,
            userEmail,
            action,
            details,
            metadata: {
                ...metadata,
                userAgent: navigator.userAgent,
                ip: 'CLIENT_SIDE_ONLY' // Real IP would be handled by Cloud Functions
            },
            timestamp: serverTimestamp()
        });
    } catch (error) {
        console.error('Audit Log Error:', error);
    }
};
