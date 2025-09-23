// Simple i18n utility for React Native - VI/EN

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'lang';

const dictionaries = {
    vi: {
        // MainScreen
        main_title: 'CabinCrew',
        main_subtitle: 'Bay cao - Chạm ước mơ',
        signin: 'Đăng nhập',
        signup: 'Đăng ký',
        language: 'Ngôn ngữ',
        vi: 'Tiếng Việt',
        en: 'English',

        // Signin
        signin_title: 'Đăng nhập',
        signin_subtitle: 'Chào mừng bạn quay trở lại',
        username_label: 'Tên đăng nhập',
        username_placeholder: 'Nhập tên đăng nhập',
        password_label: 'Mật khẩu',
        password_placeholder: 'Nhập mật khẩu',
        password_show: 'Hiện mật khẩu',
        password_hide: 'Ẩn mật khẩu',
        remember_me: 'Ghi nhớ đăng nhập',
        forgot_password: 'Quên mật khẩu?',
        or: 'Hoặc',
        login_with_google: 'Đăng nhập với Google',
        logging_in: 'Đang đăng nhập...',
        no_account: 'Chưa có tài khoản?',
        signup_now: 'Đăng ký ngay',

        // Signup
        signup_title: 'Đăng ký',
        signup_subtitle: 'Tạo tài khoản để bắt đầu',
        email_label: 'Email',
        email_placeholder: 'Nhập email của bạn',
        password_confirm_label: 'Xác nhận mật khẩu',
        password_confirm_placeholder: 'Nhập lại mật khẩu',
        creating_account: 'Đang đăng ký...',
        create_account: 'Tạo tài khoản',
        have_account: 'Đã có tài khoản?',

        // OTP
        otp_title: 'Nhập mã OTP',
        otp_subtitle: 'Chúng tôi đã gửi mã 6 số tới email của bạn',
        otp_verifying: 'Đang xác thực...',
        otp_confirm: 'Xác nhận',
        otp_skip: 'Bỏ qua, đăng nhập sau',
    },
    en: {
        // MainScreen
        main_title: 'CabinCrew',
        main_subtitle: 'Fly High - Touch Dreams',
        signin: 'Sign in',
        signup: 'Sign up',
        language: 'Language',
        vi: 'Vietnamese',
        en: 'English',

        // Signin
        signin_title: 'Sign in',
        signin_subtitle: 'Welcome back',
        username_label: 'Username',
        username_placeholder: 'Enter your username',
        password_label: 'Password',
        password_placeholder: 'Enter your password',
        password_show: 'Show password',
        password_hide: 'Hide password',
        remember_me: 'Remember me',
        forgot_password: 'Forgot password?',
        or: 'Or',
        login_with_google: 'Sign in with Google',
        logging_in: 'Signing in...',
        no_account: "Don't have an account?",
        signup_now: 'Sign up now',

        // Signup
        signup_title: 'Sign up',
        signup_subtitle: 'Create an account to get started',
        email_label: 'Email',
        email_placeholder: 'Enter your email',
        password_confirm_label: 'Confirm password',
        password_confirm_placeholder: 'Re-enter your password',
        creating_account: 'Creating account...',
        create_account: 'Create account',
        have_account: 'Already have an account?',

        // OTP
        otp_title: 'Enter OTP',
        otp_subtitle: 'We have sent a 6-digit code to your email',
        otp_verifying: 'Verifying...',
        otp_confirm: 'Confirm',
        otp_skip: 'Skip, sign in later',
    },
};

const listeners = new Set();

export async function getLang() {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        return stored === 'en' || stored === 'vi' ? stored : 'vi';
    } catch (error) {
        console.warn('Error getting language from storage:', error);
        return 'vi';
    }
}

export async function setLang(nextLang) {
    try {
        const lang = nextLang === 'en' ? 'en' : 'vi';
        await AsyncStorage.setItem(STORAGE_KEY, lang);
        listeners.forEach((fn) => {
            try { fn(lang); } catch (e) { console.warn('Error in language change listener:', e); }
        });
    } catch (error) {
        console.warn('Error setting language:', error);
    }
}

export function onLangChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

export async function t(key) {
    const lang = await getLang();
    const dict = dictionaries[lang] || dictionaries.vi;
    return dict[key] || key;
}

// Hook for React components
export function useTranslation() {
    const [lang, setLangState] = React.useState('vi');

    React.useEffect(() => {
        getLang().then(setLangState);
        const unsubscribe = onLangChange(setLangState);
        return unsubscribe;
    }, []);

    const t = (key) => {
        const dict = dictionaries[lang] || dictionaries.vi;
        return dict[key] || key;
    };

    const changeLanguage = async (newLang) => {
        await setLang(newLang);
    };

    return { t, lang, changeLanguage };
}

export default { t, getLang, setLang, onLangChange, useTranslation };