import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LandingScreen from "./pages/LandingScreen";
import HomeScreen from "./pages/HomeScreen";
import MartScreen from "./pages/MartScreen";
import ServiceItems from "./components/ServiceItems";
import CartScreen from "./pages/CartScreen";
import ProfileScreen from "./pages/ProfileScreen";
import SearchScreen from "./pages/SearchScreen";
import "./global.css";
import ProductScreen from "./pages/ProductScreen";
import PasswordResetScreen from "./pages/PasswordResetScreen";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AuthenticationScreen from "./pages/AuthenticationScreen";
import { CityProvider } from "./contexts/CityContext";
import { DockProvider } from "./contexts/DockContext";
import { CartProvider } from "./contexts/CartContext";
import CheckoutScreen from "./pages/CheckoutScreen";
import TransactionsScreen from "./pages/TransactionsScreen";

export type RootStackParamList = {
    Landing: undefined;
    Home: undefined;
    Mart: { cityName: string; cityId: number };
    ServiceItems: {
        serviceName: string;
        category: string;
        cityName: string;
        cityId: number;
    };
    Cart: undefined;
    Profile: undefined;
    Search: undefined;
    Product: { product: any };
    PasswordReset: undefined;
    Authentication: undefined;
    Checkout: undefined;
    Transactions: undefined;

};

const Stack = createStackNavigator<RootStackParamList>();

const AppContent = () => {
    const { user } = useAuth();

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName={user ? "Home" : "Landing"}
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true
                }}
            >
                <Stack.Screen
                    name="Landing"
                    component={LandingScreen}
                />
                <Stack.Screen
                    name="Authentication"
                    component={AuthenticationScreen}
                    options={{
                        gestureEnabled: false,
                        headerLeft: () => null,
                    }}
                />
                <Stack.Group screenOptions={{ gestureEnabled: true }}>
                    <Stack.Screen name="Home" 
                    component={HomeScreen}
                     options={{ gestureEnabled: false }}
                     />
                    <Stack.Screen name="Mart"
                     component={MartScreen} 
                     options={{ gestureEnabled: false }} 
                     />
                    <Stack.Screen name="ServiceItems"
                     component={ServiceItems}
                     options={{ gestureEnabled: false }}
                     />
                    <Stack.Screen name="Cart"
                     component={CartScreen} 
                     options={{ gestureEnabled: false }}
                     />
                    <Stack.Screen name="Profile"
                     component={ProfileScreen} 
                     options={{ gestureEnabled: false }}
                     />
                    <Stack.Screen name="Search"
                     component={SearchScreen} 
                     options={{ gestureEnabled: false }}
                     />
                    <Stack.Screen name="Product"
                     component={ProductScreen} 
                     options={{ gestureEnabled: false }}
                     />
                    <Stack.Screen name="PasswordReset"
                     component={PasswordResetScreen} 
                     options={{ gestureEnabled: false }}
                     />
                    <Stack.Screen name="Checkout"
                     component={CheckoutScreen} 
                     options={{ gestureEnabled: false }}
                     />
                    <Stack.Screen name="Transactions"
                     component={TransactionsScreen}
                     options={{ gestureEnabled: false }}
                     />

                </Stack.Group>
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <CityProvider>
                <CartProvider>
                    <DockProvider>
                        <AppContent />
                    </DockProvider>
                </CartProvider>
            </CityProvider>
        </AuthProvider>
    );
};

export default App;
