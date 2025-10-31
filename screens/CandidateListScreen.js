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
    Image,
} from 'react-native';
import { useTranslation } from '../i18n';

export default function CandidateListScreen({ batchData, onBackPress, navigation }) {
    const { t, lang } = useTranslation();
    const [selectedStatus, setSelectedStatus] = useState('pending');

    // Dữ liệu ứng viên cho đợt tuyển dụng được chọn
    const candidates = [
        {
            id: 1,
            name: 'Nguyễn Thị Hoa',
            age: 24,
            height: 165,
            weight: 52,
            education: 'Đại học Kinh tế',
            experience: '2 năm kinh nghiệm dịch vụ',
            phone: '0901234567',
            email: 'hoa.nguyen@email.com',
            status: 'pending',
            photo: null,
            notes: 'Ứng viên có kinh nghiệm tốt, giao tiếp lưu loát',
            appliedDate: '15/10/2024',
            currentStage: 'Kiểm tra ngoại hình'
        },
        {
            id: 2,
            name: 'Trần Minh Tuấn',
            age: 26,
            height: 175,
            weight: 68,
            education: 'Đại học Ngoại ngữ',
            experience: '3 năm kinh nghiệm khách sạn',
            phone: '0902345678',
            email: 'tuan.tran@email.com',
            status: 'approved',
            photo: null,
            notes: 'Ứng viên nam, chiều cao đạt yêu cầu',
            appliedDate: '14/10/2024',
            currentStage: 'Kiểm tra ngoại hình'
        },
        {
            id: 3,
            name: 'Lê Thị Mai',
            age: 23,
            height: 162,
            weight: 48,
            education: 'Cao đẳng Du lịch',
            experience: '1 năm kinh nghiệm bán hàng',
            phone: '0903456789',
            email: 'mai.le@email.com',
            status: 'rejected',
            photo: null,
            notes: 'Chiều cao chưa đạt yêu cầu tối thiểu',
            appliedDate: '13/10/2024',
            currentStage: 'Kiểm tra ngoại hình'
        },
        {
            id: 4,
            name: 'Phạm Văn Đức',
            age: 25,
            height: 170,
            weight: 65,
            education: 'Đại học Kỹ thuật',
            experience: '2 năm kinh nghiệm dịch vụ',
            phone: '0904567890',
            email: 'duc.pham@email.com',
            status: 'pending',
            photo: null,
            notes: 'Ứng viên có kỹ năng tiếng Anh tốt',
            appliedDate: '12/10/2024',
            currentStage: 'Kiểm tra ngoại hình'
        },
        {
            id: 5,
            name: 'Hoàng Thị Lan',
            age: 22,
            height: 168,
            weight: 50,
            education: 'Đại học Thương mại',
            experience: '1 năm kinh nghiệm nhà hàng',
            phone: '0905678901',
            email: 'lan.hoang@email.com',
            status: 'pending',
            photo: null,
            notes: 'Ứng viên trẻ, năng động',
            appliedDate: '11/10/2024',
            currentStage: 'Kiểm tra ngoại hình'
        }
    ];

    const statusFilters = [
        { key: 'pending', label: 'Chờ duyệt', color: '#D97706' },
        { key: 'approved', label: 'Đã duyệt', color: '#059669' },
        { key: 'rejected', label: 'Từ chối', color: '#DC2626' },
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return '#D97706';
            case 'approved':
                return '#059669';
            case 'rejected':
                return '#DC2626';
            default:
                return '#6B7280';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending':
                return 'Chờ duyệt';
            case 'approved':
                return 'Đã duyệt';
            case 'rejected':
                return 'Từ chối';
            default:
                return status;
        }
    };

    const filteredCandidates = candidates.filter(candidate => candidate.status === selectedStatus);

    const handleCandidatePress = (candidate) => {
        // Chuyển đến màn hình chấm điểm
        if (navigation) {
            navigation.navigate('ScoringScreen', { candidateData: candidate });
        }
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
                    <Text style={styles.candidateAge}>Tuổi: {item.age}</Text>
                    <Text style={styles.candidatePhysical}>
                        Chiều cao: {item.height}cm | Cân nặng: {item.weight}kg
                    </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
                </View>
            </View>

            <View style={styles.candidateDetails}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Học vấn:</Text>
                    <Text style={styles.detailValue}>{item.education}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Kinh nghiệm:</Text>
                    <Text style={styles.detailValue}>{item.experience}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Điện thoại:</Text>
                    <Text style={styles.detailValue}>{item.phone}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{item.email}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Ngày ứng tuyển:</Text>
                    <Text style={styles.detailValue}>{item.appliedDate}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Giai đoạn hiện tại:</Text>
                    <Text style={[styles.detailValue, styles.currentStageText]}>{item.currentStage}</Text>
                </View>
            </View>

            <View style={styles.notesSection}>
                <Text style={styles.notesLabel}>Ghi chú:</Text>
                <Text style={styles.notesText}>{item.notes}</Text>
            </View>

            {item.status === 'pending' && (
                <View style={styles.actionButtons}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.detailButton]}
                        onPress={() => handleCandidatePress(item)}
                    >
                        <Text style={styles.detailButtonText}>Chấm điểm ngoại hình</Text>
                    </TouchableOpacity>
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
                        <Text style={styles.headerTitle}>Danh sách ứng viên</Text>
                        <Text style={styles.userName}>{batchData?.name || 'Đợt tuyển dụng'}</Text>
                    </View>
                </View>
            </View>

            {/* Candidate List với Filter */}
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

                {/* Candidate List */}
                <FlatList
                    data={filteredCandidates}
                    renderItem={renderCandidateCard}
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
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    detailButton: {
        backgroundColor: AIR_BLUE,
    },
    detailButtonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '600',
    },
});
