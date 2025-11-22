import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
} from 'react-native';
import { useTranslation } from '../i18n';
import { getCampaignDetail } from '../service/api';

export default function BatchScreen({ campaignData, onBackPress, navigation }) {
    const { t, lang } = useTranslation();
    const [campaignDetail, setCampaignDetail] = useState(null);
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('BatchScreen - Component mounted/updated');
        console.log('BatchScreen - campaignData received:', JSON.stringify(campaignData, null, 2));
        if (campaignData) {
            fetchCampaignDetail();
        } else {
            console.warn('BatchScreen - No campaignData provided');
        }
    }, [campaignData]);

    const fetchCampaignDetail = async () => {
        try {
            console.log('BatchScreen - fetchCampaignDetail called');
            setLoading(true);
            setError(null);

            // Lấy campaignId từ nhiều nguồn có thể - ưu tiên campaignId vì đó là field chính trong API
            const campaignId = campaignData?.campaignId || campaignData?.id || campaignData?.campaign?.campaignId || campaignData?.campaign?.id;

            console.log('BatchScreen - Extracted campaignId:', campaignId);
            console.log('BatchScreen - campaignData structure:', {
                campaignId: campaignData?.campaignId,
                id: campaignData?.id,
                campaign: campaignData?.campaign
            });

            if (!campaignId) {
                console.error('BatchScreen - No campaignId found in campaignData');
                setError('Không tìm thấy ID chiến dịch');
                setLoading(false);
                return;
            }

            console.log('BatchScreen - Calling API getCampaignDetail with campaignId:', campaignId);
            const result = await getCampaignDetail(campaignId);
            console.log('BatchScreen - API response:', JSON.stringify(result, null, 2));

            // Kiểm tra result.success trước
            if (!result.success) {
                console.error('BatchScreen - API call failed:', result.error);
                setError(result.error || 'Không thể tải thông tin chiến dịch');
                return;
            }

            // Kiểm tra result.data
            if (!result.data) {
                console.error('BatchScreen - API call successful but no data received');
                setError('Không nhận được dữ liệu từ server');
                return;
            }

            console.log('BatchScreen - API call successful');
            console.log('BatchScreen - Campaign detail data:', JSON.stringify(result.data, null, 2));
            setCampaignDetail(result.data);

            // Map rounds từ API về format batches
            const rounds = result.data.rounds;
            console.log('BatchScreen - Rounds check:', {
                exists: !!rounds,
                isArray: Array.isArray(rounds),
                length: rounds?.length
            });

            if (rounds && Array.isArray(rounds) && rounds.length > 0) {
                console.log('BatchScreen - Found rounds:', rounds.length);
                console.log('BatchScreen - Rounds data:', JSON.stringify(rounds, null, 2));

                const mappedBatches = rounds.map((round, index) => {
                    const mapped = {
                        id: round.campaignRoundId || round.id || index + 1,
                        name: round.roundName || round.name || `Đợt ${index + 1}`,
                        status: mapStatusFromAPI(round.status),
                        startDate: formatDate(round.startDate),
                        endDate: formatDate(round.endDate),
                        location: round.location || '', // API không có location
                        format: round.format || '', // API không có format
                        manager: round.manager || '', // API không có manager
                        targetHires: round.targetQuantity || round.targetHires || 0,
                        currentHires: round.actualQuantiy || round.actualQuantity || round.currentHires || 0,
                        progress: getProgressPercentage(
                            round.actualQuantiy || round.actualQuantity || round.currentHires || 0,
                            round.targetQuantity || round.targetHires || 0
                        ),
                        notes: round.description || round.notes || '',
                    };
                    console.log(`BatchScreen - Mapped round ${index + 1}:`, JSON.stringify(mapped, null, 2));
                    return mapped;
                });

                console.log('BatchScreen - Total mapped batches:', mappedBatches.length);
                setBatches(mappedBatches);
            } else {
                console.warn('BatchScreen - No rounds found or rounds is empty');
                console.log('BatchScreen - rounds value:', rounds);
                console.log('BatchScreen - rounds type:', typeof rounds);
                setBatches([]);
            }
        } catch (err) {
            console.error('BatchScreen - Exception in fetchCampaignDetail:', err);
            setError('Đã xảy ra lỗi khi tải dữ liệu');
        } finally {
            console.log('BatchScreen - fetchCampaignDetail completed, loading set to false');
            setLoading(false);
        }
    };

    // Map status từ API về format hiển thị
    const mapStatusFromAPI = (apiStatus) => {
        if (!apiStatus) return 'Sắp diễn ra';
        const status = apiStatus.toLowerCase();
        if (status.includes('ongoing') || status.includes('đang')) {
            return 'Đang diễn ra';
        }
        if (status.includes('finished') || status.includes('completed') || status.includes('hoàn thành')) {
            return 'Hoàn thành';
        }
        if (status.includes('paused') || status.includes('tạm dừng')) {
            return 'Tạm dừng';
        }
        return 'Sắp diễn ra';
    };

    // Format date từ API (dd/MM/yyyy HH:mm -> dd/MM/yyyy)
    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            // Nếu dateString có format "dd/MM/yyyy HH:mm", chỉ lấy phần date
            if (dateString.includes(' ')) {
                return dateString.split(' ')[0];
            }
            return dateString;
        } catch (e) {
            return dateString;
        }
    };


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
        const currentNum = Number(current) || 0;
        const targetNum = Number(target) || 0;

        if (targetNum === 0 || isNaN(targetNum) || isNaN(currentNum)) {
            return 0;
        }

        const percentage = Math.round((currentNum / targetNum) * 100);
        return isNaN(percentage) ? 0 : Math.max(0, Math.min(100, percentage));
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
                    <Text style={styles.detailValue}>{item.startDate || 'N/A'}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Thời gian kết thúc:</Text>
                    <Text style={styles.detailValue}>{item.endDate || 'N/A'}</Text>
                </View>
                {item.location && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Địa điểm:</Text>
                        <Text style={styles.detailValue}>{item.location}</Text>
                    </View>
                )}
                {item.format && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Hình thức:</Text>
                        <Text style={styles.detailValue}>{item.format}</Text>
                    </View>
                )}
                {item.manager && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Phụ trách:</Text>
                        <Text style={styles.detailValue}>{item.manager}</Text>
                    </View>
                )}
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Chỉ tiêu:</Text>
                    <Text style={styles.detailValue}>{item.currentHires}/{item.targetHires}</Text>
                </View>
                {item.notes && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Ghi chú:</Text>
                        <Text style={styles.detailValue}>{item.notes}</Text>
                    </View>
                )}
            </View>

            <View style={styles.batchProgressSection}>
                <Text style={styles.batchProgressTitle}>Tiến độ tuyển dụng</Text>
                <View style={styles.batchProgressContainer}>
                    <View style={styles.batchProgressBar}>
                        <View
                            style={[
                                styles.batchProgressFill,
                                { width: `${getProgressPercentage(item.currentHires, item.targetHires)}%` }
                            ]}
                        />
                    </View>
                    <Text style={styles.batchProgressText}>{getProgressPercentage(item.currentHires, item.targetHires)}%</Text>
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
                        <Text style={styles.userName}>
                            {campaignDetail?.campaignName || campaignData?.name || 'Chiến dịch'}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Batch List */}
            <View style={styles.content}>
                {/* Loading State */}
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={AIR_BLUE} />
                        <Text style={styles.loadingText}>Đang tải thông tin đợt tuyển dụng...</Text>
                    </View>
                )}

                {/* Error State */}
                {!loading && error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={fetchCampaignDetail}
                        >
                            <Text style={styles.retryButtonText}>Thử lại</Text>
                        </TouchableOpacity>
                    </View>
                )}


                {/* Campaign Detail Info & Batch List */}
                {!loading && !error && (
                    <FlatList
                        data={batches}
                        renderItem={renderBatchCard}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        ListHeaderComponent={
                            campaignDetail ? (
                                <View style={styles.campaignInfoCard}>
                                    <Text style={styles.campaignInfoTitle}>Thông tin chiến dịch</Text>

                                    <View style={styles.campaignInfoSection}>
                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Tên chiến dịch:</Text>
                                            <Text style={styles.detailValue} numberOfLines={2} ellipsizeMode="tail">
                                                {campaignDetail.campaignName || 'N/A'}
                                            </Text>
                                        </View>

                                        {campaignDetail.description && (
                                            <View style={styles.detailRowLong}>
                                                <Text style={styles.detailLabel}>Mô tả:</Text>
                                                <Text style={styles.detailValueLong} numberOfLines={3} ellipsizeMode="tail">
                                                    {campaignDetail.description}
                                                </Text>
                                            </View>
                                        )}

                                        {campaignDetail.jobDescription && (
                                            <View style={styles.detailRowLong}>
                                                <Text style={styles.detailLabel}>Mô tả công việc:</Text>
                                                <Text style={styles.detailValueLong} numberOfLines={3} ellipsizeMode="tail">
                                                    {campaignDetail.jobDescription}
                                                </Text>
                                            </View>
                                        )}

                                        {campaignDetail.jobRequirement && (
                                            <View style={styles.detailRowLong}>
                                                <Text style={styles.detailLabel}>Yêu cầu công việc:</Text>
                                                <Text style={styles.detailValueLong} numberOfLines={3} ellipsizeMode="tail">
                                                    {campaignDetail.jobRequirement}
                                                </Text>
                                            </View>
                                        )}

                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Chỉ tiêu:</Text>
                                            <Text style={styles.detailValue}>{campaignDetail.targetQuantity || 0}</Text>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Loại chiến dịch:</Text>
                                            <Text style={styles.detailValue}>{campaignDetail.campaignType || 'N/A'}</Text>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Trạng thái:</Text>
                                            <Text style={[styles.detailValue, { color: getStatusColor(mapStatusFromAPI(campaignDetail.status)) }]}>
                                                {mapStatusFromAPI(campaignDetail.status)}
                                            </Text>
                                        </View>

                                        {campaignDetail.partnerName && (
                                            <View style={styles.detailRow}>
                                                <Text style={styles.detailLabel}>Đối tác:</Text>
                                                <Text style={styles.detailValue}>{campaignDetail.partnerName}</Text>
                                            </View>
                                        )}

                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Ngày bắt đầu:</Text>
                                            <Text style={styles.detailValue}>{formatDate(campaignDetail.startDate) || 'N/A'}</Text>
                                        </View>

                                        <View style={styles.detailRow}>
                                            <Text style={styles.detailLabel}>Ngày kết thúc:</Text>
                                            <Text style={styles.detailValue}>{formatDate(campaignDetail.endDate) || 'N/A'}</Text>
                                        </View>

                                        {campaignDetail.approvedAt && (
                                            <View style={styles.detailRow}>
                                                <Text style={styles.detailLabel}>Ngày duyệt:</Text>
                                                <Text style={styles.detailValue}>{formatDate(campaignDetail.approvedAt)}</Text>
                                            </View>
                                        )}

                                        {campaignDetail.rejectedAt && (
                                            <View style={styles.detailRow}>
                                                <Text style={styles.detailLabel}>Ngày từ chối:</Text>
                                                <Text style={styles.detailValue}>{formatDate(campaignDetail.rejectedAt)}</Text>
                                            </View>
                                        )}

                                        {campaignDetail.reviewedBy && (
                                            <View style={styles.detailRow}>
                                                <Text style={styles.detailLabel}>Người duyệt:</Text>
                                                <Text style={styles.detailValue}>{campaignDetail.reviewedBy}</Text>
                                            </View>
                                        )}

                                        {campaignDetail.rejectedReason && (
                                            <View style={styles.detailRowLong}>
                                                <Text style={styles.detailLabel}>Lý do từ chối:</Text>
                                                <Text style={styles.detailValueLong} numberOfLines={2} ellipsizeMode="tail">
                                                    {campaignDetail.rejectedReason}
                                                </Text>
                                            </View>
                                        )}

                                        {campaignDetail.rejectedCount !== undefined && campaignDetail.rejectedCount !== null && (
                                            <View style={styles.detailRow}>
                                                <Text style={styles.detailLabel}>Số lần từ chối:</Text>
                                                <Text style={styles.detailValue}>{campaignDetail.rejectedCount}</Text>
                                            </View>
                                        )}

                                        {campaignDetail.createdAt && (
                                            <View style={styles.detailRow}>
                                                <Text style={styles.detailLabel}>Ngày tạo:</Text>
                                                <Text style={styles.detailValue}>{formatDate(campaignDetail.createdAt)}</Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ) : null
                        }
                        ListEmptyComponent={
                            batches.length === 0 && campaignDetail ? (
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>Không có đợt tuyển dụng nào</Text>
                                </View>
                            ) : null
                        }
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
        paddingHorizontal: 20,
        paddingBottom: 20,
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
        minHeight: 24,
    },
    detailLabel: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '600',
        flex: 0,
        marginRight: 8,
    },
    detailValue: {
        fontSize: 13,
        color: AIR_DARK,
        fontWeight: '600',
        flex: 1,
        textAlign: 'right',
        flexWrap: 'wrap',
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
    campaignInfoCard: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        marginBottom: 16,
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    campaignInfoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AIR_DARK,
        marginBottom: 12,
    },
    campaignInfoSection: {
        gap: 10,
    },
    detailRowLong: {
        flexDirection: 'column',
        paddingVertical: 6,
    },
    detailValueLong: {
        fontSize: 14,
        color: AIR_DARK,
        fontWeight: '600',
        marginTop: 4,
        flexShrink: 1,
    },
});