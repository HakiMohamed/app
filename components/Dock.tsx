import { useEffect, useRef } from "react"
import { View, TouchableOpacity, StyleSheet, Animated, Text } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import Icon from "react-native-vector-icons/Ionicons"
import { useCity } from "../contexts/CityContext"
import { useDock } from "../contexts/DockContext"
import { useCart } from "../contexts/CartContext"
import {RootStackParamList} from "../App";

type DockNavigationProp = StackNavigationProp<RootStackParamList>

const Dock = () => {
    const navigation = useNavigation<DockNavigationProp>()
    const route = useRoute()
    const { selectedCity } = useCity()
    const { isDockVisible } = useDock()
    const { itemCount } = useCart()

    const slideAnim = useRef(new Animated.Value(0)).current

    const navigateToMart = () => {
        if (selectedCity) {
            navigation.navigate("Mart", {
                cityName: selectedCity.name,
                cityId: selectedCity.id
            })
        } else {
            navigation.navigate("Home")
        }
    }

    useEffect(() => {
        Animated.spring(slideAnim, {
            toValue: isDockVisible ? 0 : 100,
            useNativeDriver: true,
        }).start()
    }, [isDockVisible, slideAnim])

    if (route.name === "Home") {
        return null
    }

    return (
        <Animated.View style={[styles.container, { transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.dock}>
                <TouchableOpacity onPress={navigateToMart} style={styles.iconContainer}>
                    <Icon name="home-outline" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Search")} style={styles.iconContainer}>
                    <Icon name="search-outline" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.iconContainer}>
                    <View>
                        <Icon name="cart-outline" size={24} color="#000" />
                        {itemCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{itemCount}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.iconContainer}>
                    <Icon name="person-outline" size={24} color="#000" />
                </TouchableOpacity>
            </View>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    dock: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingBottom: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#e0e0e0",
    },
    iconContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: 50,
        height: 50,
    },
    badge: {
        position: "absolute",
        right: -6,
        top: -6,
        backgroundColor: "red",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    badgeText: {
        color: "white",
        fontSize: 12,
        fontWeight: "bold",
    },
})

export default Dock
