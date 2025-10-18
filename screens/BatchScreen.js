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

export default function BatchScreen({ campaignData, onBackPress, navigation }) {
    const { t, lang } = useTranslation();

    // Dữ liệu đợt tuyển dụng cho campaign được chọn
    const batches = campaignData?.batches || [
        {
            id: 1,
            name: 'Đợt 1',
            status: 'Đang diễn ra',
            startDate: '1/10/2024',
            endDate: '15/10/2024',
            location: 'Hà Nội',
            format: 'Trực tiếp',
            manager: 'Nguyễn Thanh Tùng',
            targetHires: 10,
            currentHires: 7,
            progress: 70,
            notes: 'Phỏng vấn vòng 1'
        },
        {
            id: 2,
            name: 'Đợt 2',
            status: 'Sắp diễn ra',
            startDate: '1/11/2024',
            endDate: '15/11/2024',
            location: 'TP.HCM',
            format: 'Trực tiếp',
            manager: 'Trần Bảo Vy',
            targetHires: 10,
            currentHires: 0,
            progress: 0,
            notes: 'Phỏng vấn vòng 2'
        }
    ];


    const getStatusColor = (status) => {
        switch (status) {
            case 'Đang diễn ra':
                return '#059669';
            case 'Sắp diễn ra':
                return '#D97706';
            case 'Hoàn thành':
                return '#3B82F6';
            case 'Tạm dừng':
                return '#DC2626';
            default:
                return '#6B7280';
        }
    };



    const getProgressPercentage = (current, target) => {
        return Math.round((current / target) * 100);
    };

    const handleBatchPress = (batch) => {
        // Có thể thêm navigation đến chi tiết đợt tuyển dụng
        console.log('Navigate to batch detail:', batch);
    };

    const handleCandidateListPress = (batch) => {
        if (navigation) {
            navigation.navigate('CandidateListScreen', { batchData: batch });
        }
    };

    const renderBatchCard = ({ item }) => (
        <TouchableOpacity
            style={styles.batchCard}
            onPress={() => handleBatchPress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.batchHeader}>
                <Text style={styles.batchTitle}>{item.name}</Text>
            </View>

            <View style={[styles.batchStatusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.batchStatusText}>{item.status}</Text>
            </View>

            <View style={styles.batchDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Thời gian bắt đầu:</Text>
                    <Text style={styles.detailValue}>{item.startDate}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Thời gian kết thúc:</Text>
                    <Text style={styles.detailValue}>{item.endDate}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Địa điểm:</Text>
                    <Text style={styles.detailValue}>{item.location}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Hình thức:</Text>
                    <Text style={styles.detailValue}>{item.format}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phụ trách:</Text>
                    <Text style={styles.detailValue}>{item.manager}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Chỉ tiêu:</Text>
                    <Text style={styles.detailValue}>{item.currentHires}/{item.targetHires}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Ghi chú:</Text>
                    <Text style={styles.detailValue}>{item.notes}</Text>
                </View>
            </View>

            <View style={styles.batchProgressSection}>
                <Text style={styles.batchProgressTitle}>Tiến độ tuyển dụng</Text>
                <View style={styles.batchProgressContainer}>
                    <View style={styles.batchProgressBar}>
                        <View
                            style={[
                                styles.batchProgressFill,
                                { width: `${item.progress}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.batchProgressText}>{item.progress}%</Text>
                </View>
            </View>

            <TouchableOpacity
                style={[
                    styles.batchActionButton,
                    item.status === 'Sắp diễn ra' && styles.disabledButton
                ]}
                disabled={item.status === 'Sắp diễn ra'}
                onPress={() => handleCandidateListPress(item)}
            >
                <Text style={[
                    styles.batchActionText,
                    item.status === 'Sắp diễn ra' && styles.disabledText
                ]}>
                    {item.status === 'Sắp diễn ra' ? 'Chưa thể xem danh sách' : 'Xem danh sách ứng viên'}
                </Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.userTextContainer}>
                        <Text style={styles.headerTitle}>Đợt tuyển dụng</Text>
                        <Text style={styles.userName}>{campaignData?.name || 'Chiến dịch'}</Text>
                    </View>
                </View>
            </View>

            {/* Batch List */}
            <View style={styles.content}>
                <FlatList
                    data={batches}
                    renderItem={renderBatchCard}
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
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    backIcon: {
        fontSize: 18,
        color: AIR_DARK,
        fontWeight: 'bold',
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
    content: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    listContainer: {
        padding: 20,
    },
    batchCard: {
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
    batchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    batchTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AIR_DARK,
    },
    batchStatusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginBottom: 16,
    },
    batchStatusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    batchDetails: {
        gap: 8,
        marginBottom: 16,
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
    batchProgressSection: {
        marginBottom: 16,
    },
    batchProgressTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 8,
    },
    batchProgressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    batchProgressBar: {
        flex: 1,
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        marginRight: 12,
    },
    batchProgressFill: {
        height: '100%',
        backgroundColor: AIR_BLUE,
        borderRadius: 3,
    },
    batchProgressText: {
        fontSize: 14,
        fontWeight: '700',
        color: AIR_BLUE,
    },
    batchActionButton: {
        backgroundColor: AIR_BLUE,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        backgroundColor: '#E2E8F0',
    },
    batchActionText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    disabledText: {
        color: '#9CA3AF',
    },
});
