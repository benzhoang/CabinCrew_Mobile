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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from '../i18n';
import { login as loginAPI } from '../service/api';

export default function Signin({ onBackPress, onSignInSuccess, currentLang = 'vi' }) {
    const { t, lang } = useTranslation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Hàm decode JWT để lấy thông tin từ token
    const decodeJWT = (token) => {
        try {
            const base64Url = token.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            // Sử dụng Buffer trong React Native hoặc decode base64 thủ công
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split("")
                    .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                    .join("")
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            console.error("Error decoding JWT:", error);
            return null;
        }
    };

    // Hàm map role từ API sang format trong app
    const mapRole = (apiRole) => {
        if (!apiRole) return null;
        const roleMap = {
            examiner: "examiner",
            recruiter: "recruiter",
            admin: "admin",
            director: "director",
            "senior-recruiter": "senior-recruiter",
            "airline-partner": "airline-partner",
            candidate: "candidate",
            "cabin-crew": "cabin-crew",
        };
        const normalizedRole = apiRole.toLowerCase().replace(/\s+/g, "");
        return roleMap[normalizedRole] || normalizedRole;
    };

    const handleSignIn = async () => {
        if (!username.trim() || !password.trim()) {
            Alert.alert(
                t('error'),
                t('error_fill_fields')
            );
            return;
        }

        setIsLoading(true);

        try {
            const result = await loginAPI(username.trim(), password);

            if (result.success && result.data) {
                const { accessToken, refreshToken } = result.data;

                // Decode JWT để lấy thông tin user
                const decodedToken = decodeJWT(accessToken);

                if (!decodedToken) {
                    setIsLoading(false);
                    Alert.alert(
                        currentLang === 'vi' ? 'Lỗi' : 'Error',
                        currentLang === 'vi' ? 'Không thể xác thực token. Vui lòng thử lại.' : 'Cannot verify token. Please try again.'
                    );
                    return;
                }

                // Lấy role từ JWT token
                const apiRole =
                    decodedToken[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                    ] ||
                    decodedToken.role ||
                    decodedToken.Role ||
                    decodedToken.roles?.[0];

                // Map role từ API sang format trong app
                const mappedRole = mapRole(apiRole);

                if (!mappedRole) {
                    setIsLoading(false);
                    Alert.alert(
                        currentLang === 'vi' ? 'Lỗi' : 'Error',
                        currentLang === 'vi' ? 'Không thể xác định role của người dùng.' : 'Cannot determine user role.'
                    );
                    return;
                }

                // Kiểm tra role examiner
                if (mappedRole !== 'examiner') {
                    setIsLoading(false);
                    Alert.alert(
                        currentLang === 'vi' ? 'Lỗi' : 'Error',
                        currentLang === 'vi'
                            ? 'Chỉ tài khoản Examiner mới có thể đăng nhập vào ứng dụng mobile.'
                            : 'Only Examiner accounts can sign in to the mobile app.'
                    );
                    return;
                }

                // Lấy user ID từ token
                const userId =
                    decodedToken[
                    "http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"
                    ] ||
                    decodedToken.sub ||
                    decodedToken.userId ||
                    decodedToken.id;

                // Tạo userInfo object
                const userInfo = {
                    username: username.trim(),
                    displayName:
                        decodedToken.name || decodedToken.unique_name || username.trim(),
                    role: mappedRole,
                    userId: userId,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                };

                // Lưu thông tin vào AsyncStorage
                await AsyncStorage.setItem('employee', JSON.stringify(userInfo));
                if (refreshToken) {
                    await AsyncStorage.setItem('refreshToken', refreshToken);
                }

                setIsLoading(false);
                Alert.alert(
                    currentLang === 'en' ? 'Thành công' : 'Success',
                    currentLang === 'en' ? 'Đăng nhập thành công!' : 'Sign in successful!',
                    [{ text: 'OK', onPress: onSignInSuccess }]
                );
            } else {
                setIsLoading(false);
                const errorMsg = result.error || (currentLang === 'vi' ? 'Thông tin đăng nhập không đúng' : 'Invalid login credentials');
                Alert.alert(
                    currentLang === 'vi' ? 'Lỗi đăng nhập' : 'Login Error',
                    errorMsg
                );
            }
        } catch (error) {
            setIsLoading(false);
            console.error('Login error:', error);
            Alert.alert(
                currentLang === 'vi' ? 'Lỗi' : 'Error',
                currentLang === 'vi'
                    ? 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.'
                    : 'An error occurred during login. Please try again.'
            );
        }
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
                        <Text style={styles.title}>{t('signin_title')}</Text>
                        <Text style={styles.subtitle}>{t('signin_subtitle')}</Text>
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

                        {/* Remember Me */}
                        <View style={styles.optionsContainer}>
                            <TouchableOpacity
                                style={styles.rememberContainer}
                                onPress={() => setRememberMe(!rememberMe)}
                            >
                                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                                </View>
                                <Text style={styles.rememberText}>{t('remember_me')}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
                            onPress={handleSignIn}
                            disabled={isLoading}
                        >
                            <Text style={styles.signInButtonText}>
                                {isLoading ? t('logging_in') : t('login')}
                            </Text>
                        </TouchableOpacity>


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
        justifyContent: 'space-between',
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
    languageButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: AIR_BLUE,
    },
    languageText: {
        color: AIR_BLUE,
        fontSize: 14,
        fontWeight: '600',
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
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 30,
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderWidth: 2,
        borderColor: AIR_BLUE,
        borderRadius: 4,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxChecked: {
        backgroundColor: AIR_BLUE,
    },
    checkmark: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    rememberText: {
        fontSize: 14,
        color: AIR_DARK,
    },
    signInButton: {
        backgroundColor: AIR_BLUE,
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: AIR_DARK,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    signInButtonDisabled: {
        backgroundColor: '#94A3B8',
    },
    signInButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
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
