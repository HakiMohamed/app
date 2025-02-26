import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import Header from "../components/layout/Header";
import Dock from "../components/Dock";
import {CartItem, useCart} from "../contexts/CartContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import CitiesService from "../services/citiesService";
import Button from "../components/Button";
import { RootStackParamList } from "../App"; // Update this import path based on your file structure

type CartNavigationProp = StackNavigationProp<RootStackParamList>;



const CartScreen = () => {
    const navigation = useNavigation<CartNavigationProp>();
    const { items, removeItem, updateQuantity, total, itemCount } = useCart();

    const renderItem = ({ item }: { item: CartItem }) => (
        <View style={[tw`flex-row p-4 bg-white rounded-lg shadow-sm mb-2`, styles.cartItem]}>
            <View style={tw`flex-row items-center flex-1`}>
                <Image
                    source={{ uri: CitiesService.getProductImageUrl(item.image) }}
                    style={tw`w-20 h-20 rounded-lg`}
                    resizeMode="cover"
                />
                <View style={tw`flex-1 px-4`}>
                    <Text style={[tw`text-lg font-bold`, styles.rtlText]}>{item.nom}</Text>
                    <Text style={[tw`text-gray-600`, styles.rtlText]}>{item.prix} درهم</Text>

                    <View style={tw`flex-row items-center justify-end mt-2`}>
                        <TouchableOpacity
                            onPress={() => updateQuantity(item.id, item.quantity - 1)}
                            style={tw`p-2`}
                        >
                            <Icon name="remove-circle-outline" size={24} color="#4A5568" />
                        </TouchableOpacity>

                        <Text style={tw`px-4 text-lg`}>{item.quantity}</Text>

                        <TouchableOpacity
                            onPress={() => updateQuantity(item.id, item.quantity + 1)}
                            style={tw`p-2`}
                        >
                            <Icon name="add-circle-outline" size={24} color="#4A5568" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => removeItem(item.id)}
                    style={tw`p-2`}
                >
                    <Icon name="delete-outline" size={24} color="#EF4444" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const handleCheckout = () => {
        navigation.navigate("Checkout");
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <Header title="سلة التسوق" showCart={false} />

            <View style={tw`flex-1 px-4 pb-24`}>
                {items.length > 0 ? (
                    <>
                        <FlatList
                            data={items}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id.toString()}
                            contentContainerStyle={tw`py-4`}
                        />

                        <View style={[tw`bg-white p-4 rounded-t-xl shadow-lg`, styles.summary]}>
                            <View style={tw`flex-row justify-between mb-2`}>
                                <Text style={[tw`text-lg`, styles.rtlText]}>
                                    {itemCount} منتجات
                                </Text>
                                <Text style={styles.rtlText}>المجموع:</Text>
                            </View>

                            <Text style={[tw`text-2xl font-bold text-right mb-4`, styles.rtlText]}>
                                {total.toFixed(2)} درهم
                            </Text>

                            <Button
                                title="متابعة الطلب"
                                onPress={handleCheckout}
                            />
                        </View>
                    </>
                ) : (
                    <View style={tw`flex-1 justify-center items-center`}>
                        <Icon name="shopping-cart" size={64} color="#9CA3AF" />
                        <Text style={[tw`text-xl mt-4 mb-6`, styles.rtlText]}>
                            سلة التسوق فارغة
                        </Text>
                        <Button
                            title="تصفح المنتجات"
                            onPress={() => navigation.navigate("Mart", {
                                cityName: "", // Add appropriate default values or get from context
                                cityId: 0    // Add appropriate default values or get from context
                            })}
                        />
                    </View>
                )}
            </View>
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
    cartItem: {
        flexDirection: "row-reverse",
    },
    summary: {
        borderTopWidth: 1,
        borderTopColor: "#E5E7EB",
    },
});

export default CartScreen;
