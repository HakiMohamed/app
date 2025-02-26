import React, { useCallback, useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, BackHandler } from "react-native";
import { TextInput } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import tw from "tailwind-react-native-classnames";
import { useAuth } from "../contexts/AuthContext";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import Header from "../components/layout/Header";
import Button from "../components/Button";
import Dock from "../components/Dock";
import {RootStackParamList} from "../App";

type AuthFormData = {
    fullName?: string;
    email: string;
    password: string;
    confirmPassword?: string;
    phone?: string;
    address?: string;
};

const loginSchema = yup.object().shape({
    email: yup.string().email("البريد الإلكتروني غير صالح").required("البريد الإلكتروني مطلوب"),
    password: yup
        .string()
        .min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل")
        .required("كلمة المرور مطلوبة"),
});

const rtlTheme = {
    colors: {
        primary: '#0506dc',
        error: 'red'
    },
};


const signUpSchema = yup.object().shape({
    fullName: yup
        .string()
        .matches(/^[\u0600-\u06FFa-zA-Z\s]{4,}$/, "الاسم يجب أن يحتوي على أحرف عربية أو إنجليزية فقط")
        .required("الاسم الكامل مطلوب"),
    email: yup
        .string()
        .email("البريد الإلكتروني غير صالح")
        .required("البريد الإلكتروني مطلوب"),
    password: yup
        .string()
        .min(8, "يجب أن تكون كلمة المرور 8 أحرف على الأقل")
        .required("كلمة المرور مطلوبة"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password")], "كلمات المرور غير متطابقة")
        .required("تأكيد كلمة المرور مطلوب"),
    phone: yup
        .string()
        .matches(/^(05|06|07)\d{8}$/, "رقم الهاتف يجب أن يبدأ ب 05 أو 06 أو 07 ويتكون من 10 أرقام")
        .required("رقم الهاتف مطلوب"),
    address: yup
        .string()
        .min(5, "العنوان يجب أن يكون 5 أحرف على الأقل")
        .required("العنوان مطلوب"),
});

const AuthenticationScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, signUp, isLoading } = useAuth();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>()
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isValid },
        trigger,
    } = useForm<AuthFormData>({
        resolver: yupResolver(isLogin ? loginSchema : signUpSchema),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
            fullName: '',
            confirmPassword: '',
            phone: '',
            address: ''
        }
    });

    const getButtonStyle = () => {
        const baseStyle = tw`bg-blue-600 rounded-lg py-3 px-6`;
        if (isLoading || !isValid) {
            return [baseStyle, tw`opacity-50`];
        }
        return baseStyle;
    };


    const navigateBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    useEffect(() => {
        const backAction = () => {
            navigateBack();
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => backHandler.remove();
    }, [navigateBack]);

    const onSubmit = async (data: AuthFormData) => {
        try {
            // Trigger validation before submission
            const isValidForm = await trigger();
            if (!isValidForm) {
                Alert.alert("خطأ في النموذج", "يرجى التحقق من صحة جميع الحقول");
                return;
            }

            if (isLogin) {
                await login({
                    email: data.email,
                    password: data.password
                });
            } else {
                if (data.password !== data.confirmPassword) {
                    Alert.alert("خطأ", "كلمات المرور غير متطابقة");
                    return;
                }
                await signUp({
                    fullName: data.fullName || '',
                    email: data.email,
                    password: data.password,
                    confirmPassword: data.confirmPassword || '',
                    phone: data.phone || '',
                    address: data.address || '',
                });
            }
            navigation.reset({
                index: 0,
                routes: [{ name: "Mart" }],
            });
        } catch (error: any) {
            const errorMessage = error.response?.data?.message ||
                (error instanceof Error ? error.message : "حدث خطأ غير متوقع");
            Alert.alert("خطأ في المصادقة", errorMessage);
        }
    };

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
        reset();
    };

    const renderErrorMessage = (field: keyof AuthFormData) => {
        return errors[field] && (
            <Text style={styles.errorText}>
                {errors[field]?.message}
            </Text>
        );
    };

    return (
        <View style={[tw`flex-1 bg-white`, styles.container]}>
            <Header
                title={isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
                showBack={true}
                showCart={false}
                onBackPress={navigateBack}
            />
            <ScrollView
                contentContainerStyle={tw`p-4 flex-grow justify-center`}
                keyboardShouldPersistTaps="handled"
            >
                {!isLogin && (
                    <>
                        <Controller
                            control={control}
                            name="fullName"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    label="الاسم الكامل"
                                    mode="outlined"
                                    value={value}
                                    onChangeText={onChange}
                                    error={!!errors.fullName}
                                    style={[styles.input, { textAlign: 'right' }]}
                                    theme={rtlTheme}
                                    placeholder="أدخل اسمك الكامل"
                                    placeholderTextColor="#A9A9A9"
                                    right={<TextInput.Icon icon="account" />}
                                />
                            )}
                        />
                        {renderErrorMessage('fullName')}
                    </>
                )}

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="البريد الإلكتروني"
                            mode="outlined"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.email}
                            style={styles.input}
                            keyboardType="email-address"
                            theme={rtlTheme}
                            placeholder="أدخل بريدك الإلكتروني"
                            placeholderTextColor="#A9A9A9"
                            textAlign="right"
                            right={<TextInput.Icon icon="email" />}
                        />
                    )}
                />
                {renderErrorMessage('email')}

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            label="كلمة المرور"
                            mode="outlined"
                            value={value}
                            onChangeText={onChange}
                            error={!!errors.password}
                            style={styles.input}
                            secureTextEntry
                            theme={rtlTheme}
                            placeholder="أدخل كلمة المرور"
                            placeholderTextColor="#A9A9A9"
                            textAlign="right"
                            right={<TextInput.Icon icon="lock" />}
                        />
                    )}
                />
                {renderErrorMessage('password')}

                {!isLogin && (
                    <>
                        <Controller
                            control={control}
                            name="confirmPassword"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    label="تأكيد كلمة المرور"
                                    mode="outlined"
                                    value={value}
                                    onChangeText={onChange}
                                    error={!!errors.confirmPassword}
                                    style={styles.input}
                                    secureTextEntry
                                    theme={rtlTheme}

                                    placeholder="أعد إدخال كلمة المرور"
                                    placeholderTextColor="#A9A9A9"
                                    textAlign="right"
                                    right={<TextInput.Icon icon="lock-check" />}
                                />
                            )}
                        />
                        {renderErrorMessage('confirmPassword')}

                        <Controller
                            control={control}
                            name="phone"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    label="رقم الهاتف"
                                    mode="outlined"
                                    value={value}
                                    onChangeText={onChange}
                                    error={!!errors.phone}
                                    style={styles.input}
                                    keyboardType="phone-pad"
                                    theme={rtlTheme}

                                    placeholder="أدخل رقم هاتفك"
                                    placeholderTextColor="#A9A9A9"
                                    textAlign="right"
                                    right={<TextInput.Icon icon="phone" />}
                                />
                            )}
                        />
                        {renderErrorMessage('phone')}

                        <Controller
                            control={control}
                            name="address"
                            render={({ field: { onChange, value } }) => (
                                <TextInput
                                    label="العنوان"
                                    mode="outlined"
                                    value={value}
                                    onChangeText={onChange}
                                    error={!!errors.address}
                                    style={styles.input}
                                    theme={rtlTheme}
                                    placeholder="أدخل عنوانك"
                                    placeholderTextColor="#A9A9A9"
                                    textAlign="right"
                                    right={<TextInput.Icon icon="map-marker" />}
                                />
                            )}
                        />
                        {renderErrorMessage('address')}
                    </>
                )}

                <Button
                    title={isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
                    onPress={handleSubmit(onSubmit)}
                    disabled={isLoading || !isValid}
                    style={getButtonStyle()}
                />

                <TouchableOpacity
                    onPress={toggleAuthMode}
                    disabled={isLoading}
                    style={tw`mt-4`}
                >
                    <Text style={tw`text-center text-blue-600`}>
                        {isLogin
                            ? "ليس لديك حساب؟ إنشاء حساب"
                            : "هل لديك حساب بالفعل؟ تسجيل الدخول"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <Dock />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignItems: 'stretch',
        writingDirection: 'rtl',
    },
    input: {
        marginBottom: 10,
        textAlign: 'right',
        writingDirection: 'rtl',
    },
    errorText: {
        color: 'red',
        marginBottom: 8,
        textAlign: 'right',
        writingDirection: 'rtl',
    }
});

export default AuthenticationScreen;
