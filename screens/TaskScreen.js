import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { useTranslation } from '../i18n';
import { getMyTasks } from '../service/api';

export default function TaskScreen({ onSignOutPress, navigation }) {
    const { t, lang } = useTranslation();
    const [selectedStatus, setSelectedStatus] = useState('pending');
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Fetch tasks từ API
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }
            setError(null);
            const result = await getMyTasks();

            if (result.success && result.data) {
                // Map API response về format mong đợi
                // result.data là mảng campaigns, mỗi campaign có assignments array chứa các task
                const mappedTasks = [];
                if (Array.isArray(result.data)) {
                    result.data.forEach((campaign) => {
                        if (campaign.assignments && Array.isArray(campaign.assignments)) {
                            campaign.assignments.forEach((assignment, index) => {
                                mappedTasks.push({
                                    id: assignment.assignmentId || `task-${campaign.campaignId}-${index}`,
                                    title: assignment.task || '',
                                    description: assignment.taskDescription || '',
                                    status: mapStatusFromAPI(assignment.status),
                                    priority: 'medium', // API không có priority field
                                    startDate: formatDate(campaign.startDate),
                                    endDate: formatDate(campaign.endDate),
                                    assignedAt: formatDateWithTime(assignment.assignedAt),
                                    createdAt: formatDate(assignment.assignedAt),
                                    campaignName: campaign.campaignName || '',
                                    campaignId: campaign.campaignId,
                                    campaignDescription: campaign.description || '',
                                    assignedBy: assignment.assignedBy || '',
                                    completedAt: assignment.completedAt ? formatDate(assignment.completedAt) : null,
                                    notes: assignment.notes || '',
                                });
                            });
                        }
                    });
                }
                setTasks(mappedTasks);
            } else {
                setError(result.error || t('task_error'));
            }
        } catch (err) {
            setError(t('task_error_general'));
            console.error('Error fetching tasks:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Map status từ API về format trong app
    const mapStatusFromAPI = (apiStatus) => {
        if (!apiStatus) return 'pending';
        // Normalize: remove spaces, convert to lowercase
        const status = apiStatus.replace(/\s+/g, '').toLowerCase();

        // Assigned
        if (status === 'assigned' || status.includes('assigned')) {
            return 'pending'; // Assigned = Đã giao
        }

        // Pending
        if (status === 'pending' || status.includes('pending') || status.includes('chờ') || status === 'waiting') {
            return 'pending';
        }

        // In Progress - xử lý nhiều format: "In Progress", "InProgress", "in_progress"
        if (status === 'inprogress' || status === 'in_progress' || status.includes('inprogress') || status.includes('in_progress') || status.includes('đang') || status === 'processing') {
            return 'in_progress';
        }

        // Completed
        if (status === 'completed' || status === 'complete' || status.includes('complete') || status.includes('hoàn thành') || status === 'finished' || status === 'done') {
            return 'completed';
        }

        // Cancelled
        if (status === 'cancelled' || status === 'canceled' || status.includes('cancel') || status.includes('hủy')) {
            return 'cancelled';
        }

        // Default fallback
        return 'pending';
    };

    // Format date từ API
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${day}/${month}/${year}`;
        } catch (e) {
            return dateString;
        }
    };

    // Format date với time từ API
    const formatDateWithTime = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${hours}:${minutes} ${day}/${month}/${year}`;
        } catch (e) {
            return dateString;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#D97706'; // Vàng - Chờ xử lý
            case 'in_progress':
                return '#0EA5E9'; // Xanh dương - Đang thực hiện
            case 'completed':
                return '#059669'; // Xanh lá - Hoàn thành
            case 'cancelled':
                return '#DC2626'; // Đỏ - Đã hủy
            default:
                return '#6B7280';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return t('task_assigned');
            case 'in_progress':
                return t('task_in_progress');
            case 'completed':
                return t('task_completed');
            case 'cancelled':
                return t('task_cancelled');
            default:
                return status;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high':
                return '#DC2626';
            case 'medium':
                return '#D97706';
            case 'low':
                return '#059669';
            default:
                return '#6B7280';
        }
    };

    const statusFilters = [
        { key: 'pending', label: t('task_assigned'), color: '#D97706' },
        { key: 'in_progress', label: t('task_in_progress'), color: '#0EA5E9' },
        { key: 'completed', label: t('task_completed'), color: '#059669' },
        { key: 'cancelled', label: t('task_cancelled'), color: '#DC2626' },
    ];

    const filteredTasks = tasks.filter(task => task.status === selectedStatus);

    const renderTaskCard = ({ item }) => (
        <TouchableOpacity
            style={styles.taskCard}
            activeOpacity={0.7}
        >
            {/* Campaign Name - Title lớn */}
            {item.campaignName && (
                <Text style={styles.campaignTitle}>{item.campaignName}</Text>
            )}

            {/* Campaign Description - Subtitle */}
            {item.campaignDescription && (
                <Text style={styles.campaignDescription}>{item.campaignDescription}</Text>
            )}

            {/* Task Details */}
            <View style={styles.taskDetails}>
                {/* Công việc */}
                {item.title && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('task_label_title')}</Text>
                        <Text style={styles.detailValue}>{item.title}</Text>
                    </View>
                )}

                {/* Mô tả công việc */}
                {item.description && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('task_label_description')}</Text>
                        <Text style={styles.detailValue}>{item.description}</Text>
                    </View>
                )}

                {/* Giao bởi */}
                {item.assignedBy && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('task_label_assigned_by')}</Text>
                        <Text style={styles.detailValue}>{item.assignedBy}</Text>
                    </View>
                )}

                {/* Trạng thái */}
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('task_label_status')}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusBadgeText}>{getStatusText(item.status)}</Text>
                    </View>
                </View>

                {/* Ngày bắt đầu */}
                {item.startDate && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('task_label_start_date')}</Text>
                        <Text style={styles.detailValue}>{item.startDate}</Text>
                    </View>
                )}

                {/* Ngày giao */}
                {item.assignedAt && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('task_label_assigned_at')}</Text>
                        <Text style={styles.detailValue}>{item.assignedAt}</Text>
                    </View>
                )}

                {/* Ngày kết thúc */}
                {item.endDate && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('task_label_end_date')}</Text>
                        <Text style={styles.detailValue}>{item.endDate}</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Task List với Filter */}
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
                        <Text style={styles.loadingText}>{t('task_loading')}</Text>
                    </View>
                )}

                {/* Error State */}
                {!loading && error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={fetchTasks}
                        >
                            <Text style={styles.retryButtonText}>{t('task_retry')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Empty State */}
                {!loading && !error && filteredTasks.length === 0 && (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>{t('task_empty')}</Text>
                    </View>
                )}

                {/* Task List */}
                {!loading && !error && filteredTasks.length > 0 && (
                    <FlatList
                        data={filteredTasks}
                        renderItem={renderTaskCard}
                        keyExtractor={(item, index) => (item.id ? item.id.toString() : `task-${index}`)}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        refreshing={refreshing}
                        onRefresh={() => fetchTasks(true)}
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
    taskCard: {
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
    campaignTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: AIR_DARK,
        marginBottom: 8,
        lineHeight: 28,
    },
    campaignDescription: {
        fontSize: 15,
        color: '#6B7280',
        marginBottom: 20,
        lineHeight: 22,
    },
    taskDetails: {
        gap: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
        flexWrap: 'wrap',
    },
    detailLabel: {
        fontSize: 15,
        color: '#6B7280',
        fontWeight: '600',
        marginRight: 8,
    },
    detailValue: {
        fontSize: 15,
        color: AIR_DARK,
        fontWeight: '700',
        flex: 1,
        textAlign: 'right',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        alignSelf: 'flex-end',
    },
    statusBadgeText: {
        color: 'white',
        fontSize: 13,
        fontWeight: '700',
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

