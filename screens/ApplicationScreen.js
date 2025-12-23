import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    Image,
    Linking,
} from 'react-native';
import { useTranslation } from '../i18n';
import { getApplicationById } from '../service/api';

export default function ApplicationScreen({ candidateData, onBackPress }) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [application, setApplication] = useState(null);
    const isMounted = useRef(true);

    // Ưu tiên applicationId, fallback activityId nếu API chấp nhận
    const applicationId = candidateData?.applicationId || candidateData?.activityId;

    const fetchApplication = useCallback(async () => {
        if (!applicationId) {
            if (!isMounted.current) return;
            setError(t('candidate_missing_application') || 'Không tìm thấy applicationId.');
            setLoading(false);
            return;
        }

        try {
            // Chỉ bật spinner nếu chưa có dữ liệu để tránh nháy màn hình khi re-render
            if (!application) {
                setLoading(true);
            }
            setError(null);

            const result = await getApplicationById(applicationId);
            if (!isMounted.current) return;

            if (result.success && result.data) {
                setApplication(result.data);
            } else {
                setError(result.error || t('candidate_error') || 'Không thể tải hồ sơ.');
            }
        } catch (err) {
            if (!isMounted.current) return;
            setError(err.message || t('candidate_error') || 'Đã xảy ra lỗi.');
        } finally {
            if (!isMounted.current) return;
            setLoading(false);
        }
    }, [applicationId, application, t]);

    useEffect(() => {
        isMounted.current = true;
        fetchApplication();
        return () => {
            isMounted.current = false;
        };
    }, [fetchApplication]);

    const renderRow = (label, value, valueStyle) => {
        if (value === undefined || value === null || value === '') return null;
        return (
            <View style={styles.row}>
                <Text style={styles.label}>{label}</Text>
                <Text style={[styles.value, valueStyle]}>{String(value)}</Text>
            </View>
        );
    };

    const renderLinkRow = (label, url) => {
        if (!url) return null;
        const handlePress = () => {
            Linking.openURL(url).catch(() => {
                Alert.alert(
                    t('candidate_error') || 'Lỗi',
                    t('Unable to open link') || 'Không thể mở liên kết'
                );
            });
        };
        return (
            <TouchableOpacity style={styles.row} onPress={handlePress}>
                <Text style={styles.label}>{label}</Text>
                <Text style={[styles.value, styles.linkText]}>
                    {t('View document') || 'Xem tài liệu'}
                </Text>
            </TouchableOpacity>
        );
    };

    const formatTypeLabel = (type) => {
        if (!type) return type;
        // Tách PascalCase/camelCase và thay _,- bằng khoảng trắng
        return String(type)
            .replace(/[_-]+/g, ' ')
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .trim();
    };

    const renderDocuments = (documents) => {
        if (!Array.isArray(documents) || documents.length === 0) return null;
        return (
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{t('Documents') || 'Documents'}</Text>
                {documents.map((doc, index) => (
                    <View key={`${doc.documentId || index}`} style={styles.docCard}>
                        {renderRow(
                            t('Type') || 'Type',
                            doc?.name || doc?.title || formatTypeLabel(doc?.type)
                        )}
                        {renderRow(t('Upload Date') || 'Upload Date', doc.uploadDate)}
                        {renderLinkRow(t('URL') || 'URL', doc.documentURL)}
                    </View>
                ))}
            </View>
        );
    };

    const statusColor = (status) => {
        if (!status) return AIR_DARK;
        const key = String(status).toLowerCase();
        if (key.includes('pass')) return '#16A34A'; // xanh lá cho Passed
        if (key.includes('fail') || key.includes('reject')) return '#DC2626'; // đỏ cho Failed/Rejected
        if (key.includes('pending') || key.includes('process')) return '#F97316'; // cam cho Pending/In process
        return AIR_DARK;
    };

    const profilePhotoUrl = application?.documents?.find(
        (doc) => doc?.type === 'ProfilePhoto' && doc?.documentURL
    )?.documentURL;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>{t('View Application') || 'View Application'}</Text>
                    <Text style={styles.headerSubtitle}>
                        {candidateData?.name || candidateData?.fullName || t('candidate_detail') || 'Ứng viên'}
                    </Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.centerBox}>
                    <ActivityIndicator size="large" color={AIR_BLUE} />
                    <Text style={styles.loadingText}>{t('candidate_loading') || 'Đang tải hồ sơ...'}</Text>
                </View>
            ) : error ? (
                <View style={styles.centerBox}>
                    <Text style={styles.errorText}>{error}</Text>
                    {applicationId ? (
                        <TouchableOpacity style={styles.retryButton} onPress={fetchApplication}>
                            <Text style={styles.retryText}>{t('candidate_retry') || 'Thử lại'}</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            ) : (
                <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.avatarCard}>
                        {profilePhotoUrl ? (
                            <Image source={{ uri: profilePhotoUrl }} style={styles.avatar} />
                        ) : (
                            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                                <Text style={styles.avatarInitial}>
                                    {(application?.fullName || candidateData?.name || candidateData?.fullName || 'U')
                                        .charAt(0)
                                        .toUpperCase()}
                                </Text>
                            </View>
                        )}
                        <Text style={styles.avatarName}>
                            {application?.fullName || candidateData?.name || candidateData?.fullName || ''}
                        </Text>
                        {application?.status ? (
                            <View
                                style={[
                                    styles.statusBadge,
                                    {
                                        borderColor: statusColor(application?.status),
                                        backgroundColor: '#F8FAFC',
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.statusText,
                                        { color: statusColor(application?.status) },
                                    ]}
                                >
                                    {String(application?.status)}
                                </Text>
                            </View>
                        ) : null}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('General information') || 'Thông tin chung'}</Text>
                        {renderRow(t('Submission Date') || 'Submission Date', application?.submissionDate)}
                        {renderRow(t('Full Name') || 'Full Name', application?.fullName)}
                        {renderRow(t('Phone Number') || 'Phone Number', application?.phoneNumber)}
                        {renderRow(t('Date of Birth') || 'Date of Birth', application?.dateOfBirth)}
                        {renderRow(t('Gender') || 'Gender', application?.gender)}
                        {renderRow(t('Citizen ID') || 'Citizen ID', application?.citizenId)}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('Shape') || 'Thể hình'}</Text>
                        {renderRow(t('Height') || 'Height', application?.height)}
                        {renderRow(t('Weight') || 'Weight', application?.weight)}
                        {renderRow('BMI', application?.bmi)}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('English Certificate') || 'Chứng chỉ tiếng Anh'}</Text>
                        {renderRow(t('English Degree') || 'English Degree', application?.englishDegreeNumber)}
                        {renderRow(t('Total Score') || 'Total Score', application?.totalScore)}
                        {renderRow(t('End Date') || 'End Date', application?.endDate)}
                        {renderRow(t('English Test Date') || 'English Test Date', application?.englishTestDate)}
                        {renderRow(t('Listening Score') || 'Listening Score', application?.listeningScore)}
                        {renderRow(t('Reading Score') || 'Reading Score', application?.readingScore)}
                    </View>

                    {renderDocuments(application?.documents)}
                </ScrollView>
            )}
        </View>
    );
}

const AIR_BLUE = '#0EA5E9';
const AIR_DARK = '#0B3757';
const AIR_RED = '#DC2626';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
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
    headerTextContainer: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: AIR_DARK,
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    centerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6B7280',
        fontWeight: '500',
        textAlign: 'center',
    },
    errorText: {
        fontSize: 16,
        color: AIR_RED,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: AIR_BLUE,
        borderRadius: 10,
    },
    retryText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 32,
    },
    avatarCard: {
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    avatar: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#E5E7EB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    avatarPlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        fontSize: 28,
        fontWeight: '700',
        color: AIR_DARK,
    },
    avatarName: {
        fontSize: 16,
        fontWeight: '700',
        color: AIR_DARK,
        textAlign: 'center',
    },
    statusBadge: {
        marginTop: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.3,
    },
    section: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: AIR_DARK,
        marginBottom: 12,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    label: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
        flex: 1,
        marginRight: 8,
    },
    value: {
        fontSize: 14,
        color: AIR_DARK,
        fontWeight: '700',
        flex: 1,
        textAlign: 'right',
    },
    linkText: {
        color: AIR_BLUE,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    docCard: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#F8FAFC',
    },
});
