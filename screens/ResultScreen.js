import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useTranslation } from '../i18n';
import { getAppearanceResult, getScoringCriterias } from '../service/api';

export default function ResultScreen({ route, navigation }) {
    const { t } = useTranslation();
    const { candidateData } = route?.params || {};
    const activityId = candidateData?.activityId;

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);
    const [scoringCriterias, setScoringCriterias] = useState([]);

    useEffect(() => {
        if (activityId) {
            fetchResult();
        } else {
            setError(t('No activity ID found') || 'Không tìm thấy Activity ID');
            setLoading(false);
        }
    }, [activityId]);

    const fetchResult = async () => {
        try {
            setLoading(true);
            setError(null);

            const [resultResponse, criteriaResponse] = await Promise.all([
                getAppearanceResult(activityId),
                getScoringCriterias(),
            ]);

            if (criteriaResponse.success && Array.isArray(criteriaResponse.data)) {
                setScoringCriterias(criteriaResponse.data);
            }

            if (resultResponse.success) {
                setResult(resultResponse.data);
            } else {
                setError(resultResponse.error || t('Cannot load result') || 'Không thể tải kết quả');
            }
        } catch (err) {
            console.error('ResultScreen - Error fetching result:', err);
            setError(t('Error loading result') || 'Lỗi khi tải kết quả');
        } finally {
            setLoading(false);
        }
    };

    // Map scoringCriteriaItemId -> thông tin tiêu chí
    const getCriteriaInfo = (scoringCriteriaItemId) => {
        if (!scoringCriterias || !Array.isArray(scoringCriterias)) return null;

        for (const category of scoringCriterias) {
            if (Array.isArray(category.items)) {
                for (const item of category.items) {
                    if (item.scoringCriteriaItemId === scoringCriteriaItemId) {
                        return {
                            name: item.text || item.englishText || '',
                            englishText: item.englishText || '',
                            details: Array.isArray(item.details) ? item.details : [],
                            title: category.title || '',
                        };
                    }
                }
            }
        }
        return null;
    };

    // Format date
    const formatDateTime = (dateString) => {
        if (!dateString) return '—';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${day}/${month}/${year} ${hours}:${minutes}`;
        } catch (e) {
            return dateString;
        }
    };

    const getPassLabel = (isPassed) => {
        if (isPassed === true) return t('Passed') || 'Passed';
        if (isPassed === false) return t('Failed') || 'Failed';
        return '—';
    };

    const getPassColor = (isPassed) => {
        if (isPassed === true) return AIR_GREEN;
        if (isPassed === false) return AIR_RED;
        return '#6B7280';
    };

    const handleBackPress = () => {
        if (navigation?.goBack) {
            navigation.goBack();
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('View Result') || 'View Result'}</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={AIR_BLUE} />
                    <Text style={styles.loadingText}>{t('Loading result') || 'Đang tải kết quả...'}</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('View Result') || 'View Result'}</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={fetchResult}>
                        <Text style={styles.retryButtonText}>{t('Retry') || 'Thử lại'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    if (!result) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>{t('View Result') || 'View Result'}</Text>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{t('No result found') || 'Không tìm thấy kết quả'}</Text>
                </View>
            </View>
        );
    }

    const appearanceResults = result.appearanceResults || [];
    const overallResult = result.isPassed;

    // Nhóm criteria theo title
    const groupedCriteria = {};
    appearanceResults.forEach((criteria, index) => {
        const criteriaInfo = getCriteriaInfo(criteria.scoringCriteriaItemId);
        const title = criteriaInfo?.title || 'Others';
        if (!groupedCriteria[title]) {
            groupedCriteria[title] = [];
        }
        groupedCriteria[title].push({ ...criteria, criteriaInfo, originalIndex: index });
    });

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('View Result') || 'View Result'}</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Summary Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('Evaluation Information') || 'Evaluation Information'}</Text>
                    <View style={styles.summaryGrid}>
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>{t('Candidate') || 'Candidate'}</Text>
                                <Text style={styles.summaryValue}>{result.candidate || '—'}</Text>
                            </View>
                        </View>
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>{t('Examiner') || 'Examiner'}</Text>
                                <Text style={styles.summaryValue}>{result.examiner || '—'}</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>{t('Round') || 'Round'}</Text>
                                <Text style={styles.summaryValue}>{result.roundName || '—'}</Text>
                            </View>
                        </View>
                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>{t('Benchmark') || 'Benchmark'}</Text>
                                <Text style={styles.summaryValue}>
                                    {result.benchmark !== null && result.benchmark !== undefined
                                        ? `${result.benchmark}`
                                        : '—'}
                                </Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>{t('Evaluation Date') || 'Evaluation Date'}</Text>
                                <Text style={styles.summaryValue}>{formatDateTime(result.evaluatedDate)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Overall Result */}
                    <View style={styles.overallResultContainer}>
                        <Text style={styles.overallResultLabel}>{t('Overall Result') || 'Overall Result'}</Text>
                        <View style={[styles.overallResultBadge, { backgroundColor: getPassColor(overallResult) }]}>
                            <Text style={styles.overallResultText}>{getPassLabel(overallResult)}</Text>
                        </View>
                    </View>
                </View>

                {/* Comment Section */}
                {result.comment && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('General Comments') || 'Nhận xét chung'}</Text>
                        <View style={styles.commentContainer}>
                            <Text style={styles.commentText}>{result.comment}</Text>
                        </View>
                    </View>
                )}

                {/* Criteria Results Section */}
                {appearanceResults.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('Criteria Details') || 'Criteria Details'}</Text>
                        {Object.entries(groupedCriteria).map(([title, criteriaGroup]) => (
                            <View key={title} style={styles.criteriaGroup}>
                                {title && title !== 'Others' && (
                                    <Text style={styles.criteriaGroupTitle}>{title}</Text>
                                )}
                                {criteriaGroup.map((criteria) => {
                                    const criteriaInfo = criteria.criteriaInfo;
                                    // Ưu tiên hiển thị tiếng Anh
                                    const criteriaName = criteriaInfo?.englishText || criteriaInfo?.name || `Criteria ${criteria.originalIndex + 1}`;
                                    const isPassed = criteria.isPassed;

                                    return (
                                        <View key={criteria.scoringCriteriaItemId || criteria.originalIndex} style={styles.criteriaCard}>
                                            <View style={styles.criteriaHeader}>
                                                <Text style={styles.criteriaName}>{criteriaName}</Text>
                                                <View style={[styles.criteriaBadge, { backgroundColor: getPassColor(isPassed) }]}>
                                                    <Text style={styles.criteriaBadgeText}>{getPassLabel(isPassed)}</Text>
                                                </View>
                                            </View>
                                            {criteriaInfo?.details && criteriaInfo.details.length > 0 && (
                                                <View style={styles.criteriaDetails}>
                                                    {criteriaInfo.details.map((detail, detailIndex) => {
                                                        // Ưu tiên hiển thị detailText tiếng Anh nếu có
                                                        const detailText = detail.detailTextEn || detail.englishText || detail.detailText || detail.text || detail.description || detail;
                                                        return (
                                                            <View key={detailIndex} style={styles.detailItem}>
                                                                <Text style={styles.detailBullet}>•</Text>
                                                                <Text style={styles.detailText}>{detailText}</Text>
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const AIR_BLUE = '#0EA5E9';
const AIR_DARK = '#0B3757';
const AIR_RED = '#DC2626';
const AIR_GREEN = '#059669';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AIR_DARK,
    },
    content: {
        flex: 1,
        backgroundColor: '#F8FAFC',
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
    section: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: AIR_DARK,
        marginBottom: 20,
    },
    summaryGrid: {
        gap: 0,
    },
    summaryRow: {
        flexDirection: 'row',
        gap: 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    summaryItem: {
        flex: 1,
    },
    summaryLabel: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 6,
    },
    summaryValue: {
        fontSize: 16,
        color: AIR_DARK,
        fontWeight: '700',
    },
    overallResultContainer: {
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        alignItems: 'center',
    },
    overallResultLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        marginBottom: 12,
    },
    overallResultBadge: {
        paddingHorizontal: 32,
        paddingVertical: 14,
        borderRadius: 12,
        minWidth: 120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overallResultText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    commentContainer: {
        backgroundColor: '#F8FAFC',
        padding: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    commentText: {
        fontSize: 14,
        color: AIR_DARK,
        lineHeight: 20,
    },
    criteriaGroup: {
        marginBottom: 24,
    },
    criteriaGroupTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AIR_DARK,
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: AIR_BLUE,
    },
    criteriaCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    criteriaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    criteriaName: {
        fontSize: 16,
        fontWeight: '700',
        color: AIR_DARK,
        flex: 1,
        marginRight: 12,
    },
    criteriaBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    criteriaBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    criteriaDetails: {
        marginTop: 8,
        paddingLeft: 8,
    },
    detailItem: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    detailBullet: {
        fontSize: 14,
        color: '#6B7280',
        marginRight: 8,
    },
    detailText: {
        fontSize: 13,
        color: '#6B7280',
        flex: 1,
        lineHeight: 18,
    },
});

