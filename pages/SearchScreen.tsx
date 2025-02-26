import { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import tw from "tailwind-react-native-classnames";
import Header from "../components/layout/Header";
import Dock from "../components/Dock";
import CitiesService, {BASE_URL, Product} from "../services/citiesService";
import {RootStackParamList} from "../App"; // Import CitiesService for API calls

type SearchScreenNavigationProp = NavigationProp<RootStackParamList>;


const SearchScreen = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigation = useNavigation<SearchScreenNavigationProp>();

    // Debounce search input to avoid excessive API calls
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery) {
                fetchSearchResults(searchQuery);
            } else {
                setFilteredProducts([]); // Clear results if search query is empty
            }
        }, 500); // 500ms debounce

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Fetch search results from the backend
    const fetchSearchResults = async (term: string) => {
        setIsLoading(true);
        setError(null);

        const url = `${BASE_URL}/search/product/${term}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setFilteredProducts(data);
        } catch (err: any) {
            console.error("[DEBUG] Search error:", err);
            setError(err.message || "Failed to fetch search results");
        } finally {
            setIsLoading(false);
        }
    };

    // Render each product item
    const renderProductItem = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productItem}
            onPress={() => navigation.navigate("Product", {
                product: {
                    id: item.id,
                    nom: item.nom,
                    prix: item.prix,
                    description: item.description,
                    image: item.image
                }
            })}
        >
            <Image
                source={{ uri: CitiesService.getProductImageUrl(item.image) }}
                style={styles.productImage}
            />
            <View style={styles.productInfo}>
                <Text style={[styles.productName, styles.rtlText]}>{item.nom}</Text>
                <Text style={[styles.productPrice, styles.rtlText]}>{item.prix} درهم</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={tw`flex-1 bg-white`}>
            <Header title="البحث" showBack showCart={false} />
            <View style={styles.searchContainer}>
                <TextInput
                    style={[styles.searchInput, styles.rtlText]}
                    placeholder="ابحث عن المنتجات..."
                    placeholderTextColor="#999"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {isLoading ? (
                <View style={tw`flex-1 justify-center items-center`}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            ) : error ? (
                <View style={tw`flex-1 justify-center items-center`}>
                    <Text style={tw`text-red-500`}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={filteredProducts}
                    renderItem={renderProductItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.productList}
                    ListEmptyComponent={
                        <View style={tw`flex-1 justify-center items-center`}>
                            <Text style={tw`text-gray-500`}>لا توجد نتائج</Text>
                        </View>
                    }
                />
            )}
            <View style={styles.dockSpacer} />


            <Dock />
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
        padding: 10,
        backgroundColor: "#f0f0f0",
    },
    searchInput: {
        height: 40,
        backgroundColor: "#fff",
        borderRadius: 20,
        paddingHorizontal: 15,
        textAlign: "right",
    },
    productList: {
        padding: 10,
    },
    productItem: {
        flexDirection: "row-reverse",
        alignItems: "center",
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginLeft: 10,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    productPrice: {
        fontSize: 14,
        color: "#0506DC",
    },
    rtlText: {
        textAlign: "right",
        writingDirection: "rtl",
    },
    dockSpacer: {
        height: 80,
    },
});

export default SearchScreen;
