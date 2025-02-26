import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react-native';
import tw from 'tailwind-react-native-classnames';
import { RootStackParamList } from "../../App";

type HeaderNavigationProp = StackNavigationProp<RootStackParamList>;

interface HeaderProps {
    title: string;
    showBack?: boolean;
    showCart?: boolean;
    onBackPress?: () => void;
}

const Header = ({
                    title,
                    showBack = true,
                    showCart = true,
                    onBackPress
                }: HeaderProps) => {
    const navigation = useNavigation<HeaderNavigationProp>();

    const handleBack = () => {
        if (onBackPress) {
            onBackPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={[tw`bg-white px-4 pt-5 pb-2`, styles.header]}>
            {/* Use flexDirection: 'row-reverse' for RTL layout */}
            <View style={[tw`flex-row items-center justify-between`, styles.container]}>
                {/* Center - Title */}
                <View style={styles.titleContainer}>
                    <Text style={[tw`text-lg font-bold`, styles.title]}>{title}</Text>
                </View>

                {/* Right side - Back button */}
                <View style={styles.sideContainer}>
                    {showBack ? (
                        <TouchableOpacity
                            onPress={handleBack}
                            style={tw`p-2`}
                        >
                            <ArrowLeft size={24} color="#000" />
                        </TouchableOpacity>
                    ) : <View style={tw`w-10`} />}
                </View>



            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    container: {
        flexDirection: 'row-reverse', // This creates the RTL layout
    },
    sideContainer: {
        width: 48, // Fixed width for side containers
        alignItems: 'center',
        justifyContent: 'center',
        height: 28,
        paddingTop: 0,
    },
    titleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        textAlign: 'center',
        writingDirection: 'rtl',
        fontFamily: 'system',
    },
});

export default Header;
