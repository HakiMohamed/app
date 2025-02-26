import type React from "react"
import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import tw from "tailwind-react-native-classnames"
import Icon from "react-native-vector-icons/MaterialIcons"

type EditableInfoRowProps = {
    icon: string;
    label: string;
    value: string;
    onEdit: (value: string) => void;
};

export const EditableInfoRow: React.FC<EditableInfoRowProps> = ({ icon, label, value, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false)
    const [editedValue, setEditedValue] = useState(value)

    const handleSave = () => {
        if (editedValue !== value) {
            onEdit(editedValue)
        }
        setIsEditing(false)
    }

    const handleCancel = () => {
        setEditedValue(value)
        setIsEditing(false)
    }

    return (
        <View style={tw`mb-3`}>
            <View style={tw`flex-row items-center justify-between mb-1`}>
                {isEditing ? (
                    <View style={tw`flex-row`}>
                        <TouchableOpacity onPress={handleSave} style={tw`mr-2`}>
                            <Icon name="check" size={20} color="#22C55E" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancel}>
                            <Icon name="close" size={20} color="#EF4444" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <TouchableOpacity onPress={() => setIsEditing(true)}>
                        <Icon name="edit" size={20} color="#4A5568" />
                    </TouchableOpacity>
                )}
                <View style={tw`flex-row items-center`}>
                    <Text style={[tw`mr-2 text-base text-gray-600`, styles.rtlText]}>{label}</Text>
                    <Icon name={icon} size={20} color="#4A5568" />
                </View>
            </View>
            {isEditing ? (
                <TextInput
                    style={[tw`text-lg text-right text-gray-800 border-b border-gray-300 p-2`, styles.rtlText]}
                    value={editedValue}
                    onChangeText={setEditedValue}
                    autoFocus
                    selectTextOnFocus
                />
            ) : (
                <Text style={[tw`text-lg text-right text-gray-800`, styles.rtlText]}>{value}</Text>
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    rtlText: {
        textAlign: "right",
        writingDirection: "rtl",
    },
})

