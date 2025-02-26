"use client"

import { useEffect, useRef } from "react"
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
    Dimensions,
    type NativeSyntheticEvent,
    type NativeScrollEvent,
} from "react-native"
import {NavigationProp, useNavigation} from "@react-navigation/native"
import tw from "tailwind-react-native-classnames"
import Header from "../components/layout/Header"
import Dock from "../components/Dock"
import { useCity } from "../contexts/CityContext"
import { useDock } from "../contexts/DockContext"
import CitiesService, {type Category, DOMAIN} from "../services/citiesService"
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    useAnimatedScrollHandler,
    Extrapolate,
} from "react-native-reanimated"
import {RootStackParamList} from "../App";

type MartScreenNavigationProp = NavigationProp<RootStackParamList>;


const { width: screenWidth } = Dimensions.get("window")
const GRID_SPACING = 16
const ITEMS_PER_ROW = 2
const ITEM_WIDTH = (screenWidth - GRID_SPACING * (ITEMS_PER_ROW + 1)) / ITEMS_PER_ROW

const CARD_WIDTH = screenWidth * 0.6
const CARD_HEIGHT = CARD_WIDTH * 0.8
const SPACING = 10
    
const MartScreen = () => {
    const navigation = useNavigation<MartScreenNavigationProp>()
    const { selectedCity } = useCity()
    const { showDock, hideDock } = useDock()
    const scrollViewRef = useRef<ScrollView>(null)
    const lastOffsetY = useRef(0)
    const { categories, isLoading, error } = CitiesService.useCategories(selectedCity?.id || 0)
    const reversedCategories = [...categories].reverse();

    const { hero, isLoading: isLoadingHero, error: heroError } = CitiesService.useHero(1)



    const {
        products: discountedProducts,
        isLoading: isLoadingDiscounts,
        error: discountsError,
    } = CitiesService.useDiscountedProducts(selectedCity?.id || 0)

    useEffect(() => {
        if (!selectedCity) {
            navigation.navigate("Home")
        } else {

        }
    }, [selectedCity, navigation])

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const currentOffsetY = event.nativeEvent.contentOffset.y
        if (currentOffsetY > lastOffsetY.current && currentOffsetY > 20) {
            hideDock()
        } else if (currentOffsetY < lastOffsetY.current) {
            showDock()
        }
        lastOffsetY.current = currentOffsetY
    }

    const handleServicePress = (category: Category) => {
        navigation.navigate("ServiceItems", {
            serviceName: category.nom,
            category: category.id.toString(),
            cityName: selectedCity?.name || "",
            cityId: selectedCity?.id || 0,
        })
    }

    const scrollX = useSharedValue(0)

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            scrollX.value = event.contentOffset.x
        },
    })

    const ServiceItem = ({
                             category,
                             index,
                             scrollX,
                         }: { category: Category; index: number; scrollX: Animated.SharedValue<number> }) => {
        const inputRange = [
            (index - 1) * (CARD_WIDTH + SPACING),
            index * (CARD_WIDTH + SPACING),
            (index + 1) * (CARD_WIDTH + SPACING),
        ]

        const animatedStyle = useAnimatedStyle(() => {
            const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], Extrapolate.CLAMP)
            const opacity = interpolate(scrollX.value, inputRange, [0.6, 1, 0.6], Extrapolate.CLAMP)
            return {
                transform: [{ scale }],
                opacity,
            }
        })

        return (
            <Animated.View
                style={[
                    styles.serviceItemContainer,
                    animatedStyle,
                    { width: CARD_WIDTH, height: CARD_HEIGHT, marginHorizontal: SPACING / 2 },
                ]}
            >
                <TouchableOpacity onPress={() => handleServicePress(category)} style={{ flex: 1 }}>
                    <View style={styles.serviceItemInner}>
                        <Image
                            source={{ uri: CitiesService.getCategoryImageUrl(category.images) }}
                            style={styles.serviceImage}
                            resizeMode="cover"
                        />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }

    const handleProductPress = (product: any) => {
        navigation.navigate("Product", {
            product: {
                id: product.id,
                nom: product.nom,
                prix: product.prix,
                description: product.description,
                image: product.image
            }
        })
    }

    if (isLoading) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Text>تحميل الخدمات...</Text>
            </View>
        )
    }

    if (error) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Text>خطأ في تحميل الخدمات: {error}</Text>
            </View>
        )
    }

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <Header title={selectedCity?.name || "Select a city"} showBack showCart={false} />

            <ScrollView ref={scrollViewRef} onScroll={handleScroll} scrollEventThrottle={16}>
                {/* Dynamic Hero Section */}
                {isLoadingHero ? (
                    <View style={styles.ramadanHeroContainer}>
                        <Text>Loading hero data...</Text>
                    </View>
                ) : heroError ? (
                    <View style={styles.ramadanHeroContainer}>
                        <Text>Error loading hero data: {heroError}</Text>
                    </View>
                ) : hero ? (
                    <View style={styles.ramadanHeroContainer}>
                        <Image
                            source={{ uri: `${DOMAIN}/${hero.image_url}` }}
                            style={styles.ramadanHeroImage}
                            resizeMode="cover"
                            blurRadius={3}
                        />
                        <View style={styles.ramadanHeroOverlay}>
                            <View style={styles.ramadanHeroContent}>
                                <Text style={styles.ramadanHeroTitle}>{hero.title}</Text>
                                <Text style={styles.ramadanHeroSubtitle}>{hero.description}</Text>
                            </View>
                        </View>
                    </View>
                ) : null}

               
                {/* Services Carousel */}
                <View style={tw`mb-4 mt-8`}>
                    <Text style={[tw`text-2xl text-right px-4 mb-2`, styles.rtlText]}>الخدمات</Text>
                    <Animated.ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={[
                            styles.servicesScrollContainer,
                            { paddingHorizontal: (screenWidth - CARD_WIDTH) / 6 },
                        ]}
                        snapToInterval={CARD_WIDTH + SPACING}
                        decelerationRate="fast"
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                    >
                        {reversedCategories.map((category, index) => (
                            <ServiceItem key={category.id} category={category} index={index} scrollX={scrollX} />
                        ))}
                    </Animated.ScrollView>
                </View>

                {/* Ramadan Discounts Section */}
                <View style={tw`px-4 mt-4 mb-8`}>
                    <Text style={[tw`text-2xl text-right mb-4`, styles.rtlText]}>
                        عروض Gaarage
                    </Text>

                    {isLoadingDiscounts ? (
                        <View style={tw`py-4`}>
                            <Text style={[styles.rtlText, tw`text-center`]}>جاري تحميل العروض...</Text>
                        </View>
                    ) : discountsError ? (
                        <View style={tw`py-4`}>
                            <Text style={[styles.rtlText, tw`text-center text-red-500`]}>{discountsError}</Text>
                        </View>
                    ) : discountedProducts.length === 0 ? (
                        <View style={tw`py-4`}>
                            <Text style={[styles.rtlText, tw`text-center text-gray-600`]}>
                                لا توجد عروض متاحة في هذا اليوم
                            </Text>
                            <Text style={[styles.rtlText, tw`text-center text-gray-500 mt-2`]}>
                                تابعنا لتصلك أحدث العروض الحصرية!
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.discountGrid}>
                            {discountedProducts.map((product) => (
                                <TouchableOpacity
                                    key={product.id}
                                    style={styles.discountItemContainer}
                                    onPress={() => handleProductPress(product)}
                                >
                                    <Image
                                        source={{ uri: CitiesService.getProductImageUrl(product.image) }}
                                        style={styles.discountProductImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.discountBadge}>
                                        <Text style={styles.discountBadgeText}>{product.discountPercentage}% خصم</Text>
                                    </View>
                                    <View style={styles.discountItemContent}>
                                        <Text style={[styles.rtlText, styles.productTitle]} numberOfLines={1}>
                                            {product.nom}
                                        </Text>
                                        <Text style={styles.productDescription} numberOfLines={2}>
                                            {product.description}
                                        </Text>
                                        <View style={styles.priceContainer}>
                                            <Text style={styles.currentPrice}>{product.prix} درهم</Text>
                                            <Text style={styles.originalPrice}>{product.originalPrice} درهم</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
                </View>

                {/* Add bottom padding for dock */}
                <View style={styles.dockSpacer} />
            </ScrollView>
            <Dock />
        </View>
    )
}

const styles = StyleSheet.create({
    rtlText: {
        textAlign: "right",
        writingDirection: "rtl",
        fontFamily: "system",
    },
    ramadanHeroContainer: {
        width: "100%",
        height: 220,
        position: "relative",
    },
    ramadanHeroImage: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        height: "100%",
    },
    ramadanHeroOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    ramadanHeroContent: {
        paddingHorizontal: 20,
        alignItems: "center",
    },
    ramadanHeroBigTitle: {
        color: "#0506DC",
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 2,
        textShadowColor: "white",
        textShadowOffset: { width: -1, height: -1 },
        textShadowRadius: 1,
    },
    ramadanHeroTitle: {
        color: "#0506DC",
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        textShadowColor: "white",
        textShadowOffset: { width: -1, height: -1 },
        textShadowRadius: 1,
    },
    ramadanHeroSubtitle: {
        color: "#FFDE00",
        fontSize: 20,
        textAlign: "center",
        marginBottom: 20,
        lineHeight: 24,

    },
    serviceItemContainer: {
        borderRadius: 16,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        marginBottom: 10,
        overflow: "hidden",
    },
    serviceItemInner: {
        flex: 1,
        alignItems: "center",
    },
    serviceImage: {
        width: "100%",
        height: "100%",
        borderRadius: 16,
    },
    servicesScrollContainer: {
        alignItems: "center",
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    discountGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        paddingHorizontal: GRID_SPACING / 32,
    },
    discountItemContainer: {
        width: (screenWidth - GRID_SPACING * 3) / 2,
        backgroundColor: "white",
        borderRadius: 12,
        marginBottom: GRID_SPACING,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
    },

    discountProductImage: {
        width: "100%",
        height: 120,
        backgroundColor: "#f5f5f5",
    },
    discountBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "#DC0506",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    discountBadgeText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
    },
    discountItemContent: {
        padding: 12,
    },
    productTitle: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 4,
    },
    productDescription: {
        fontSize: 11,
        color: "#666",
        marginBottom: 6,
        textAlign: "right",
    },
    priceContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: 8,
    },
    currentPrice: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#DC0506",
    },
    originalPrice: {
        fontSize: 12,
        color: "#666",
        textDecorationLine: "line-through",
    },
    dockSpacer: {
        height: 80,
    },
})

export default MartScreen

