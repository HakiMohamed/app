import AsyncStorage from "@react-native-async-storage/async-storage"
import type { AuthCredentials, AuthResponse, SignUpData, User } from "../constants/user"

const API_URL = "https://gaarage.ma/api/v2/auth"

interface MappedUserData {
    nom_complet?: string;
    telephone?: string;
    adresse?: string;
    email?: string;
}


export const getStatusColor = (status: string): string => {
    switch (status.toLowerCase()) {
        case 'cancelled':
            return 'red'; // Red for cancelled orders
        case 'delivered':
            return 'green'; // Green for delivered orders
        case 'non-confirmed':
            return 'orange'; // Orange for non-confirmed orders
        case 'confirmed':
            return 'green'; // Green for confirmed orders
        default:
            return 'black'; // Default color for unknown status
    }
};

export const getOrderStatusInArabic = (status: string): string => {
    const statusMap: { [key: string]: string } = {
        'cancelled': 'ملغي',
        'confirmed': 'مؤكد',
        'non-confirmed': 'قيد المراجعة',
        'delivered': 'تم التوصيل'
    };
    return statusMap[status.toLowerCase()] || status;
};

export interface OrderDetail {
    id: number;
    quantity: number;
    price: number;
    product_name: string;
}

export interface Order {
    id: number;
    total: number | string; // Update to handle both number and string
    status: string;
    created_at: string;
    orderDetails: OrderDetail[];
}

async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await AsyncStorage.getItem("token")

    const headers = new Headers(options.headers || {})
    headers.set("Content-Type", "application/json")
    headers.set("Accept", "application/json")
    if (token) {
        headers.set("Authorization", `Bearer ${token}`)
    }

    const config = {
        ...options,
        headers,
    }

    const fullUrl = `${API_URL}${url}`

    try {
        const response = await fetch(fullUrl, config)

        // Don't throw error for 404 status
        if (!response.ok && response.status !== 404) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return response
    } catch (error) {
        throw error
    }
}

export const AuthService = {
    async getOrders(): Promise<Order[]> {
        try {
            const response = await fetchWithAuth("/getOrdersByPhone");

            // If status is 404, return empty array
            if (response.status === 404) {
                return [];
            }

            const responseText = await response.text();

            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                return [];
            }

            // Check if data.orders exists
            if (!data.orders || !Array.isArray(data.orders)) {
                return [];
            }


            const mappedOrders = data.orders.map((orderData: any) => {
                // Extract the order object and total_price
                const order = orderData.order || {};
                const total = orderData.total_price || 0;

                return {
                    id: order.id,
                    total: total,
                    status: order.status || '',
                    created_at: order.created_at || new Date().toISOString(),
                    orderDetails: order.orderDetails || []
                };
            });

            return mappedOrders;
        } catch (error) {
            return [];
        }
    },

    async login(credentials: AuthCredentials): Promise<AuthResponse> {
        const response = await fetchWithAuth("/login", {
            method: "POST",
            body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
                device_id: "web",
            }),
        })

        const data = await response.json()

        if (!data.Token) {
            throw new Error("Authentication token not found in response")
        }

        return {
            token: data.Token,
            user: {
                id: data.id || "",
                fullName: data["full name"] || "",
                email: credentials.email,
                phone: data.telephone || "",
                address: data.adresse || "",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        }
    },

    async register(data: SignUpData): Promise<AuthResponse> {
        await fetchWithAuth("/register", {
            method: "POST",
            body: JSON.stringify({
                nom_complet: data.fullName,
                email: data.email,
                telephone: data.phone,
                adresse: data.address,
                password: data.password,
                password_confirmation: data.confirmPassword,
            }),
        })

        return this.login({
            email: data.email,
            password: data.password,
        })
    },

    async logout(): Promise<void> {
        await fetchWithAuth("/logout", { method: "POST" })
    },

    async getUserDetails(): Promise<User> {
        const response = await fetchWithAuth("/details")
        const data = await response.json()

        return {
            id: data.id || "",
            fullName: data["full name"] || "",
            email: data.email || "",
            phone: data.telephone || "",
            address: data.address || "",
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    },

    async resetPassword(currentPassword: string, newPassword: string): Promise<void> {
        const response = await fetchWithAuth("/changePassword", {
            method: "POST",
            body: JSON.stringify({
                current_password: currentPassword,
                new_password: newPassword,
                new_password_confirmation: newPassword
            }),
        })

        const data = await response.json()

        if (!response.ok) {
            const errorMessage = data.message || data.error || "Failed to reset password";
            throw new Error(errorMessage);
        }
    },

    // In authService.ts, update the updateProfile function
    async updateProfile(data: Partial<User>): Promise<User> {
        // Create mapped data with proper typing
        const mappedData: MappedUserData = {
            nom_complet: data.fullName,
            telephone: data.phone,
            adresse: data.address,
            email: data.email,
        };

        // Remove undefined values using type-safe approach
        const cleanedData = Object.fromEntries(
            Object.entries(mappedData).filter(([_, value]) => value !== undefined)
        ) as Record<string, string>;

        const response = await fetchWithAuth("/update", {
            method: "POST",
            body: JSON.stringify(cleanedData),
        });

        const responseData = await response.json();
        return {
            id: responseData.id || "",
            fullName: responseData["full name"] || "",
            email: responseData.email || "",
            phone: responseData.telephone || "",
            address: responseData.adresse || "",
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    },
}

