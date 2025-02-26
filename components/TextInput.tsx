// components/TextInput.tsx
import React from 'react';
import { View, Text, TextInput as RNTextInput, StyleSheet } from 'react-native';
import tw from 'tailwind-react-native-classnames';

interface TextInputProps {
    label: string;
    error?: string;
    style?: any;
    [x: string]: any;
}

const TextInput: React.FC<TextInputProps> = ({ label, error, style, ...props }) => {
    return (
        <View style={style}>
            <Text style={[tw`mb-1`, styles.rtlText]}>{label}</Text>
            <RNTextInput
                style={[
                    tw`border rounded-lg p-2`,
                    styles.rtlText,
                    error ? tw`border-red-500` : tw`border-gray-300`,
                ]}
                placeholderTextColor="#9CA3AF"
                {...props}
            />
            {error && <Text style={[tw`text-red-500 mt-1`, styles.rtlText]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    rtlText: {
        textAlign: 'right',
        writingDirection: 'rtl',
    }
});

export default TextInput;
