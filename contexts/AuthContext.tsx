import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthCredentials, AuthResponse, SignUpData, User } from '../constants/user';
import { AuthService } from '../services/authService';

type AuthContextType = {
    user: User | null;
    setUser: (user: User) => void;
    token: string | null;
    login: (credentials: AuthCredentials) => Promise<void>;
    signUp: (data: SignUpData) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkStoredAuth();
    }, []);

    const checkStoredAuth = async () => {
        try {
            setIsLoading(true);
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                const userDetails = await AuthService.getUserDetails();
                setUser(userDetails); // Ensure this updates the user state
            }
        } catch (error) {
            console.error('Auth check error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (credentials: AuthCredentials) => {
        try {
            setIsLoading(true);
            const response = await AuthService.login(credentials);
            await AsyncStorage.setItem('token', response.token);
            setToken(response.token);
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    };

    const signUp = async (data: SignUpData) => {
        try {
            setIsLoading(true);
            const response = await AuthService.register(data);
            await AsyncStorage.setItem('token', response.token);
            setToken(response.token);
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            await AuthService.logout();
            await AsyncStorage.removeItem('token');
            setToken(null);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            token,
            login,
            signUp,
            logout,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
