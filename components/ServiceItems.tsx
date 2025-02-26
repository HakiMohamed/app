import { useState, useCallback, useRef, useEffect } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import tw from "tailwind-react-native-classnames";
import { RootStackParamList } from "../App"; // Update this import path based on your file structure
import Header from "../components/layout/Header";
import CitiesService from "../services/citiesService";
import Button from "../components/Button";
import Dock from "../components/Dock";
import { useCart } from "../contexts/CartContext";

type ServiceItemsRouteProp = RouteProp<RootStackParamList, "ServiceItems">;
type ServiceItemsNavigationProp = StackNavigationProp<RootStackParamList>;

interface ServiceItemsProps {
    route: ServiceItemsRouteProp;
    navigation: ServiceItemsNavigationProp;
}

const { width: screenWidth } = Dimensions.get("window");
const itemSize = (screenWidth - 24) / 2;
const DEBOUNCE_TIME = 500; // 500ms debounce

const ServiceItems = ({ route, navigation }: ServiceItemsProps) => {
    const { serviceName, category, cityName, cityId } = route.params;
    const [cartItems, setCartItems] = useState<{ [key: number]: number }>({});
    const [isPageLoading, setIsPageLoading] = useState(false);
    const loadingRef = useRef(false);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const mountedRef = useRef(true);

    const {
        products,
        isLoading,
        error,
        page,
        lastPage,
        total,
        isLoadingMore,
        loadProducts
    } = CitiesService.useProducts(Number.parseInt(category), cityId);

    useEffect(() => {
        return () => {
            mountedRef.current = false;
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    const handlePageChange = useCallback(async (newPage: number) => {
        if (loadingRef.current || !mountedRef.current) return;

        // Clear any existing debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(async () => {
            try {
                loadingRef.current = true;
                setIsPageLoading(true);
                await loadProducts(newPage);
            } catch (error) {
                console.error('Error loading page:', error);
            } finally {
                if (mountedRef.current) {
                    setIsPageLoading(false);
                    loadingRef.current = false;
                }
            }
        }, DEBOUNCE_TIME);
    }, [loadProducts]);

    const ProductImage = ({ uri }: { uri: string }) => {
        const [isLoading, setIsLoading] = useState(true);
        const [imageError, setImageError] = useState(false);
        const isMounted = useRef(true);

        useEffect(() => {
            return () => {
                isMounted.current = false;
            };
        }, []);

        const handleLoad = () => {
            // Add a small delay to ensure image is rendered
            requestAnimationFrame(() => {
                if (isMounted.current) {
                    setIsLoading(false);
                }
            });
        };

        return (
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri }}
                    style={[
                        styles.itemImage,
                        isLoading && styles.hiddenImage
                    ]}
                    onLoad={handleLoad}
                    onError={() => {
                        if (isMounted.current) {
                            setImageError(true);
                            setIsLoading(false);
                        }
                    }}
                />
                {isLoading && (
                    <View style={styles.imageLoader}>
                        <ActivityIndicator size="small" color="#000" />
                    </View>
                )}
                {imageError && (
                    <View style={styles.imageError}>
                        <Text>Failed to load image</Text>
                    </View>
                )}
            </View>
        );
    };

    const { addItem, items } = useCart();


    const handleAddToCart = async (item: any) => {
        try {
            await addItem({
                id: item.id,
                nom: item.nom,
                prix: item.prix,
                image: item.image
            });
            {/*
            // Optional: show feedback
            alert('تمت إضافة المنتج إلى السلة');
            */}
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('فشل في إضافة المنتج');
        }
    };

    // Update the renderItem function
    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={[tw`rounded-lg m-1`, styles.itemCard]}
            onPress={() => navigation.navigate("Product", { product: item })}
        >
            <ProductImage uri={CitiesService.getProductImageUrl(item.image)} />
            <View style={styles.itemContent}>
                <Text style={[tw`text-center font-bold mb-3`, styles.rtlText]} numberOfLines={1}>
                    {item.nom}
                </Text>
                <Text style={[tw`text-center mb-3`, styles.rtlText]}>
                    {item.prix} درهم
                </Text>
                <Button
                    title="إضافة إلى السلة"
                    onPress={() => handleAddToCart(item)}
                    disabled={isPageLoading}
                />
            </View>
        </TouchableOpacity>
    );

    const renderPagination = () => (
        <View style={tw`flex-row justify-center items-center py-4 bg-gray-100`}>
            <TouchableOpacity
                style={tw`px-4 py-2 mx-2 ${page === 1 || isPageLoading ? 'opacity-50' : ''}`}
                onPress={() => !isPageLoading && page > 1 && handlePageChange(page - 1)}
                disabled={page === 1 || isPageLoading}
            >
                <Text>السابق</Text>
            </TouchableOpacity>

            <Text style={tw`mx-4`}>{`${page} / ${lastPage}`}</Text>

            <TouchableOpacity
                style={tw`px-4 py-2 mx-2 ${page === lastPage || isPageLoading ? 'opacity-50' : ''}`}
                onPress={() => !isPageLoading && page < lastPage && handlePageChange(page + 1)}
                disabled={page === lastPage || isPageLoading}
            >
                <Text>التالي</Text>
            </TouchableOpacity>
        </View>
    );

    if (isLoading) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" color="#000" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Text>خطأ: {error}</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-white`}>
            <Header title={serviceName} showBack showCart />
            <FlatList
                data={products}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
                contentContainerStyle={tw`p-1 pb-20`}
                ListFooterComponent={renderPagination}
                removeClippedSubviews={true}
                maxToRenderPerBatch={8}
                windowSize={5}
                initialNumToRender={8}
                onEndReachedThreshold={0.5}
            />
            {isPageLoading && (
                <View style={styles.pageLoadingOverlay}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={tw`mt-2`}>Loading...</Text>
                </View>
            )}
            <Dock />
        </View>
    );
};

const styles = StyleSheet.create({
    rtlText: {
        textAlign: "right",
        writingDirection: "rtl",
        fontFamily: "system",
    },
    itemCard: {
        width: itemSize,
        height: itemSize + 100,
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageContainer: {
        width: "100%",
        height: itemSize - 10,
        position: 'relative',
    },
    itemImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    imageLoader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
    },
    imageError: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
    },
    itemContent: {
        padding: 8,
    },
    pageLoadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255,255,255,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    hiddenImage: {
        opacity: 0
    }
});

export default ServiceItems;
