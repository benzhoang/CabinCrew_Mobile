import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    SafeAreaView,
    ScrollView,
    Alert,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

export default function Signup({ onBackPress, onSignInPress, onSignUpSuccess, currentLang = 'vi' }) {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Dictionary cho đa ngôn ngữ
    const dictionaries = {
        vi: {
            signup_title: 'Đăng ký',
            signup_subtitle: 'Tạo tài khoản để bắt đầu',
            username_label: 'Tên đăng nhập',
            username_placeholder: 'Nhập tên đăng nhập',
            email_label: 'Email',
            email_placeholder: 'Nhập email của bạn',
            password_label: 'Mật khẩu',
            password_placeholder: 'Nhập mật khẩu',
            password_confirm_label: 'Xác nhận mật khẩu',
            password_confirm_placeholder: 'Nhập lại mật khẩu',
            creating_account: 'Đang đăng ký...',
            create_account: 'Tạo tài khoản',
            have_account: 'Đã có tài khoản?',
            signin_now: 'Đăng nhập ngay',
        },
        en: {
            signup_title: 'Sign up',
            signup_subtitle: 'Create an account to get started',
            username_label: 'Username',
            username_placeholder: 'Enter your username',
            email_label: 'Email',
            email_placeholder: 'Enter your email',
            password_label: 'Password',
            password_placeholder: 'Enter your password',
            password_confirm_label: 'Confirm password',
            password_confirm_placeholder: 'Re-enter your password',
            creating_account: 'Creating account...',
            create_account: 'Create account',
            have_account: 'Already have an account?',
            signin_now: 'Sign in now',
        },
    };

    const t = (key) => {
        const dict = dictionaries[currentLang] || dictionaries.vi;
        return dict[key] || key;
    };

    const validateForm = () => {
        if (!username.trim()) {
            Alert.alert(
                currentLang === 'vi' ? 'Lỗi' : 'Error',
                currentLang === 'vi' ? 'Vui lòng nhập tên đăng nhập' : 'Please enter username'
            );
            return false;
        }

        if (!email.trim()) {
            Alert.alert(
                currentLang === 'vi' ? 'Lỗi' : 'Error',
                currentLang === 'vi' ? 'Vui lòng nhập email' : 'Please enter email'
            );
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert(
                currentLang === 'vi' ? 'Lỗi' : 'Error',
                currentLang === 'vi' ? 'Email không hợp lệ' : 'Invalid email format'
            );
            return false;
        }

        if (!password.trim()) {
            Alert.alert(
                currentLang === 'vi' ? 'Lỗi' : 'Error',
                currentLang === 'vi' ? 'Vui lòng nhập mật khẩu' : 'Please enter password'
            );
            return false;
        }

        if (password.length < 6) {
            Alert.alert(
                currentLang === 'vi' ? 'Lỗi' : 'Error',
                currentLang === 'vi' ? 'Mật khẩu phải có ít nhất 6 ký tự' : 'Password must be at least 6 characters'
            );
            return false;
        }

        if (password !== confirmPassword) {
            Alert.alert(
                currentLang === 'vi' ? 'Lỗi' : 'Error',
                currentLang === 'vi' ? 'Mật khẩu xác nhận không khớp' : 'Password confirmation does not match'
            );
            return false;
        }

        return true;
    };

    const handleSignUp = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            Alert.alert(
                currentLang === 'vi' ? 'Thành công' : 'Success',
                currentLang === 'vi' ? 'Đăng ký thành công! Chào mừng bạn đến với CabinCrew!' : 'Sign up successful! Welcome to CabinCrew!',
                [{ text: 'OK', onPress: onSignUpSuccess }]
            );
        }, 2000);
    };

    return (
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                            <Text style={styles.backButtonText}>←</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Logo and Title */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../assets/icon.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.title}>{t('signup_title')}</Text>
                        <Text style={styles.subtitle}>{t('signup_subtitle')}</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.formContainer}>
                        {/* Username Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{t('username_label')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('username_placeholder')}
                                value={username}
                                onChangeText={setUsername}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{t('email_label')}</Text>
                            <TextInput
                                style={styles.input}
                                placeholder={t('email_placeholder')}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{t('password_label')}</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder={t('password_placeholder')}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Text style={styles.eyeButtonText}>
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Confirm Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{t('password_confirm_label')}</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder={t('password_confirm_placeholder')}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                                <TouchableOpacity
                                    style={styles.eyeButton}
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <Text style={styles.eyeButtonText}>
                                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
                            onPress={handleSignUp}
                            disabled={isLoading}
                        >
                            <Text style={styles.signUpButtonText}>
                                {isLoading ? t('creating_account') : t('create_account')}
                            </Text>
                        </TouchableOpacity>

                        {/* Sign In Link */}
                        <View style={styles.signInContainer}>
                            <Text style={styles.signInText}>{t('have_account')} </Text>
                            <TouchableOpacity onPress={onSignInPress}>
                                <Text style={styles.signInLink}>{t('signin_now')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Footer Cloud */}
                    <View style={styles.footerCloud} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const AIR_BLUE = '#0EA5E9';
const AIR_DARK = '#0B3757';
const AIR_SKY = '#E0F2FE';
const AIR_LIGHT = '#F0F9FF';

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: AIR_LIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButtonText: {
        fontSize: 20,
        color: AIR_DARK,
        fontWeight: 'bold',
    },
    logoContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: AIR_DARK,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
    },
    formContainer: {
        paddingHorizontal: 20,
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: AIR_DARK,
        marginBottom: 8,
    },
    input: {
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 16,
        backgroundColor: 'white',
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        paddingRight: 50,
        fontSize: 16,
        backgroundColor: 'white',
    },
    eyeButton: {
        position: 'absolute',
        right: 16,
        top: 14,
        padding: 4,
    },
    eyeButtonText: {
        fontSize: 18,
    },
    signUpButton: {
        backgroundColor: AIR_BLUE,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
        shadowColor: AIR_DARK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    signUpButtonDisabled: {
        backgroundColor: '#94A3B8',
    },
    signUpButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    signInText: {
        fontSize: 14,
        color: '#64748B',
    },
    signInLink: {
        fontSize: 14,
        color: AIR_BLUE,
        fontWeight: '600',
    },
    footerCloud: {
        width: '100%',
        height: 120,
        backgroundColor: AIR_SKY,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        marginTop: 'auto',
    },
});
