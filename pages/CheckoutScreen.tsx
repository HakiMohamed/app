"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, Alert } from "react-native"
import { useNavigation, NavigationProp } from "@react-navigation/native"
import { Picker } from "@react-native-picker/picker"
import tw from "tailwind-react-native-classnames"
import Header from "../components/layout/Header"
import Dock from "../components/Dock"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import Button from "../components/Button"
import TextInput from "../components/TextInput"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { RootStackParamList } from "../App"

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://gaarage.ma/api/v2"

interface FormData {
    fullName: string;
    phone: string;
    address: string;
    destination: string;
    destinationId: string;
}

interface Destination {
    id: number;
    destination: string;
    prix: string;
}

const getButtonStyle = () => {
    const baseStyle = tw`bg-blue-600 rounded-lg py-3 px-6`;
    return baseStyle;
};

const CheckoutScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const { user } = useAuth()
    const { items, total, clearCart } = useCart()
    const [isLoading, setIsLoading] = useState(false)
    const [destinations, setDestinations] = useState<Destination[]>([])
    const [formData, setFormData] = useState<FormData>({
        fullName: user?.fullName || "",
        phone: user?.phone || "",
        address: user?.address || "",
        destination: "",
        destinationId: "",
    })
    const [deliveryFee, setDeliveryFee] = useState(0)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        loadDestinations()
    }, [])

    const loadDestinations = async () => {
        try {
            const response = await fetch(`${BASE_URL}/destinations`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            setDestinations(data)
        } catch (error) {
            const err = error as Error
            console.error("Error loading destinations:", err)
            Alert.alert("خطأ", "حدث خطأ أثناء تحميل الوجهات")
        }
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.fullName) newErrors.fullName = "الاسم الكامل مطلوب"
        if (!formData.phone) newErrors.phone = "رقم الهاتف مطلوب"
        if (!formData.address) newErrors.address = "العنوان مطلوب"
        if (!formData.destinationId) newErrors.destination = "الوجهة مطلوبة"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleDestinationChange = (selectedId: string) => {
        const selectedDestination = destinations.find((d) => d.id.toString() === selectedId)
        if (selectedDestination) {
            setFormData({
                ...formData,
                destination: selectedDestination.destination,
                destinationId: selectedId,
            })
            setDeliveryFee(Number.parseFloat(selectedDestination.prix))
        }
    }

    const handleTextChange = (field: keyof FormData) => (text: string) => {
        setFormData(prev => ({ ...prev, [field]: text }))
    }

    const handleSubmit = async () => {
        if (!validate()) return

        setIsLoading(true)
        try {
            const token = await AsyncStorage.getItem("token")

            const cartItems = items.map(item => ({
                id: item.id,
                quantity: item.quantity
            }))

            const requestBody = {
                fullname: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                destination: parseInt(formData.destinationId),
                cart: cartItems
            }

            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }

            if (token) {
                headers['Authorization'] = `Bearer ${token}`
            }

            const response = await fetch(`${BASE_URL}/checkout`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody)
            })

            if (!response.ok) {
                const responseText = await response.text()
                let errorMessage: string
                try {
                    const errorData = JSON.parse(responseText)
                    errorMessage = errorData.Message || 'Failed to submit order'
                } catch {
                    errorMessage = 'Failed to submit order'
                }
                throw new Error(errorMessage)
            }

            await clearCart()

            Alert.alert(
                "نجاح",
                "تم تقديم الطلب بنجاح",
                [{
                    text: "حسناً",
                    onPress: () => navigation.navigate('Mart', {
                        cityName: '', // Add your default city name
                        cityId: 0    // Add your default city ID
                    })
                }]
            )
        } catch (error) {
            const err = error as Error
            console.error("Checkout error:", err.message)
            Alert.alert(
                "خطأ",
                `حدث خطأ أثناء تقديم الطلب: ${err.message}`
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <View style={tw`flex-1 bg-gray-100`}>
            <Header title="إتمام الطلب" showBack />
            <ScrollView style={tw`flex-1 px-4`} contentContainerStyle={tw`pb-8`}>
                <View style={tw`bg-white p-6 rounded-lg shadow-sm mb-6 mt-6`}>
                    <Text style={[tw`text-xl mb-6 font-bold`, styles.rtlText]}>معلومات التوصيل</Text>

                    <TextInput
                        label="الاسم الكامل"
                        value={formData.fullName}
                        onChangeText={handleTextChange('fullName')}
                        error={errors.fullName}
                        style={tw`mb-4`}
                    />

                    <TextInput
                        label="رقم الهاتف"
                        value={formData.phone}
                        onChangeText={handleTextChange('phone')}
                        keyboardType="phone-pad"
                        error={errors.phone}
                        style={tw`mb-4`}
                    />

                    <TextInput
                        label="العنوان"
                        value={formData.address}
                        onChangeText={handleTextChange('address')}
                        multiline
                        numberOfLines={3}
                        error={errors.address}
                        style={tw`mb-4`}
                    />

                    <Text style={[tw`mb-2 font-semibold`, styles.rtlText]}>الوجهة</Text>
                    <View style={[tw`border rounded-lg mb-2`, errors.destination ? tw`border-red-500` : tw`border-gray-300`]}>
                        <Picker
                            selectedValue={formData.destinationId}
                            onValueChange={handleDestinationChange}
                            style={[styles.rtlText, { color: "black" }]}
                        >
                            <Picker.Item label="اختر الوجهة" value="" />
                            {destinations.map((dest) => (
                                <Picker.Item key={dest.id.toString()} label={dest.destination} value={dest.id.toString()} />
                            ))}
                        </Picker>
                    </View>
                    {errors.destination && <Text style={[tw`text-red-500 mt-1`, styles.rtlText]}>{errors.destination}</Text>}
                </View>

                <View style={tw`bg-white p-6 rounded-lg shadow-sm mb-6`}>
                    <Text style={[tw`text-xl mb-4 font-bold`, styles.rtlText]}>ملخص الطلب</Text>
                    <View style={tw`flex-row justify-between mb-2`}>
                        <Text style={[tw`text-gray-600`, styles.rtlText]}>عدد المنتجات:</Text>
                        <Text style={tw`font-semibold`}>{items.length}</Text>
                    </View>
                    <View style={tw`flex-row justify-between mb-2`}>
                        <Text style={[tw`text-gray-600`, styles.rtlText]}>المجموع الفرعي:</Text>
                        <Text style={tw`font-semibold`}>{total.toFixed(2)} درهم</Text>
                    </View>
                    <View style={tw`flex-row justify-between mb-2`}>
                        <Text style={[tw`text-gray-600`, styles.rtlText]}>رسوم التوصيل:</Text>
                        <Text style={tw`font-semibold`}>{deliveryFee.toFixed(2)} درهم</Text>
                    </View>
                    <View style={tw`flex-row justify-between mt-4 pt-4 border-t border-gray-200`}>
                        <Text style={[tw`text-lg font-bold`, styles.rtlText]}>المجموع الكلي:</Text>
                        <Text style={tw`text-lg font-bold`}>{(total + deliveryFee).toFixed(2)} درهم</Text>
                    </View>
                </View>

                <Button
                    title={isLoading ? "جاري المعالجة..." : "تأكيد الطلب"}
                    onPress={handleSubmit}
                    disabled={isLoading}
                    style={getButtonStyle()}
                />
            </ScrollView>
            <View style={styles.dockSpacer} />
            <Dock />
        </View>
    )
}

const styles = StyleSheet.create({
    rtlText: {
        textAlign: "right",
        writingDirection: "rtl",
    },
    dockSpacer: {
        height: 80,
    },
})

export default CheckoutScreen
