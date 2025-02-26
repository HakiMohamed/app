import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Header from '../components/layout/Header';
import { AuthService, getOrderStatusInArabic, getStatusColor } from '../services/authService';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface Order {
    id: number;
    total: number;
    status: string;
    created_at: string;
    orderDetails: OrderDetail[];
}

interface OrderDetail {
    id: number;
    quantity: number;
    price: number;
    product_name: string;
}

const TransactionsScreen: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const formatTotal = (total: number | string): string => {
        const numericTotal = typeof total === 'string' ? parseFloat(total) : total;
        return isNaN(numericTotal) ? '0.00' : numericTotal.toFixed(2);
    };

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const orderData = await AuthService.getOrders();
            setOrders(orderData);
        } catch (error) {
            console.error('Error fetching orders:', error);
            Alert.alert(
                "خطأ",
                "حدث خطأ أثناء تحميل المعاملات"
            );
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ar-MA');
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <Header title="المعاملات السابقة" showBack={true} showCart={false} />

            {isLoading ? (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color="#4A5568" />
                </View>
            ) : (
                <ScrollView>
                    <View style={tw`p-4`}>
                        <View style={tw`bg-white rounded-xl shadow-sm`}>
                            <View style={tw`flex-row bg-gray-100 p-3 rounded-t-xl`}>
                                <Text style={[tw`font-bold flex-1 text-center`, styles.rtlText]}>التاريخ</Text>
                                <Text style={[tw`font-bold flex-1 text-center`, styles.rtlText]}>المبلغ</Text>
                                <Text style={[tw`font-bold flex-1 text-center`, styles.rtlText]}>الحالة</Text>
                                <Text style={[tw`font-bold flex-1 text-center`, styles.rtlText]}>رقم الطلب</Text>

                            </View>
                            {orders.map((order) => (
                                <TouchableOpacity
                                    key={order.id}
                                    style={tw`flex-row items-center justify-between border-b border-gray-200 p-4 hover:bg-gray-50 transition-colors duration-200 active:bg-gray-100`}
                                    onPress={() => {
                                        Alert.alert(
                                            "تفاصيل الطلب",
                                            order.orderDetails.map(detail =>
                                                `${detail.product_name}: ${detail.quantity} x ${detail.price} درهم`
                                            ).join('\n')
                                        );
                                    }}
                                >
                                    <Text style={[tw`flex-1 text-center`, styles.rtlText]}>
                                        {formatDate(order.created_at)}
                                    </Text>
                                    <Text style={[tw`flex-1 text-center`, styles.rtlText]}>
                                        {formatTotal(order.total)} د
                                    </Text>
                                    <Text style={[tw`w-24 text-center`, { color: getStatusColor(order.status) }, styles.rtlText]}>
                                        {getOrderStatusInArabic(order.status)}
                                    </Text>
                                    <Text style={[tw`flex-1 text-center`, styles.rtlText]}>#{order.id}</Text>

                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    rtlText: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});

export default TransactionsScreen;
