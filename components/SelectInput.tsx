import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Picker } from "@react-native-picker/picker"
import tw from "tailwind-react-native-classnames"

interface SelectInputProps {
    label: string
    value: string
    items: Array<{ value: string; label: string }>
    onValueChange: (value: string) => void
    error?: string
    style?: any
}

const SelectInput: React.FC<SelectInputProps> = ({ label, value, items, onValueChange, error, style }) => {
    return (
        <View style={style}>
            <Text style={[tw`mb-1`, styles.rtlText]}>{label}</Text>
            <View style={[tw`border rounded-lg`, error ? tw`border-red-500` : tw`border-gray-300`]}>
                <Picker selectedValue={value} onValueChange={onValueChange} style={styles.rtlText}>
                    <Picker.Item label="اختر الوجهة" value="" />
                    {items.map((item) => (
                        <Picker.Item key={item.value} label={item.label} value={item.value} />
                    ))}
                </Picker>
            </View>
            {error && <Text style={[tw`text-red-500 mt-1`, styles.rtlText]}>{error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    rtlText: {
        textAlign: "right",
        writingDirection: "rtl",
    },
})

export default SelectInput

