import React from 'react';
import { TouchableOpacity, Text, TouchableOpacityProps } from 'react-native';
import tw from 'tailwind-react-native-classnames';

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    onPress: () => void;
}

const Button = ({ title, onPress, ...props }: ButtonProps) => {
    return (
        <TouchableOpacity
            style={[tw`px-4 py-2 rounded-lg`, { backgroundColor: '#0506dc' }]}
            onPress={onPress}
            {...props}
        >
            <Text style={tw`text-white text-center font-bold`}>{title}</Text>
        </TouchableOpacity>
    );
};

export default Button;
