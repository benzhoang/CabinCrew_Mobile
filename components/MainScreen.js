import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useTranslation } from '../i18n';

export default function MainScreen({ onSignInPress, onSignUpPress, currentLang, onLanguageChange }) {
    const { t, lang, changeLanguage } = useTranslation();

    const toggleLanguage = () => {
        const newLang = lang === 'vi' ? 'en' : 'vi';
        changeLanguage(newLang);
        // Truyền ngôn ngữ mới lên App.js
        if (onLanguageChange) {
            onLanguageChange(newLang);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                {/* Language Toggle Button */}
                <TouchableOpacity
                    style={styles.languageButton}
                    onPress={toggleLanguage}
                    activeOpacity={0.7}
                >
                    <Text style={styles.languageText}>
                        {lang === 'vi' ? 'EN' : 'VI'}
                    </Text>
                </TouchableOpacity>

                <View style={styles.heroContainer}>
                    <Image
                        source={require('../assets/icon.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>{t('main_title')}</Text>
                    <Text style={styles.subtitle}>{t('main_subtitle')}</Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.primaryButton]}
                        activeOpacity={0.85}
                        onPress={onSignInPress}
                    >
                        <Text style={styles.primaryButtonText}>{t('signin')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.button, styles.secondaryButton]}
                        activeOpacity={0.85}
                        onPress={onSignUpPress}
                    >
                        <Text style={styles.secondaryButtonText}>{t('signup')}</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footerCloud} />
            </View>
        </SafeAreaView>
    );
}

const AIR_BLUE = '#0EA5E9';
const AIR_DARK = '#0B3757';
const AIR_SKY = '#E0F2FE';

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 40,
    },
    heroContainer: {
        alignItems: 'center',
        marginTop: 24,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 12,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: AIR_DARK,
        letterSpacing: 0.5,
    },
    subtitle: {
        fontSize: 14,
        color: '#497799',
        marginTop: 6,
    },
    buttonsContainer: {
        width: '86%',
        gap: 14,
    },
    button: {
        height: 52,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: AIR_DARK,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 3,
    },
    primaryButton: {
        backgroundColor: AIR_BLUE,
    },
    primaryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    secondaryButton: {
        backgroundColor: 'white',
        borderWidth: 2,
        borderColor: AIR_BLUE,
    },
    secondaryButtonText: {
        color: AIR_BLUE,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    footerCloud: {
        width: '100%',
        height: 160,
        backgroundColor: AIR_SKY,
        borderTopLeftRadius: 80,
        borderTopRightRadius: 80,
    },
    languageButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: AIR_BLUE,
        zIndex: 10,
    },
    languageText: {
        color: AIR_BLUE,
        fontSize: 14,
        fontWeight: '600',
    },
});
