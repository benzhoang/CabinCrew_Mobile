import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import FeedbackModal from '../components/FeedbackModal';
import { getScoringCriterias, submitAppearanceResult } from '../service/api';
import { useTranslation } from '../i18n';

export default function ScoringScreen({ candidateData, onBackPress, onScoreSubmit }) {
    const { t } = useTranslation();
    // selectedCriteria: key -> 'pass' | 'fail'
    const [selectedCriteria, setSelectedCriteria] = useState({});
    // Bỏ trạng thái mở rộng: luôn hiển thị nút hành động
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [scoringCriteria, setScoringCriteria] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // Debug info
    useEffect(() => {
        console.log('[ScoringScreen] candidateData', candidateData);
    }, [candidateData]);

    // Fetch scoring criteria từ API
    useEffect(() => {
        fetchScoringCriterias();
    }, []);

    const fetchScoringCriterias = async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getScoringCriterias();
            console.log('[ScoringScreen] getScoringCriterias result', result);

            if (result.success && result.data) {
                // Map data từ API sang format mà component đang sử dụng
                const mappedCriteria = {};

                result.data.forEach((category, index) => {
                    // Tạo key cho category (có thể dùng index hoặc tạo từ title)
                    const categoryKey = `category_${index}`;

                    mappedCriteria[categoryKey] = {
                        title: category.title || '',
                        items: (category.items || []).map(item => ({
                            id: item.scoringCriteriaItemId?.toString() || '',
                            text: item.text || '',
                            english: item.englishText || '',
                            details: (item.details || []).map(detail => detail.detailText || '')
                        }))
                    };
                });

                setScoringCriteria(mappedCriteria);
            } else {
                setError(result.error || t('scoring_error'));
                Alert.alert(t('scoring_error_title'), result.error || t('scoring_error'));
            }
        } catch (err) {
            const errorMessage = err.message || t('scoring_error_general');
            console.log('[ScoringScreen] getScoringCriterias error', err);
            setError(errorMessage);
            Alert.alert(t('scoring_error_title'), errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const keyOf = (category, criterionId) => `${category}_${criterionId}`;

    // Không cần toggle mở rộng nữa

    const setCriterionStatus = (category, criterionId, status) => {
        const key = keyOf(category, criterionId);
        setSelectedCriteria(prev => ({
            ...prev,
            [key]: status
        }));
    };

    const isCriterionSelected = (category, criterionId) => {
        const key = keyOf(category, criterionId);
        return selectedCriteria[key] === 'pass' || selectedCriteria[key] === 'fail';
    };

    const getCriterionStatus = (category, criterionId) => {
        const key = keyOf(category, criterionId);
        return selectedCriteria[key];
    };

    // Không dùng expanded nữa

    const getTotalSelectedCriteria = () => {
        return Object.values(selectedCriteria).filter(v => v === 'pass' || v === 'fail').length;
    };

    const getTotalCriteria = () => {
        let total = 0;
        Object.values(scoringCriteria).forEach(category => {
            if (category && category.items) {
                total += category.items.length;
            }
        });
        return total;
    };

    const buildChoicesPayload = () => {
        const choices = [];
        Object.entries(scoringCriteria).forEach(([categoryKey, category]) => {
            if (!category || !Array.isArray(category.items)) {
                return;
            }
            category.items.forEach(item => {
                const status = getCriterionStatus(categoryKey, item.id);
                if (status === 'pass' || status === 'fail') {
                    const parsedId = Number(item.id);
                    choices.push({
                        scoringCriteriaItemId: Number.isNaN(parsedId) ? item.id : parsedId,
                        isPassed: status === 'pass',
                    });
                }
            });
        });
        return choices;
    };

    const canSubmit = () => {
        return !submitting && getTotalSelectedCriteria() === getTotalCriteria();
    };

    const handleSubmitResult = () => {
        if (!canSubmit()) {
            Alert.alert(t('scoring_info_title'), t('scoring_submit_message'));
            return;
        }
        setShowFeedbackModal(true);
    };

    const handleConfirmSubmit = async (text) => {
        const comment = text || '';
        setFeedbackText(comment);
        setShowFeedbackModal(false);

        const activityIdRaw = candidateData?.activityId;
        const activityIdNumber = Number(activityIdRaw);
        const activityId = Number.isNaN(activityIdNumber) ? activityIdRaw : activityIdNumber;

        if (!activityId) {
            console.log('[ScoringScreen] Missing activityId', candidateData);
            Alert.alert(t('scoring_error_title'), t('scoring_error_activity_id'));
            return;
        }

        const choices = buildChoicesPayload();
        if (!choices.length) {
            console.log('[ScoringScreen] No choices payload', scoringCriteria);
            Alert.alert(t('scoring_error_title'), t('scoring_error_no_data'));
            return;
        }

        try {
            setSubmitting(true);
            console.log('[ScoringScreen] submitAppearanceResult payload', {
                activityId,
                comment,
                choicesCount: choices.length,
            });
            const result = await submitAppearanceResult({
                activityId,
                comment,
                choices,
            });
            console.log('[ScoringScreen] submitAppearanceResult response', result);

            if (result.success) {
                onScoreSubmit?.(candidateData, 'submitted', selectedCriteria, comment);
            } else {
                Alert.alert(t('scoring_error_title'), result.error || t('scoring_error_submit'));
            }
        } catch (err) {
            const errorMessage = err.message || t('scoring_error_submit');
            console.log('[ScoringScreen] submitAppearanceResult error', err);
            Alert.alert(t('scoring_error_title'), errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const renderCriterionItem = (category, item) => {
        const status = getCriterionStatus(category, item.id);
        const selected = isCriterionSelected(category, item.id);
        return (
            <View
                key={item.id}
                style={[
                    styles.criterionItem,
                    selected && styles.selectedCriterionItem,
                    status === 'pass' && styles.passedCriterionItem,
                    status === 'fail' && styles.failedCriterionItem
                ]}
            >
                <View style={styles.criterionContent}>
                    <View style={styles.checkboxContainer}>
                        <View style={[
                            styles.checkbox,
                            status === 'pass' && styles.checkedCheckboxPass,
                            status === 'fail' && styles.checkedCheckboxFail
                        ]}>
                            {status === 'pass' && (
                                <Text style={styles.checkmark}>✓</Text>
                            )}
                            {status === 'fail' && (
                                <Text style={styles.crossmark}>✕</Text>
                            )}
                        </View>
                    </View>
                    <View style={styles.criterionTextContainer}>
                        <Text style={[
                            styles.criterionText,
                            selected && styles.selectedCriterionText
                        ]}>
                            {item.text}
                        </Text>
                        <Text style={styles.criterionEnglish}>
                            {item.english}
                        </Text>
                        {item.details && item.details.length > 0 && (
                            <View style={styles.detailsList}>
                                {item.details.map((d, idx) => (
                                    <Text key={idx} style={styles.detailItem}>• {d}</Text>
                                ))}
                            </View>
                        )}

                        <View style={styles.criterionActions}>
                            <TouchableOpacity
                                style={[
                                    styles.statusButton,
                                    styles.passButton,
                                    status === 'pass' && styles.activePassButton
                                ]}
                                onPress={() => setCriterionStatus(category, item.id, 'pass')}
                            >
                                <Text style={[
                                    styles.statusButtonText,
                                    styles.passButtonText,
                                    status === 'pass' && styles.activePassButtonText
                                ]}>{t('scoring_pass')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[
                                    styles.statusButton,
                                    styles.failButton,
                                    status === 'fail' && styles.activeFailButton
                                ]}
                                onPress={() => setCriterionStatus(category, item.id, 'fail')}
                            >
                                <Text style={[
                                    styles.statusButtonText,
                                    styles.failButtonText,
                                    status === 'fail' && styles.activeFailButtonText
                                ]}>{t('scoring_fail')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderCategory = (categoryKey, category) => {
        if (!category || !category.items || category.items.length === 0) {
            return null;
        }
        return (
            <View key={categoryKey} style={styles.categoryContainer}>
                <Text style={styles.categoryTitle}>{category.title}</Text>
                {category.items.map(item => renderCriterionItem(categoryKey, item))}
            </View>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                        <View style={styles.userTextContainer}>
                            <Text style={styles.headerTitle}>{t('scoring_title')}</Text>
                            <Text style={styles.userName}>{candidateData?.name || t('scoring_candidate')}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={AIR_BLUE} />
                    <Text style={styles.loadingText}>{t('scoring_loading')}</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.userInfo}>
                        <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                        <View style={styles.userTextContainer}>
                            <Text style={styles.headerTitle}>{t('scoring_title')}</Text>
                            <Text style={styles.userName}>{candidateData?.name || t('scoring_candidate')}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={fetchScoringCriterias}
                    >
                        <Text style={styles.retryButtonText}>{t('scoring_retry')}</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.userTextContainer}>
                        <Text style={styles.headerTitle}>{t('scoring_title')}</Text>
                        <Text style={styles.userName}>{candidateData?.name || t('scoring_candidate')}</Text>
                    </View>
                </View>
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                    {t('scoring_selected')} {getTotalSelectedCriteria()}/{getTotalCriteria()} {t('scoring_criteria')}
                </Text>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: getTotalCriteria() > 0 ? `${(getTotalSelectedCriteria() / getTotalCriteria()) * 100}%` : '0%' }
                        ]}
                    />
                </View>
            </View>

            {/* Scoring Criteria */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {Object.entries(scoringCriteria)
                    .filter(([_, category]) => category && category.items && category.items.length > 0)
                    .map(([categoryKey, category]) =>
                        renderCategory(categoryKey, category)
                    )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.actionContainer}>
                <TouchableOpacity
                    style={[
                        styles.actionButton,
                        styles.submitButton,
                        !canSubmit() && styles.disabledButton
                    ]}
                    onPress={handleSubmitResult}
                    disabled={!canSubmit()}
                >
                    <Text style={[
                        styles.actionButtonText,
                        styles.submitButtonText,
                        !canSubmit() && styles.disabledButtonText
                    ]}>
                        {submitting ? t('scoring_submitting') : t('scoring_submit')}
                    </Text>
                </TouchableOpacity>
            </View>

            <FeedbackModal
                visible={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
                onSubmit={handleConfirmSubmit}
                initialText={feedbackText}
            />
        </SafeAreaView>
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
    progressContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#F8FAFC',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    progressText: {
        fontSize: 14,
        color: AIR_DARK,
        fontWeight: '600',
        marginBottom: 8,
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
    content: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    categoryContainer: {
        margin: 20,
        marginBottom: 0,
    },
    categoryTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: AIR_DARK,
        marginBottom: 16,
        paddingBottom: 8,
        borderBottomWidth: 2,
        borderBottomColor: AIR_BLUE,
    },
    criterionItem: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    selectedCriterionItem: {
        borderColor: AIR_BLUE,
        backgroundColor: '#F0F9FF',
        shadowColor: AIR_BLUE,
        shadowOpacity: 0.1,
    },
    passedCriterionItem: {
        borderColor: AIR_GREEN,
        backgroundColor: '#ECFDF5',
        shadowColor: AIR_GREEN,
        shadowOpacity: 0.08,
    },
    failedCriterionItem: {
        borderColor: AIR_RED,
        backgroundColor: '#FEF2F2',
        shadowColor: AIR_RED,
        shadowOpacity: 0.08,
    },
    criterionContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    checkboxContainer: {
        marginRight: 12,
        marginTop: 2,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkedCheckbox: {
        backgroundColor: AIR_BLUE,
        borderColor: AIR_BLUE,
    },
    checkedCheckboxPass: {
        backgroundColor: AIR_GREEN,
        borderColor: AIR_GREEN,
    },
    checkedCheckboxFail: {
        backgroundColor: AIR_RED,
        borderColor: AIR_RED,
    },
    checkmark: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    crossmark: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    criterionTextContainer: {
        flex: 1,
    },
    criterionText: {
        fontSize: 14,
        color: AIR_DARK,
        fontWeight: '500',
        lineHeight: 20,
        marginBottom: 4,
    },
    selectedCriterionText: {
        color: AIR_DARK,
        fontWeight: '600',
    },
    criterionEnglish: {
        fontSize: 12,
        color: '#6B7280',
        fontStyle: 'italic',
        lineHeight: 16,
    },
    detailsList: {
        marginTop: 8,
        marginBottom: 8,
        gap: 4,
    },
    detailItem: {
        fontSize: 12,
        color: '#4B5563',
        lineHeight: 16,
    },
    criterionActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 12,
    },
    statusButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 10,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
    passButton: {
        borderColor: AIR_GREEN,
        backgroundColor: 'white',
    },
    failButton: {
        borderColor: AIR_RED,
        backgroundColor: 'white',
    },
    passButtonText: {
        color: AIR_GREEN,
    },
    failButtonText: {
        color: AIR_RED,
    },
    activePassButton: {
        backgroundColor: AIR_GREEN,
    },
    activeFailButton: {
        backgroundColor: AIR_RED,
    },
    activePassButtonText: {
        color: 'white',
    },
    activeFailButtonText: {
        color: 'white',
    },
    actionContainer: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
    },
    actionButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitButton: {
        backgroundColor: AIR_BLUE,
    },
    disabledButton: {
        backgroundColor: '#D1D5DB',
    },
    actionButtonText: {
        fontSize: 16,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    submitButtonText: {
        color: 'white',
    },
    disabledButtonText: {
        color: '#9CA3AF',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: AIR_DARK,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 14,
        color: AIR_RED,
        textAlign: 'center',
        marginBottom: 20,
    },
    retryButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        backgroundColor: AIR_BLUE,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '700',
    },
});
