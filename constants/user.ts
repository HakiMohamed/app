// Enhanced User Interface with more comprehensive properties
export interface User {
    id: string;
    fullName: string; // Matches 'full name' from backend
    email: string;
    phone: string; // Matches 'telephone' from backend
    address: string; // Matches 'adresse' from backend
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    role?: 'user' | 'admin' | 'vendor';
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export interface SignUpData extends AuthCredentials {
    fullName: string;
    phone: string;
    address: string;
    confirmPassword: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}
