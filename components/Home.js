import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useTranslation } from '../i18n';
import CampaignScreen from '../screens/CampaignScreen';
import TaskScreen from '../screens/TaskScreen';

export default function Home({ onSignOutPress, navigation }) {
    const { t, lang } = useTranslation();
    const [activeTab, setActiveTab] = useState('campaign');

    const tabs = [
        { key: 'campaign', label: t('campaign'), icon: '📋' },
        { key: 'task', label: t('task'), icon: '📝' },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'campaign':
                return <CampaignScreen onSignOutPress={onSignOutPress} navigation={navigation} />;
            case 'task':
                return <TaskScreen onSignOutPress={onSignOutPress} navigation={navigation} />;
            case 'interviews':
                return (
                    <View style={styles.contentContainer}>
                        <Text style={styles.contentTitle}>{t('interviews')}</Text>
                        <Text style={styles.contentText}>
                            {lang === 'vi'
                                ? 'Lên lịch và quản lý phỏng vấn'
                                : 'Schedule and manage task'
                            }
                        </Text>
                    </View>
                );
            case 'scoring':
                return (
                    <View style={styles.contentContainer}>
                        <Text style={styles.contentTitle}>{t('scoring')}</Text>
                        <Text style={styles.contentText}>
                            {lang === 'vi'
                                ? 'Chấm điểm và đánh giá ứng viên'
                                : 'Score and evaluate candidates'
                            }
                        </Text>
                    </View>
                );
            default:
                return null;
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />

            {/* Header - chỉ hiển thị khi không phải tab campaign */}
            {activeTab !== 'campaign' && (
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>👤</Text>
                        </View>
                        <View style={styles.userTextContainer}>
                            <Text style={styles.headerTitle}>{t('welcome_back')}</Text>
                            <Text style={styles.userName}>Examiner</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.signOutButton} onPress={onSignOutPress}>
                        <Text style={styles.signOutIcon}>↩</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Content Area - CampaignScreen là màn hình chính */}
            <View style={styles.content}>
                {activeTab === 'campaign' ? (
                    <CampaignScreen onSignOutPress={onSignOutPress} navigation={navigation} />
                ) : (
                    renderContent()
                )}
            </View>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[
                            styles.tab,
                            activeTab === tab.key && styles.activeTab
                        ]}
                        onPress={() => setActiveTab(tab.key)}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.tabIcon,
                            activeTab === tab.key && styles.activeTabIcon
                        ]}>
                            {tab.icon}
                        </Text>
                        <Text style={[
                            styles.tabLabel,
                            activeTab === tab.key && styles.activeTabLabel
                        ]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </SafeAreaView>
    );
}

const AIR_BLUE = '#0EA5E9';
const AIR_DARK = '#0B3757';
const AIR_RED = '#DC2626';
const AIR_GREEN = '#059669';
const AIR_PURPLE = '#7C3AED';

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    avatarText: {
        fontSize: 24,
        color: '#6B7280',
    },
    userTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AIR_DARK,
        marginBottom: 2,
    },
    userName: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    signOutButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FEE2E2',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    signOutIcon: {
        fontSize: 18,
        color: AIR_RED,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    contentContainer: {
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    contentTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: AIR_DARK,
        marginBottom: 12,
    },
    contentText: {
        fontSize: 16,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 24,
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingBottom: 8,
        paddingTop: 8,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 8,
        backgroundColor: '#F8FAFC',
        marginHorizontal: 4,
        marginVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    activeTab: {
        backgroundColor: AIR_BLUE,
        borderColor: AIR_BLUE,
    },
    tabIcon: {
        fontSize: 20,
        marginBottom: 4,
    },
    activeTabIcon: {
        // Icon color remains the same for emojis
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
        textAlign: 'center',
    },
    activeTabLabel: {
        color: 'white',
    },
});
