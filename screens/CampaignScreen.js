import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { useTranslation } from '../i18n';
import { getMyCampaigns } from '../service/api';

export default function CampaignScreen({ onSignOutPress, onBackPress, navigation }) {
    const { t, lang } = useTranslation();
    const [selectedStatus, setSelectedStatus] = useState('active');
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Fetch campaigns từ API
    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);
            const result = await getMyCampaigns();

            if (result.success && result.data) {
                // Map API response về format mong đợi
                const mappedCampaigns = Array.isArray(result.data)
                    ? result.data.map(campaign => ({
                        id: campaign.id || campaign.campaignId,
                        name: campaign.name || campaign.campaignName || '',
                        position: campaign.position || campaign.jobPosition || '',
                        department: campaign.department || campaign.departmentName || '',
                        status: mapStatusFromAPI(campaign.status),
                        startDate: formatDate(campaign.startDate || campaign.startTime),
                        endDate: formatDate(campaign.endDate || campaign.endTime),
                        targetHires: campaign.targetHires || campaign.targetNumber || 0,
                        currentHires: campaign.currentHires || campaign.currentNumber || 0,
                        description: campaign.description || '',
                        requirements: campaign.requirements || '',
                        batches: campaign.batches || [],
                    }))
                    : [];
                setCampaigns(mappedCampaigns);
            } else {
                setError(result.error || 'Không thể tải danh sách chiến dịch');
            }
        } catch (err) {
            setError('Đã xảy ra lỗi khi tải dữ liệu');
            console.error('Error fetching campaigns:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Map status từ API về format trong app
    const mapStatusFromAPI = (apiStatus) => {
        if (!apiStatus) return 'active';
        const status = apiStatus.toLowerCase();
        if (status.includes('active') || status.includes('đang') || status === 'ongoing') {
            return 'active';
        }
        if (status.includes('complete') || status.includes('hoàn thành') || status === 'finished') {
            return 'completed';
        }
        if (status.includes('pause') || status.includes('tạm dừng') || status === 'paused') {
            return 'paused';
        }
        return 'active';
    };

    // Format date từ API
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch (e) {
            return dateString;
        }
    };

    const statusFilters = [
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

    const filteredCampaigns = campaigns.filter(campaign => campaign.status === selectedStatus);

    const getProgressPercentage = (current, target) => {
        // Xử lý các trường hợp edge case để tránh NaN
        const currentNum = Number(current) || 0;
        const targetNum = Number(target) || 0;

        if (targetNum === 0 || isNaN(targetNum) || isNaN(currentNum)) {
            return 0;
        }

        const percentage = Math.round((currentNum / targetNum) * 100);
        return isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage)); // Đảm bảo trong khoảng 0-100
    };

    const handleCampaignPress = (campaign) => {
        if (navigation) {
            navigation.navigate('BatchScreen', { campaignData: campaign });
        }
    };

    const renderCampaignCard = ({ item }) => (
        <TouchableOpacity
            style={styles.campaignCard}
            onPress={() => handleCampaignPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {getStatusText(item.status)}
                    </Text>
                </View>
                <Text style={styles.applicantCount}>
                    {item.currentHires || 0}/{item.targetHires || 0} người
                </Text>
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
                    <Text style={styles.detailLabel}>Ngày bắt đầu:</Text>
                    <Text style={styles.detailValue}>{item.startDate || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Ngày kết thúc:</Text>
                    <Text style={styles.detailValue}>{item.endDate || 'N/A'}</Text>
                </View>
            </View>

            <Text style={styles.descriptionText}>{item.description}</Text>
        </TouchableOpacity>
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

                {/* Loading State */}
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={AIR_BLUE} />
                        <Text style={styles.loadingText}>Đang tải danh sách chiến dịch...</Text>
                    </View>
                )}

                {/* Error State */}
                {!loading && error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={fetchCampaigns}
                        >
                            <Text style={styles.retryButtonText}>Thử lại</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Empty State */}
                {!loading && !error && filteredCampaigns.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Không có chiến dịch nào</Text>
                    </View>
                )}

                {/* Campaign List */}
                {!loading && !error && filteredCampaigns.length > 0 && (
                    <FlatList
                        data={filteredCampaigns}
                        renderItem={renderCampaignCard}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        refreshing={refreshing}
                        onRefresh={() => fetchCampaigns(true)}
                    />
                )}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 16,
        color: AIR_RED,
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: '500',
    },
    retryButton: {
        backgroundColor: AIR_BLUE,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
    },
});