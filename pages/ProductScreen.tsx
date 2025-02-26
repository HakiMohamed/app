import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import Header from '../components/layout/Header';
import Button from '../components/Button';
import Dock from '../components/Dock';
import CitiesService from '../services/citiesService';
import { useCart } from '../contexts/CartContext'; // Add this import

const ProductScreen = ({ route }) => {
    const { product } = route.params;
    const { addItem } = useCart(); // Add this hook

    const handleAddToCart = async () => {
        try {
            await addItem({
                id: product.id,
                nom: product.nom,
                prix: product.prix,
                image: product.image
            });
            // You might want to add some feedback here
            alert('تمت إضافة المنتج إلى السلة'); // Product added to cart
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('فشل في إضافة المنتج'); // Failed to add product
        }
    };

    return (
        <View style={tw`flex-1 bg-white`}>
            <Header title={product.nom} showBack showCart />
            <ScrollView>
                <Image
                    source={{ uri: CitiesService.getProductImageUrl(product.image) }}
                    style={styles.productImage}
                />
                <View style={tw`p-4`}>
                    <Text style={[tw`text-xl font-bold mb-2`, styles.rtlText]}>
                        {product.nom}
                    </Text>
                    <Text style={[tw`text-lg mb-4`, styles.rtlText]}>
                        {product.prix} درهم
                    </Text>
                    <Text style={[tw`mb-4`, styles.rtlText]}>
                        {product.description || 'لا يوجد وصف متاح'}
                    </Text>
                    <Button title="إضافة إلى السلة" onPress={handleAddToCart} />
                </View>
            </ScrollView>
            <Dock />
        </View>
    );
};

const styles = StyleSheet.create({
    productImage: {
        width: '100%',
        height: 300,
        resizeMode: 'cover',
    },
    rtlText: {
        textAlign: 'right',
        writingDirection: 'rtl',
    },
});

export default ProductScreen;
