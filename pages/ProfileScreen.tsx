import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl} from "react-native";
import tw from "tailwind-react-native-classnames";
import Header from "../components/layout/Header";
import Dock from "../components/Dock";
import Icon from "react-native-vector-icons/MaterialIcons";
import { EditableInfoRow } from "../components/EditableInfoRow";
import { useNavigation,useFocusEffect  } from "@react-navigation/native";
import { useAuth } from "../contexts/AuthContext";
import { User } from "../constants/user";
import {AuthService, getOrderStatusInArabic, getStatusColor, Order} from "../services/authService";

const SectionHeader: React.FC<{ icon: string; title: string }> = ({ icon, title }) => (
    <View style={tw`flex-row items-center justify-end mb-4`}>
        <Text style={[tw`text-xl font-bold text-gray-800`, styles.rtlText]}>{title}</Text>
        <Icon name={icon} size={24} color="#4A5568" style={tw`ml-2`} />
    </View>
);

const ProfileScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user, logout, setUser } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [isLoadingOrders, setIsLoadingOrders] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [displayedOrders, setDisplayedOrders] = useState<Order[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    // Redirect to Authentication if no user is logged in
    useEffect(() => {
        if (!user) {
            navigation.navigate("Authentication" as never);
            return; // Early return to prevent further execution
        }
    }, [user, navigation]);

    // Ajout d'un useEffect pour charger les données utilisateur au montage
    useEffect(() => {
        const loadUserData = async () => {
            if (user) {
                try {
                    const refreshedUserData = await AuthService.getUserDetails();
                    setUser(refreshedUserData);
                    await fetchOrders();
                } catch (error) {
                    console.error('Initial load error:', error);
                }
            }
        };
        
        loadUserData();
    }, []); // Exécuté une seule fois au montage

    // Remplacer l'ancien useEffect des orders par useFocusEffect
    useFocusEffect(
        React.useCallback(() => {
            if (user) {
                fetchOrders();
            }
        }, [user])
    );

    useEffect(() => {
        if (orders.length > 0) {
            setDisplayedOrders(orders.slice(0, 10));
        }
    }, [orders]);

    const formatTotal = (total: number | string): string => {
        const numericTotal = typeof total === 'string' ? parseFloat(total) : total;
        return isNaN(numericTotal) ? '0.00' : numericTotal.toFixed(2);
    };

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        try {
            if (user) {
                const refreshedUserData = await AuthService.getUserDetails();
                setUser(refreshedUserData);
                await fetchOrders();
            }
        } catch (error) {
            console.error('Refresh error:', error);
            Alert.alert("خطأ", "حدث خطأ أثناء تحديث البيانات");
        } finally {
            setRefreshing(false);
        }
    }, [user]);

    const fetchOrders = async () => {
        if (!user) return; // Additional check to prevent fetching without user

        try {
            setIsLoadingOrders(true);
            const orderData = await AuthService.getOrders();
            setOrders(orderData);
        } catch (error) {
            // Only show alert if user is still authenticated
            if (user) {
                Alert.alert(
                    "خطأ",
                    "حدث خطأ أثناء تحميل المعاملات السابقة"
                );
            }
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-MA');
    };

    // If no user, return null early to prevent rendering
    if (!user) {
        return null;
    }

    const handleLogout = () => {
        logout();
        navigation.navigate("Landing" as never);
    };

    const handleEditInfo = async (key: string, value: string) => {
        if (!user) return;

        try {
            setIsUpdating(true);
            const updateData: Partial<User> = {
                ...user,
                [key]: value
            };
            const updatedUser = await AuthService.updateProfile(updateData);
            const refreshedUserData = await AuthService.getUserDetails();
            setUser(refreshedUserData);
            Alert.alert("نجاح", "تم تحديث المعلومات بنجاح");
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert(
                "خطأ",
                "حدث خطأ أثناء تحديث المعلومات. يرجى المحاولة مرة أخرى."
            );
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <Header title="الملف الشخصي" showCart={false} />
            <ScrollView 
                contentContainerStyle={tw`p-4 pb-32`}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={["#4A5568"]}
                        tintColor="#4A5568"
                    />
                }
            >
                {/* Profile Card */}
                <View style={tw`items-center mb-6`}>
                    <View style={tw`w-24 h-24 rounded-full bg-gray-200 items-center justify-center`}>
                        <Icon name="person" size={48} color="#4A5568" />
                    </View>
                    <Text style={[tw`text-2xl font-bold mt-3`, styles.rtlText]}>
                        {user.fullName}
                    </Text>
                </View>

                {/* Information Section */}
                <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
                    <SectionHeader icon="person" title="المعلومات الشخصية" />
                    <View style={[tw`mb-4`]}>
                        <EditableInfoRow
                            icon="phone"
                            label="الهاتف"
                            value={user.phone}
                            onEdit={(value) => handleEditInfo("phone", value)}
                        />
                    </View>
                    <View style={[tw`mb-4`]}>
                        <EditableInfoRow
                            icon="email"
                            label="البريد الإلكتروني"
                            value={user.email}
                            onEdit={(value) => handleEditInfo("email", value)}
                        />
                    </View>
                    <View style={[tw`mb-4`]}>
                        <EditableInfoRow
                            icon="home"
                            label="العنوان"
                            value={user.address}
                            onEdit={(value) => handleEditInfo("address", value)}
                        />
                    </View>
                </View>

                {/* Password Section */}
                <View style={tw`bg-white p-4 rounded-xl mb-6 shadow-sm`}>
                    <SectionHeader icon="security" title="الأمان" />
                    <TouchableOpacity
                        style={tw`flex-row items-center justify-end`}
                        onPress={() => navigation.navigate("PasswordReset" as never)}
                    >
                        <Text style={[tw`text-lg ml-2`, styles.rtlText]}>
                            تغيير كلمة المرور
                        </Text>
                        <Icon name="lock" size={20} color="#4A5568" />
                    </TouchableOpacity>
                </View>

                {/* Previous transactions */}
                <View style={tw`bg-white rounded-2xl p-6 shadow-sm mb-6`}>
                    <SectionHeader icon="receipt-long" title="المعاملات السابقة" />
                    {isLoadingOrders ? (
                        <View style={tw`items-center py-4`}>
                            <ActivityIndicator size="large" color="#4A5568" />
                        </View>
                    ) : displayedOrders.length > 0 ? (
                        <>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View>
                                    <View style={tw`flex-row bg-gray-100 p-2 rounded-t-lg`}>
                                        <Text style={[tw`font-bold w-24 text-center`, styles.rtlText]}>التاريخ</Text>
                                        <Text style={[tw`font-bold w-24 text-center`, styles.rtlText]}>المبلغ</Text>
                                        <Text style={[tw`font-bold w-24 text-center`, styles.rtlText]}>الحالة</Text>
                                        <Text style={[tw`font-bold w-24 text-center`, styles.rtlText]}>رقم الطلب</Text>
                                    </View>
                                    {displayedOrders.map((order) => (
                                        <TouchableOpacity
                                            key={order.id}
                                            style={tw`flex-row border-b border-gray-200 p-2`}
                                            onPress={() => {
                                                const detailsMessage = [
                                                    `رقم الطلب: ${order.id}#`,
                                                    `التاريخ: ${formatDate(order.created_at)}`,
                                                    `الحالة: ${getOrderStatusInArabic(order.status)}`,
                                                    `\nالمنتجات:\n`,
                                                    order.orderDetails && order.orderDetails.length > 0 
                                                        ? order.orderDetails.map(detail =>
                                                            `- ${detail.product_name || detail.name}\n` +
                                                            `   الكمية: ${detail.quantity}\n` +
                                                            `   السعر: ${detail.price} درهم\n` +
                                                            `   المجموع: ${(detail.quantity * detail.price).toFixed(2)} درهم\n`
                                                        ).join('\n')
                                                        : 'لا توجد تفاصيل متاحة للمنتجات',
                                                    `\nالمجموع الكلي: ${formatTotal(order.total)} درهم`
                                                ].join('\n');

                                                Alert.alert(
                                                    "تفاصيل الطلب",
                                                    detailsMessage,
                                                    [{ text: "حسناً", style: "default" }],
                                                    { 
                                                        userInterfaceStyle: 'light',
                                                        cancelable: true 
                                                    }
                                                );
                                            }}
                                        >
                                            <Text style={[tw`w-24 text-center`, styles.rtlText]}>
                                                {formatDate(order.created_at)}
                                            </Text>
                                            <Text style={[tw`w-24 text-center`, styles.rtlText]}>
                                                {formatTotal(order.total)} د
                                            </Text>
                                            <Text style={[tw`flex-1 text-center`, { color: getStatusColor(order.status) }, styles.rtlText]}>
                                                {getOrderStatusInArabic(order.status)}
                                            </Text>
                                            <Text style={[tw`w-24 text-center font-bold`, styles.rtlText]}>{order.id}#</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </ScrollView>
                            {orders.length > 10 && (
                                <TouchableOpacity
                                    style={tw`mt-4 bg-gray-100 p-3 rounded-lg`}
                                    onPress={() => navigation.navigate('Transactions' as never)}
                                >
                                    <Text style={[tw`text-center text-gray-700 font-bold`, styles.rtlText]}>
                                        عرض جميع المعاملات
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </>
                    ) : (
                        <View style={tw`py-4 items-center`}>
                            <Text style={[tw`text-gray-500`, styles.rtlText]}>
                                لا توجد معاملات سابقة
                            </Text>
                        </View>
                    )}
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    style={tw`bg-white p-6 rounded-xl mb-6 shadow-sm`}
                    onPress={handleLogout}
                >
                    <View style={tw`flex-row items-center justify-center`}>
                        <Text style={[tw`text-red-500 text-lg font-bold`, styles.rtlText]}>
                            تسجيل الخروج من الحساب
                        </Text>
                        <Icon name="logout" size={24} color="#EF4444" style={tw`ml-2`} />
                    </View>
                </TouchableOpacity>
            </ScrollView>
            <Dock />
        </View>
    );
};

const styles = StyleSheet.create({
    rtlText: {
        textAlign: "right",
        writingDirection: "rtl",
        fontFamily: "System",
    },
});

export default ProfileScreen;
