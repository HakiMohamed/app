import { useState } from "react"
import { View, TextInput, StyleSheet } from "react-native"
import Icon from "react-native-vector-icons/Ionicons"

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("")

    const handleSearch = (query: string) => {
        setSearchQuery(query)
        // Implement search logic here
    }

    return (
        <View style={styles.container}>
            <Icon name="search-outline" size={20} color="#999" style={styles.icon} />
            <TextInput style={styles.input} placeholder="Search..." value={searchQuery} onChangeText={handleSearch} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 40,
        fontSize: 16,
    },
})

export default Search

