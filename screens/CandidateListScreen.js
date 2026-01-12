import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useTranslation } from '../i18n';
import { getCampaignRoundDetail, getRoundParticipants } from '../service/api';

export default function CandidateListScreen({ batchData, onBackPress, navigation }) {
    const { t, lang } = useTranslation();
    const [campaignRoundId, setCampaignRoundId] = useState(null);
    const [appearanceRound, setAppearanceRound] = useState(null);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch campaign round detail từ API
    useEffect(() => {
        if (batchData) {
            fetchCampaignRoundDetail();
        }
    }, [batchData]);

    const fetchCampaignRoundDetail = async () => {
        try {
            setLoading(true);
            setError(null);

            // Lấy campaignRoundId từ batchData (có thể là campaignRoundId hoặc id)
            const roundId = batchData?.campaignRoundId || batchData?.id;

            if (!roundId) {
                console.error('CandidateListScreen - No campaignRoundId found in batchData');
                setError(t('candidate_error_round_id'));
                setLoading(false);
                return;
            }

            console.log('CandidateListScreen - Fetching campaign round detail with ID:', roundId);

            const result = await getCampaignRoundDetail(roundId);

            if (result.success && result.data) {
                console.log('CandidateListScreen - API response:', JSON.stringify(result.data, null, 2));

                // Lấy campaignRoundId từ response
                const roundDetail = result.data;
                const fetchedCampaignRoundId = roundDetail.campaignRoundId;
                setCampaignRoundId(fetchedCampaignRoundId);

                // Lọc rounds để chỉ lấy round có roundName là "Appearance"
                if (roundDetail.rounds && Array.isArray(roundDetail.rounds)) {
                    const appearanceRoundData = roundDetail.rounds.find(
                        round => round.roundName === 'Appearance'
                    );

                    if (appearanceRoundData) {
                        setAppearanceRound(appearanceRoundData);
                        console.log('CandidateListScreen - Found Appearance round:', appearanceRoundData);
                        // Sau khi tìm thấy Appearance round, gọi API để lấy danh sách participants
                        if (appearanceRoundData.roundId) {
                            fetchParticipants(appearanceRoundData.roundId);
                        } else {
                            console.error('CandidateListScreen - Appearance round has no roundId');
                            setError(t('candidate_error_round_id_missing'));
                            setLoading(false);
                        }
                    } else {
                        console.warn('CandidateListScreen - No Appearance round found in rounds');
                        setError(t('candidate_error_appearance_round'));
                        setLoading(false);
                    }
                } else {
                    console.warn('CandidateListScreen - No rounds array found in response');
                    setError(t('candidate_error_rounds'));
                    setLoading(false);
                }
            } else {
                console.error('CandidateListScreen - API call failed:', result.error);
                setError(result.error || t('candidate_error_round'));
                setLoading(false);
            }
        } catch (err) {
            console.error('CandidateListScreen - Exception in fetchCampaignRoundDetail:', err);
            setError(t('candidate_error_round'));
            setLoading(false);
        }
    };

    // Fetch danh sách participants từ API
    const fetchParticipants = async (roundId) => {
        try {
            console.log('CandidateListScreen - Fetching participants for roundId:', roundId);
            const result = await getRoundParticipants(roundId);

            if (result.success && result.data) {
                console.log('CandidateListScreen - Participants API response:', JSON.stringify(result.data, null, 2));

                // Lấy items từ data (theo format API response)
                const items = result.data.items || [];
                console.log('CandidateListScreen - Found participants:', items.length);

                // Map dữ liệu từ API sang format hiển thị
                const mappedCandidates = items.map((item) => ({
                    id: item.activityId || item.userId || Math.random(),
                    name: item.fullName || 'N/A',
                    email: item.email || 'N/A',
                    phone: item.phoneNumber || 'N/A',
                    photo: item.imgURL || null,
                    status: item.status || 'pending',
                    roundId: item.roundId || null,
                    roundName: item.roundName || 'Appearance',
                    userId: item.userId || null,
                    activityId: item.activityId || null,
                    applicationId: item.applicationId || item.applicationID || item.application?.applicationId || null,
                    hasAppearanceEvaluated: item.hasAppearanceEvaluated ?? false,
                }));

                setCandidates(mappedCandidates);
            } else {
                console.error('CandidateListScreen - Participants API call failed:', result.error);
                setError(result.error || t('candidate_error'));
            }
        } catch (err) {
            console.error('CandidateListScreen - Exception in fetchParticipants:', err);
            setError(t('candidate_error'));
        } finally {
            setLoading(false);
        }
    };

    // Format date từ API (dd/mm/yyyy)
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

    const getStatusColor = (status) => {
        if (!status) return '#6B7280';
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'pending':
                return '#D97706'; // Vàng - Chờ duyệt
            case 'approved':
                return '#059669'; // Xanh lá - Đã duyệt
            case 'rejected':
                return '#DC2626'; // Đỏ - Từ chối
            case 'passed':
                return '#059669'; // Xanh lá - Đã đạt
            case 'ongoing':
                return '#D97706'; // Vàng - Đang diễn ra
            case 'failed':
                return '#DC2626'; // Đỏ - Không đạt
            default:
                return '#6B7280'; // Xám - Mặc định
        }
    };

    const getStatusText = (status) => {
        if (!status) return t('candidate_status_undetermined');
        const statusLower = status.toLowerCase();
        switch (statusLower) {
            case 'pending':
            case 'chờ duyệt':
                return t('candidate_status_pending');
            case 'approved':
            case 'đã duyệt':
                return t('candidate_status_approved');
            case 'rejected':
            case 'từ chối':
                return t('candidate_status_rejected');
            case 'passed':
            case 'đã đạt':
                return t('candidate_status_passed');
            case 'ongoing':
            case 'đang diễn ra':
                return t('candidate_status_ongoing');
            case 'failed':
            case 'không đạt':
                return t('candidate_status_failed');
            default:
                return status;
        }
    };

    const handleCandidatePress = (candidate) => {
        // Không cho vào chấm nếu đã chấm Appearance
        if (candidate?.hasAppearanceEvaluated) {
            Alert.alert(
                t('Already scored'),
                t('The candidate has already been scored')
            );
            return;
        }

        if (navigation) {
            navigation.navigate('ScoringScreen', { candidateData: candidate });
        }
    };

    const handleViewApplicationPress = (candidate) => {
        // Dùng activityId để mở hồ sơ ứng viên
        if (!candidate?.activityId) {
            Alert.alert(
                t('View Application') || 'View Application',
                t('No candidates profile was found.') || 'Missing application'
            );
            return;
        }

        if (navigation?.navigate) {
            navigation.navigate('ApplicationScreen', { candidateData: candidate });
            return;
        }

        Alert.alert(
            t('View Application title') || 'View Application',
            t('View Application message') || 'Đang mở hồ sơ ứng viên.'
        );
    };

    const handleViewResultPress = (candidate) => {
        // Mở màn hình xem kết quả chấm điểm
        if (!candidate?.activityId) {
            Alert.alert(
                t('View Result') || 'View Result',
                t('No result found.') || 'Không tìm thấy kết quả.'
            );
            return;
        }

        if (navigation?.navigate) {
            // Navigate đến ResultScreen để xem kết quả chấm điểm
            navigation.navigate('ResultScreen', {
                candidateData: candidate,
            });
            return;
        }

        Alert.alert(
            t('View Result') || 'View Result',
            t('View Result message') || 'Đang mở kết quả chấm điểm.'
        );
    };

    const renderCandidateCard = ({ item }) => (
        <TouchableOpacity
            style={styles.candidateCard}
            onPress={() => handleCandidatePress(item)}
            activeOpacity={0.7}
        >
            <View style={styles.candidateHeader}>
                <View style={styles.avatarContainer}>
                    {item.photo ? (
                        <Image source={{ uri: item.photo }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>👤</Text>
                        </View>
                    )}
                </View>
                <View style={styles.candidateInfo}>
                    <Text style={styles.candidateName}>{item.name}</Text>
                    <Text style={styles.candidateAge}>Round: {item.roundName || 'Appearance'}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
            </View>

            <View style={styles.candidateDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('candidate_label_phone')}</Text>
                    <Text style={styles.detailValue}>{item.phone}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('candidate_label_email')}</Text>
                    <Text style={styles.detailValue}>{item.email}</Text>
                </View>
                {item.roundName && (
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>{t('candidate_label_round')}</Text>
                        <Text style={[styles.detailValue, styles.currentStageText]}>{item.roundName}</Text>
                    </View>
                )}
            </View>

            {item.status && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.viewButton]}
                        onPress={() => handleViewApplicationPress(item)}
                    >
                        <Text style={styles.viewButtonText} numberOfLines={2}>{t('View Application') || 'View Application'}</Text>
                    </TouchableOpacity>
                    {!item.hasAppearanceEvaluated ? (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.detailButton]}
                            onPress={() => handleCandidatePress(item)}
                        >
                            <Text style={styles.detailButtonText} numberOfLines={2}>{t('Score Appearance') || 'Score Appearance'}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.resultButton]}
                            onPress={() => handleViewResultPress(item)}
                        >
                            <Text style={styles.resultButtonText} numberOfLines={2}>{t('View Result') || 'View Result'}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
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
                        <Text style={styles.headerTitle}>{t('candidate_list_title')}</Text>
                        <Text style={styles.userName}>{batchData?.name || t('candidate_batch_name')}</Text>
                    </View>
                </View>
            </View>

            {/* Candidate List */}
            <View style={styles.content}>
                {/* Loading State */}
                {loading && (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={AIR_BLUE} />
                        <Text style={styles.loadingText}>{t('candidate_loading')}</Text>
                    </View>
                )}

                {/* Error State */}
                {!loading && error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity
                            style={styles.retryButton}
                            onPress={() => {
                                if (batchData) {
                                    fetchCampaignRoundDetail();
                                }
                            }}
                        >
                            <Text style={styles.retryButtonText}>{t('candidate_retry')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Candidate List */}
                {!loading && !error && (
                    <FlatList
                        data={candidates}
                        renderItem={renderCandidateCard}
                        keyExtractor={(item) => (item.id || item.activityId || item.userId || Math.random()).toString()}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContainer}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>{t('candidate_empty')}</Text>
                            </View>
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
    content: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    listContainer: {
        padding: 20,
    },
    candidateCard: {
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
    candidateHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarContainer: {
        marginRight: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    avatarPlaceholder: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#E5E7EB',
    },
    avatarText: {
        fontSize: 24,
        color: '#6B7280',
    },
    candidateInfo: {
        flex: 1,
    },
    candidateName: {
        fontSize: 18,
        fontWeight: '700',
        color: AIR_DARK,
        marginBottom: 4,
    },
    candidateAge: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 2,
    },
    candidatePhysical: {
        fontSize: 14,
        color: '#6B7280',
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
    },
    statusText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    candidateDetails: {
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
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
        flex: 1,
    },
    detailValue: {
        fontSize: 14,
        color: AIR_DARK,
        fontWeight: '700',
        flex: 2,
        textAlign: 'right',
    },
    currentStageText: {
        color: AIR_BLUE,
    },
    notesSection: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    notesLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        marginBottom: 4,
    },
    notesText: {
        fontSize: 14,
        color: AIR_DARK,
        lineHeight: 20,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'stretch',
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        height: 56, // cố định chiều cao 2 nút để chữ nằm cùng một hàng
    },
    viewButton: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    viewButtonText: {
        color: AIR_DARK,
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    detailButton: {
        backgroundColor: AIR_BLUE,
    },
    detailButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
    resultButton: {
        backgroundColor: AIR_GREEN,
    },
    resultButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
    },
});
