import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    FlatList,
} from 'react-native';
import { useTranslation } from '../i18n';

export default function CampaignScreen({ onSignOutPress, onBackPress }) {
    const { t, lang } = useTranslation();
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Dữ liệu campaign từ CabinCrew web app
    const campaigns = [
        {
            id: 1,
            name: 'Tuyển dụng Tiếp viên hàng không 2024',
            position: 'Flight Attendant',
            department: 'Cabin Crew',
            status: 'active',
            startDate: '2024-01-15',
            endDate: '2024-03-15',
            targetHires: 20,
            currentHires: 8,
            description: 'Tuyển dụng tiếp viên hàng không cho các chuyến bay nội địa và quốc tế',
            requirements: 'Tiếng Anh tốt, Chiều cao 1.60m+, Kỹ năng giao tiếp, Sức khỏe tốt'
        },
        {
            id: 2,
            name: 'Chiến dịch Pilot Training',
            position: 'Pilot',
            department: 'Flight Operations',
            status: 'completed',
            startDate: '2024-01-01',
            endDate: '2024-02-28',
            targetHires: 5,
            currentHires: 5,
            description: 'Tuyển dụng và đào tạo phi công cho đội bay mới',
            requirements: 'Bằng lái máy bay, Kinh nghiệm bay, Tiếng Anh thành thạo'
        },
        {
            id: 3,
            name: 'Ground Staff Campaign',
            position: 'Ground Staff',
            department: 'Ground Operations',
            status: 'paused',
            startDate: '2024-02-01',
            endDate: '2024-04-30',
            targetHires: 15,
            currentHires: 6,
            description: 'Tuyển dụng nhân viên mặt đất cho sân bay',
            requirements: 'Kỹ năng xử lý hành lý, Giao tiếp tốt, Làm việc ca'
        },
        {
            id: 4,
            name: 'Customer Service Expansion',
            position: 'Customer Service Agent',
            department: 'Customer Service',
            status: 'active',
            startDate: '2024-02-15',
            endDate: '2024-05-15',
            targetHires: 12,
            currentHires: 4,
            description: 'Mở rộng đội ngũ chăm sóc khách hàng',
            requirements: 'Kỹ năng giao tiếp, Tiếng Anh, Xử lý tình huống'
        },
        {
            id: 5,
            name: 'Maintenance Team',
            position: 'Aircraft Mechanic',
            department: 'Maintenance',
            status: 'active',
            startDate: '2024-03-01',
            endDate: '2024-06-30',
            targetHires: 8,
            currentHires: 2,
            description: 'Tuyển dụng kỹ thuật viên bảo trì máy bay',
            requirements: 'Bằng kỹ thuật, Kinh nghiệm bảo trì, An toàn lao động'
        }
    ];

    const statusFilters = [
        { key: 'all', label: 'Tất cả', color: '#6B7280' },
        { key: 'active', label: 'Đang hoạt động', color: '#059669' },
        { key: 'completed', label: 'Hoàn thành', color: '#3B82F6' },
        { key: 'paused', label: 'Tạm dừng', color: '#D97706' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'active':
                return '#059669'; // Xanh - Đang hoạt động
            case 'completed':
                return '#3B82F6'; // Xanh dương - Hoàn thành
            case 'paused':
                return '#D97706'; // Vàng - Tạm dừng
            default:
                return '#6B7280';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'active':
                return 'Đang hoạt động';
            case 'completed':
                return 'Hoàn thành';
            case 'paused':
                return 'Tạm dừng';
            default:
                return status;
        }
    };

    const filteredCampaigns = selectedStatus === 'all'
        ? campaigns
        : campaigns.filter(campaign => campaign.status === selectedStatus);

    const getProgressPercentage = (current, target) => {
        return Math.round((current / target) * 100);
    };

    const renderCampaignCard = ({ item }) => (
        <View style={styles.campaignCard}>
            <View style={styles.cardHeader}>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {getStatusText(item.status)}
                    </Text>
                </View>
                <Text style={styles.applicantCount}>{item.currentHires}/{item.targetHires} người</Text>
            </View>

            <Text style={styles.campaignTitle}>{item.name}</Text>
            <Text style={styles.companyName}>{item.department}</Text>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Tiến độ tuyển dụng</Text>
                    <Text style={styles.progressPercentage}>{getProgressPercentage(item.currentHires, item.targetHires)}%</Text>
                </View>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${getProgressPercentage(item.currentHires, item.targetHires)}%` }
                        ]}
                    />
                </View>
            </View>

            <View style={styles.campaignDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Vị trí:</Text>
                    <Text style={styles.detailValue}>{item.position}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Thời gian:</Text>
                    <Text style={styles.detailValue}>{item.startDate} - {item.endDate}</Text>
                </View>
            </View>

            <Text style={styles.descriptionText}>{item.description}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header cho CampaignScreen */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>👤</Text>
                    </View>
                    <View style={styles.userTextContainer}>
                        <Text style={styles.headerTitle}>{t('campaigns')}</Text>
                        <Text style={styles.userName}>Quản lý chiến dịch</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.signOutButton} onPress={onSignOutPress}>
                    <Text style={styles.signOutIcon}>↩</Text>
                </TouchableOpacity>
            </View>

            {/* Campaign List với Filter */}
            <View style={styles.content}>
                {/* Filter Buttons */}
                <View style={styles.filterContainer}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filterScrollContent}
                        bounces={false}
                        decelerationRate="fast"
                    >
                        {statusFilters.map((filter) => (
                            <TouchableOpacity
                                key={filter.key}
                                style={[
                                    styles.filterButton,
                                    selectedStatus === filter.key && styles.activeFilterButton,
                                    { borderColor: filter.color }
                                ]}
                                onPress={() => setSelectedStatus(filter.key)}
                            >
                                <Text style={[
                                    styles.filterText,
                                    selectedStatus === filter.key && styles.activeFilterText,
                                    { color: selectedStatus === filter.key ? 'white' : filter.color }
                                ]}>
                                    {filter.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Campaign List */}
                <FlatList
                    data={filteredCampaigns}
                    renderItem={renderCampaignCard}
                    keyExtractor={(item) => item.id.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listContainer}
                />
            </View>
        </View>
    );
}

const AIR_BLUE = '#0EA5E9';
const AIR_DARK = '#0B3757';
const AIR_RED = '#DC2626';
const AIR_GREEN = '#059669';
const AIR_PURPLE = '#7C3AED';

const styles = StyleSheet.create({
    container: {
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
    filterContainer: {
        paddingVertical: 12,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    filterScrollContent: {
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    filterButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 2,
        marginRight: 12,
        backgroundColor: 'white',
        minWidth: 80,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    activeFilterButton: {
        backgroundColor: AIR_BLUE,
        borderColor: AIR_BLUE,
        shadowColor: AIR_BLUE,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
    },
    filterText: {
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'center',
    },
    activeFilterText: {
        color: 'white',
    },
    content: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    listContainer: {
        padding: 20,
    },
    campaignCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginHorizontal: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    applicantCount: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
    },
    campaignTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: AIR_DARK,
        marginBottom: 6,
        lineHeight: 24,
    },
    companyName: {
        fontSize: 15,
        color: '#6B7280',
        marginBottom: 20,
        fontWeight: '600',
    },
    campaignDetails: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 4,
    },
    detailLabel: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '600',
    },
    detailValue: {
        fontSize: 15,
        color: AIR_DARK,
        fontWeight: '700',
    },
    deadlineText: {
        color: AIR_RED,
        fontWeight: '800',
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    progressLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
    },
    progressPercentage: {
        fontSize: 14,
        color: AIR_BLUE,
        fontWeight: '700',
    },
    progressBar: {
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: AIR_BLUE,
        borderRadius: 3,
    },
    descriptionText: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
        marginTop: 8,
    },
});