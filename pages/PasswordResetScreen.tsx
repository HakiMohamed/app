import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import tw from "tailwind-react-native-classnames";
import { Lock, Eye, EyeOff } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../App";
import Header from "../components/layout/Header";
import Button from "../components/Button";
import { AuthService } from "../services/authService";

type PasswordResetScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PasswordReset'>;

interface PasswordInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    showPassword: boolean;
    toggleShowPassword: () => void;
    error?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
                                                         value,
                                                         onChangeText,
                                                         placeholder,
                                                         showPassword,
                                                         toggleShowPassword,
                                                         error
                                                     }) => (
    <View style={tw`mb-4`}>
        <View style={[
            tw`flex-row items-center border rounded-xl p-3`,
            { borderColor: error ? '#EF4444' : '#E2E8F0' }
        ]}>
            <TouchableOpacity onPress={toggleShowPassword}>
                {showPassword ? (
                    <EyeOff size={20} color="#4A5568" />
                ) : (
                    <Eye size={20} color="#4A5568" />
                )}
            </TouchableOpacity>
            <TextInput
                style={[tw`flex-1 text-lg mx-2`, styles.rtlText]}
                placeholder={placeholder}
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#A0AEC0"
            />
            <Lock size={20} color="#4A5568" />
        </View>
        {error ? (
            <Text style={[tw`text-red-500 mt-1`, styles.rtlText]}>{error}</Text>
        ) : null}
    </View>
);

const PasswordResetScreen: React.FC = () => {
    const navigation = useNavigation<PasswordResetScreenNavigationProp>();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        };

        if (!oldPassword) {
            newErrors.oldPassword = "كلمة المرور القديمة مطلوبة";
            isValid = false;
        }

        if (!newPassword) {
            newErrors.newPassword = "كلمة المرور الجديدة مطلوبة";
            isValid = false;
        } else if (newPassword.length < 8) {
            newErrors.newPassword = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
            isValid = false;
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "تأكيد كلمة المرور مطلوب";
            isValid = false;
        } else if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = "كلمات المرور غير متطابقة";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const showSuccessAlert = () => {
        Alert.alert(
            "تم بنجاح",  // Title
            "تم تغيير كلمة المرور بنجاح! سيتم إعادة توجيهك إلى الصفحة السابقة", // Message
            [
                {
                    text: "حسناً",
                    onPress: () => navigation.goBack(),
                    style: "default"
                }
            ],
            { cancelable: false }
        );
    };

    const showErrorAlert = (errorMessage: string) => {
        Alert.alert(
            "خطأ",  // Title
            errorMessage,
            [
                {
                    text: "حسناً",
                    style: "default"
                }
            ],
            { cancelable: true }
        );
    };

    const handleResetPassword = async () => {
        if (!validateForm()) {
            return;
        }

        try {
            setIsLoading(true);

            await AuthService.resetPassword(oldPassword, newPassword);

            // Clear form after successful password reset
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");

            showSuccessAlert();
        } catch (error) {
            console.error("Password reset error:", error);

            let errorMessage = "حدث خطأ أثناء تغيير كلمة المرور. يرجى المحاولة مرة أخرى";

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            showErrorAlert(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={tw`flex-1 bg-gray-50`}>
            <Header
                title="تغيير كلمة المرور"
                showCart={false}
                showBack={true}
            />
            <ScrollView contentContainerStyle={tw`p-6`}>
                <View style={tw`bg-white rounded-2xl p-6 shadow-sm`}>
                    <Text style={[tw`text-gray-600 mb-6`, styles.rtlText]}>
                        قم بإدخال كلمة المرور القديمة وكلمة المرور الجديدة لتغيير كلمة المرور الخاصة بك
                    </Text>

                    <PasswordInput
                        value={oldPassword}
                        onChangeText={setOldPassword}
                        placeholder="كلمة المرور القديمة"
                        showPassword={showOldPassword}
                        toggleShowPassword={() => setShowOldPassword(!showOldPassword)}
                        error={errors.oldPassword}
                    />

                    <PasswordInput
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="كلمة المرور الجديدة"
                        showPassword={showNewPassword}
                        toggleShowPassword={() => setShowNewPassword(!showNewPassword)}
                        error={errors.newPassword}
                    />

                    <PasswordInput
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="تأكيد كلمة المرور الجديدة"
                        showPassword={showConfirmPassword}
                        toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                        error={errors.confirmPassword}
                    />

                    <Button
                        title="تغيير كلمة المرور"
                        onPress={handleResetPassword}
                        loading={isLoading}
                        disabled={isLoading}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    rtlText: {
        textAlign: "right",
        writingDirection: "rtl",
    },
});

export default PasswordResetScreen;
