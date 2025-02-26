import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ImageBackground } from "react-native"
import { useNavigation, NavigationProp } from "@react-navigation/native"
import tw from "tailwind-react-native-classnames"
import CitiesService, { type City } from "../services/citiesService"
import { useCity } from "../contexts/CityContext"
import {RootStackParamList} from "../App";

const HomeScreen = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const { cities, isLoading, error } = CitiesService.useCities()
    const { setSelectedCity } = useCity()

    const handleCitySelect = (city: City) => {
        setSelectedCity(city)
        navigation.navigate("Mart", {
            cityName: city.name,
            cityId: city.id
        })
    }

    if (isLoading) {
        return (
            <View style={[tw`flex-1 justify-center items-center`, styles.hero]}>
                <ActivityIndicator size="large" color="white" />
                <Text style={[tw`text-white mt-4`, styles.rtlText]}>جار تحميل المدن...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View style={[tw`flex-1 justify-center items-center`, styles.hero]}>
                <Text style={[tw`text-white text-lg`, styles.rtlText]}>حدث خطأ في تحميل المدن</Text>
            </View>
        )
    }

    return (
        <View style={[tw`flex-1 bg-white`]}>
            <ImageBackground
                source={require("../assets/hero-wallpaper.jpg")}
                style={[tw`p-8`, styles.hero]}
                blurRadius={3}
            >
                <View style={[tw`flex flex-row items-center justify-start mt-8`]}>
                    <Image source={require("../assets/13.png")} style={[styles.logo, tw`mx-auto`]} />
                    <Text style={[tw`text-4xl font-bold text-white mt-4`, styles.heroText, styles.rtlText]}>عندك</Text>
                </View>
                <Text style={[tw`text-2xl text-white`, styles.heroText, styles.rtlText]}>عندك ڭاع لي غتحتاج</Text>
            </ImageBackground>

            <Text style={[tw`text-2xl text-right px-4 my-4`, styles.rtlText]}>اختر منطقتك</Text>

            <FlatList
                data={cities}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[tw`p-4 border-2 border-gray-300 rounded-full mb-4 mx-8`, styles.cityItem]}
                        onPress={() => handleCitySelect(item)}
                    >
                        <Text style={[tw`text-lg`, styles.cityText]}>{item.name || "City Name Unavailable"}</Text>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={() => <Text style={[tw`text-lg text-center mt-4`, styles.rtlText]}>No cities available</Text>}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    rtlText: {
        textAlign: "right",
        writingDirection: "rtl",
        fontFamily: "system",
    },
    cityText: {
        textAlign: "right",
        writingDirection: "rtl",
        color: "#000000",
        fontFamily: "system",
        fontSize: 18,
    },
    hero: {
        paddingVertical: 40,
    },
    heroText: {
        textShadowColor: "rgba(0, 0, 0, 0.75)",
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    logo: {
        width: 200,
        height: 80,
        alignSelf: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    cityItem: {
        flexDirection: "row-reverse",
        justifyContent: "flex-start",
    },
})

export default HomeScreen
