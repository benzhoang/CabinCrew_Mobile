import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import FeedbackModal from '../components/FeedbackModal';

export default function ScoringScreen({ candidateData, onBackPress, onScoreSubmit }) {
    // selectedCriteria: key -> 'pass' | 'fail'
    const [selectedCriteria, setSelectedCriteria] = useState({});
    // Bỏ trạng thái mở rộng: luôn hiển thị nút hành động
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');

    // Các tiêu chí chấm điểm dựa trên hình ảnh
    const scoringCriteria = {
        bodyShape: {
            title: 'Hình thể',
            items: [
                {
                    id: 'bmi',
                    text: 'Cân đối, đảm bảo nằm trong chỉ số BMI quy định',
                    english: 'Well-proportioned, to be qualified within the prescribed BMI',
                    details: [
                        'Chiều cao, cân nặng đạt chuẩn theo bảng BMI của hãng',
                        'Không thiếu cân/quá cân so với ngưỡng quy định',
                        'Vóc dáng cân đối tổng thể'
                    ]
                },
                {
                    id: 'gait',
                    text: 'Dáng đi cân đối, không lệch hay rung lắc',
                    english: 'Well-proportioned gait, no deviation or shaking when walking',
                    details: [
                        'Bước đi thẳng, không khập khiễng',
                        'Không lắc vai/hông quá mức',
                        'Tư thế tự tin, vững vàng'
                    ]
                },
                {
                    id: 'arms',
                    text: 'Cánh tay, bàn tay thẳng, cân đối không bị co rút hay dị dạng',
                    english: 'Arms, hands straight, balanced without shrinkage or deformity',
                    details: [
                        'Cánh tay, bàn tay không dị tật',
                        'Không co rút, không biến dạng',
                        'Cử động linh hoạt'
                    ]
                },
                {
                    id: 'legs',
                    text: 'Chân thẳng, không cong vẹo hay bên cao bên thấp',
                    english: 'Legs are straight, no curvature or one long & one short leg',
                    details: [
                        'Hai chân dài tương đương',
                        'Không vòng kiềng, không chữ X',
                        'Khả năng đứng/di chuyển ổn định'
                    ]
                },
                {
                    id: 'shoulders',
                    text: 'Hai bên vai cân đối, không vẹo hay lệch',
                    english: 'The shoulders are balanced, not twisted or skewed',
                    details: [
                        'Độ cao hai vai tương xứng',
                        'Không lệch vai rõ rệt',
                        'Tư thế thẳng, không gù'
                    ]
                },
                {
                    id: 'tattoos',
                    text: 'Không có hình xăm, sẹo hay chàm tại khu vực bên ngoài đồng phục',
                    english: 'No tattoos, scars or birthmarks in areas outside the uniform',
                    details: [
                        'Không xăm lộ ra ngoài khi mặc đồng phục',
                        'Không sẹo lồi lớn, chàm lớn vùng hở',
                        'Không vết thẩm mỹ gây mất thẩm mỹ'
                    ]
                }
            ]
        },
        headFace: {
            title: 'Vùng đầu, mặt và làn da',
            items: [
                {
                    id: 'hair',
                    text: 'Tóc mọc đều',
                    english: 'Hair grows evenly',
                    details: [
                        'Không hói, không mảng thưa rõ rệt',
                        'Màu tóc phù hợp quy định',
                        'Tóc sạch sẽ, gọn gàng'
                    ]
                }
            ]
        },
        facialFeatures: {
            title: 'Đặc điểm khuôn mặt',
            items: [
                {
                    id: 'face_balance',
                    text: 'Gương mặt cân đối, 2 tai cân đối và hàm răng đều đặn, không hô, móm, răng nhấp nhô hoặc màu răng quá xỉn',
                    english: 'Balanced face, 2 ears balance and regular teeth, overbite, underbite, uneven teeth or too dull tooth color',
                    details: [
                        'Tỉ lệ khuôn mặt hài hòa',
                        'Tai cân đối hai bên',
                        'Răng đều, không hô/móm mạnh, màu răng phù hợp'
                    ]
                },
                {
                    id: 'eyes',
                    text: 'Mắt cân đối, không cận quá 3 độ, không lé, màu mắt 2 bên đồng đều',
                    english: 'Balanced eyes, short-signed but not more than 3 degrees, no squint, eye color on both sides evenly',
                    details: [
                        'Không lé, không lác',
                        'Cận không quá 3 độ (nếu có)',
                        'Màu mắt đồng đều hai bên'
                    ]
                },
                {
                    id: 'jaw',
                    text: 'Hàm không lệch, không móm',
                    english: 'Jaw bone is not misaligned, must be in shape',
                    details: [
                        'Không lệch khớp hàm',
                        'Không móm/hô nặng',
                        'Đường nét hàm hài hòa'
                    ]
                }
            ]
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
            total += category.items.length;
        });
        return total;
    };

    const canSubmit = () => {
        return getTotalSelectedCriteria() === getTotalCriteria();
    };

    const handleSubmitResult = () => {
        if (!canSubmit()) {
            Alert.alert('Thông báo', 'Vui lòng chấm hết tất cả tiêu chí trước khi gửi kết quả');
            return;
        }
        setShowFeedbackModal(true);
    };

    const handleConfirmSubmit = (text) => {
        setFeedbackText(text || '');
        setShowFeedbackModal(false);
        onScoreSubmit?.(candidateData, 'submitted', selectedCriteria, text || '');
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
                                ]}>Đạt</Text>
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
                                ]}>Không đạt</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const renderCategory = (categoryKey, category) => (
        <View key={categoryKey} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            {category.items.map(item => renderCriterionItem(categoryKey, item))}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.userTextContainer}>
                        <Text style={styles.headerTitle}>Chấm điểm ứng viên</Text>
                        <Text style={styles.userName}>{candidateData?.name || 'Ứng viên'}</Text>
                    </View>
                </View>
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
                <Text style={styles.progressText}>
                    Đã chọn: {getTotalSelectedCriteria()}/{getTotalCriteria()} tiêu chí
                </Text>
                <View style={styles.progressBar}>
                    <View
                        style={[
                            styles.progressFill,
                            { width: `${(getTotalSelectedCriteria() / getTotalCriteria()) * 100}%` }
                        ]}
                    />
                </View>
            </View>

            {/* Scoring Criteria */}
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {Object.entries(scoringCriteria).map(([categoryKey, category]) =>
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
                        Gửi kết quả
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
});
