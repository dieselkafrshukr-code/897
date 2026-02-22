import { useUser } from '../context/UserContext';

export type UserRole = 'Admin' | 'Manager' | 'Support' | 'Warehouse' | 'Vendor' | 'Customer';

export type Permission =
    | 'VIEW_REPORTS'
    | 'MANAGE_PRODUCTS'
    | 'PROCESS_ORDERS'
    | 'MANAGE_INVENTORY'
    | 'SUPPORT_TICKETS'
    | 'EDIT_SETTINGS'
    | 'VIEW_SYSTEM_HEALTH';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    Admin: ['VIEW_REPORTS', 'MANAGE_PRODUCTS', 'PROCESS_ORDERS', 'MANAGE_INVENTORY', 'SUPPORT_TICKETS', 'EDIT_SETTINGS', 'VIEW_SYSTEM_HEALTH'],
    Manager: ['VIEW_REPORTS', 'MANAGE_PRODUCTS', 'PROCESS_ORDERS', 'SUPPORT_TICKETS'],
    Support: ['PROCESS_ORDERS', 'SUPPORT_TICKETS'],
    Warehouse: ['PROCESS_ORDERS', 'MANAGE_INVENTORY'],
    Vendor: ['VIEW_REPORTS', 'MANAGE_PRODUCTS'],
    Customer: []
};

export const usePermissions = () => {
    const { profile } = useUser();
    const currentRole = profile?.role as UserRole || 'Customer';

    const hasPermission = (permission: Permission) => {
        return ROLE_PERMISSIONS[currentRole]?.includes(permission);
    };

    const isRole = (role: UserRole) => {
        return currentRole === role;
    };

    return { hasPermission, isRole, currentRole };
};
