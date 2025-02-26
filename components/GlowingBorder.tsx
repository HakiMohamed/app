import React from "react"
import Animated, { useAnimatedStyle, withRepeat, withTiming, useSharedValue } from "react-native-reanimated"

export const GlowingBorder = ({ children }) => {
    const glowIntensity = useSharedValue(0)

    React.useEffect(() => {
        glowIntensity.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true)
    }, [glowIntensity]) // Added glowIntensity to dependencies

    const glowStyle = useAnimatedStyle(() => ({
        shadowOpacity: 0.5 + glowIntensity.value * 0.5,
        shadowRadius: 10 + glowIntensity.value * 20,
    }))

    return (
        <Animated.View
            style={[
                {
                    shadowColor: "#0052FF",
                    shadowOffset: { width: 0, height: 0 },
                },
                glowStyle,
            ]}
        >
            {children}
        </Animated.View>
    )
}

