import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

export interface CartItem {
    id: number;
    nom: string;
    prix: number;
    quantity: number;
    image: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => Promise<void>;
    removeItem: (itemId: number) => Promise<void>;
    updateQuantity: (itemId: number, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    total: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([]);
    const { user } = useAuth();

    // Calculate totals
    const total = items.reduce((sum, item) => sum + item.prix * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    // Storage keys
    const GUEST_CART_KEY = '@guest_cart';
    const USER_CART_KEY = `@user_cart_${user?.id}`;

    // Get the appropriate storage key based on auth status
    const getStorageKey = () => user ? USER_CART_KEY : GUEST_CART_KEY;

    // Load cart from storage
    useEffect(() => {
        const loadCart = async () => {
            try {
                const storedCart = await AsyncStorage.getItem(getStorageKey());
                if (storedCart) {
                    setItems(JSON.parse(storedCart));
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            }
        };

        loadCart();
    }, [user]); // Reload when user auth status changes

    // Save cart to storage
    const saveCart = async (cartItems: CartItem[]) => {
        try {
            await AsyncStorage.setItem(getStorageKey(), JSON.stringify(cartItems));
        } catch (error) {
            console.error('Error saving cart:', error);
        }
    };

    // Add item to cart
    const addItem = async (item: Omit<CartItem, 'quantity'>) => {
        const updatedItems = [...items];
        const existingItemIndex = updatedItems.findIndex(i => i.id === item.id);

        if (existingItemIndex >= 0) {
            updatedItems[existingItemIndex].quantity += 1;
        } else {
            updatedItems.push({ ...item, quantity: 1 });
        }

        setItems(updatedItems);
        await saveCart(updatedItems);
    };

    // Remove item from cart
    const removeItem = async (itemId: number) => {
        const updatedItems = items.filter(item => item.id !== itemId);
        setItems(updatedItems);
        await saveCart(updatedItems);
    };

    // Update item quantity
    const updateQuantity = async (itemId: number, quantity: number) => {
        if (quantity < 1) return;

        const updatedItems = items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
        );
        setItems(updatedItems);
        await saveCart(updatedItems);
    };

    // Clear cart
    const clearCart = async () => {
        setItems([]);
        await AsyncStorage.removeItem(getStorageKey());
    };

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            total,
            itemCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
