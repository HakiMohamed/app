import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    withRepeat,
    withSequence,
    useSharedValue,
} from 'react-native-reanimated';

const Particle = ({ delay = 0 }) => {
    const opacity = useSharedValue(0);
    const scale = useSharedValue(0);
    const translateY = useSharedValue(0);

    useEffect(() => {
        setTimeout(() => {
            opacity.value = withSequence(
                withSpring(1),
                withSpring(0)
            );
            scale.value = withSequence(
                withSpring(1),
                withSpring(0)
            );
            translateY.value = withSpring(-50);
        }, delay);
    }, [delay]); // Added delay to useEffect dependencies

    const style = useAnimatedStyle(() => ({
        opacity: opacity.value,
        transform: [
            { scale: scale.value },
            { translateY: translateY.value }
        ]
    }));

    return (
        <Animated.View
            style={[{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: '#0052FF',
                position: 'absolute'
            }, style]}
        />
    );
};

export const ParticleSystem = () => {
    return (
        <View style={{ position: 'absolute', width: '100%', height: '100%' }}>
            {Array(20).fill(0).map((_, i) => (
                <Particle
                    key={i}
                    delay={i * 100}
                />
            ))}
        </View>
    );
};
