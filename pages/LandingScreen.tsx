import { useEffect, useCallback } from "react";
import { View, Dimensions, Image } from "react-native"; // Import Image from react-native
import { useNavigation } from "@react-navigation/native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withSequence,
    Easing,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

import tw from "tailwind-react-native-classnames";
import { ParticleSystem } from "../components/ParticleSystem";
import { GlowingBorder } from "../components/GlowingBorder";

const { width } = Dimensions.get("window");

const LandingScreen = () => {
    const navigation = useNavigation();
    const scale = useSharedValue(0.5);
    const rotate = useSharedValue(0);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    // Gesture handler for interactive animations
    const gesture = Gesture.Pan()
        .onUpdate((event) => {
            translateX.value = event.translationX;
            translateY.value = event.translationY;
        })
        .onEnd(() => {
            translateX.value = withSpring(0);
            translateY.value = withSpring(0);
            rotate.value = withSequence(
                withTiming(rotate.value + 2 * Math.PI, { duration: 1000 }),
                withTiming(0, { duration: 0 }),
            );
        });

    const navigateToHome = useCallback(() => {
        navigation.navigate("Home");
    }, [navigation]);

    useEffect(() => {
        // Initial animation sequence
        scale.value = withSequence(
            withTiming(1.2, { duration: 1000, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }),
            withSpring(1, { damping: 8, stiffness: 100 }),
        );

        // Navigate after animations
        const timer = setTimeout(() => {
            navigateToHome();
        }, 4000);

        return () => clearTimeout(timer);
    }, [navigateToHome]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: scale.value },
            { translateX: translateX.value },
            { translateY: translateY.value },
        ],
    }));

    return (
        <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: "#0506DC" }]}>
            <ParticleSystem />
            <GestureDetector gesture={gesture}>
                <GlowingBorder>
                    <Animated.View style={[animatedStyle, { width: width * 0.8 }]}>
                        <Image
                            source={require("../assets/11.png")} // Load the PNG image
                            style={{ width: "100%", height: "100%", resizeMode: "contain" }} // Adjust size and scaling
                        />
                    </Animated.View>
                </GlowingBorder>
            </GestureDetector>
        </View>
    );
};

export default LandingScreen;
