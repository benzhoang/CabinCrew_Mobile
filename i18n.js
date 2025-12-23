// Simple i18n utility for React Native - VI/EN

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'lang';

const dictionaries = {
    vi: {
        // MainScreen
        main_title: 'CabinCrew',
        main_subtitle: 'Bay cao - Chạm ước mơ',
        signin: 'Đăng nhập',
        signup: 'Đăng ký',
        language: 'Ngôn ngữ',
        vi: 'Tiếng Việt',
        en: 'English',

        // Signin
        signin_title: 'Đăng nhập',
        signin_subtitle: 'Chào mừng bạn quay trở lại',
        username_label: 'Tên đăng nhập',
        username_placeholder: 'Nhập tên đăng nhập',
        password_label: 'Mật khẩu',
        password_placeholder: 'Nhập mật khẩu',
        password_show: 'Hiện mật khẩu',
        password_hide: 'Ẩn mật khẩu',
        remember_me: 'Ghi nhớ đăng nhập',
        forgot_password: 'Quên mật khẩu?',
        or: 'Hoặc',
        login_with_google: 'Đăng nhập với Google',
        logging_in: 'Đang đăng nhập...',
        no_account: 'Chưa có tài khoản?',
        signup_now: 'Đăng ký ngay',
        login: 'Đăng nhập',
        error: 'Lỗi',
        error_fill_fields: 'Vui lòng nhập đầy đủ thông tin',

        // Signup
        signup_title: 'Đăng ký',
        signup_subtitle: 'Tạo tài khoản để bắt đầu',
        email_label: 'Email',
        email_placeholder: 'Nhập email của bạn',
        password_confirm_label: 'Xác nhận mật khẩu',
        password_confirm_placeholder: 'Nhập lại mật khẩu',
        creating_account: 'Đang đăng ký...',
        create_account: 'Tạo tài khoản',
        have_account: 'Đã có tài khoản?',

        // OTP
        otp_title: 'Nhập mã OTP',
        otp_subtitle: 'Chúng tôi đã gửi mã 6 số tới email của bạn',
        otp_verifying: 'Đang xác thực...',
        otp_confirm: 'Xác nhận',
        otp_skip: 'Bỏ qua, đăng nhập sau',

        // Home
        home_title: 'Trang chủ',
        campaign: 'Chiến dịch',
        task: 'Công việc',
        interviews: 'Phỏng vấn',
        scoring: 'Chấm điểm',
        welcome_back: 'Chào mừng bạn trở lại',
        dashboard: 'Bảng điều khiển',

        // Campaign Screen
        campaigns: 'Chiến dịch',
        all_campaigns: 'Tất cả',
        active_campaigns: 'Hoạt động',
        warning_campaigns: 'Cảnh báo',
        inactive_campaigns: 'Không hoạt động',

        // Task Screen
        task_assigned: 'Đã giao',
        task_in_progress: 'Đang thực hiện',
        task_completed: 'Hoàn thành',
        task_cancelled: 'Đã hủy',
        task_loading: 'Đang tải danh sách công việc...',
        task_error: 'Không thể tải danh sách công việc',
        task_error_general: 'Đã xảy ra lỗi khi tải dữ liệu',
        task_retry: 'Thử lại',
        task_empty: 'Không có công việc nào',
        task_label_title: 'Công việc:',
        task_label_description: 'Mô tả công việc:',
        task_label_assigned_by: 'Giao bởi:',
        task_label_status: 'Trạng thái:',
        task_label_start_date: 'Ngày bắt đầu:',
        task_label_assigned_at: 'Ngày giao:',
        task_label_end_date: 'Ngày kết thúc:',

        // Campaign Screen
        campaign_header_subtitle: 'Quản lý chiến dịch',
        campaign_loading: 'Đang tải danh sách chiến dịch...',
        campaign_error: 'Không thể tải danh sách chiến dịch',
        campaign_error_general: 'Đã xảy ra lỗi khi tải dữ liệu',
        campaign_retry: 'Thử lại',
        campaign_empty: 'Không có chiến dịch nào',
        campaign_status_active: 'Đang hoạt động',
        campaign_status_completed: 'Hoàn thành',
        campaign_status_paused: 'Tạm dừng',
        campaign_progress: 'Tiến độ tuyển dụng',
        campaign_people: 'người',
        campaign_label_position: 'Vị trí:',
        campaign_label_start_date: 'Ngày bắt đầu:',
        campaign_label_end_date: 'Ngày kết thúc:',

        // Candidate List Screen
        candidate_list_title: 'Danh sách ứng viên',
        candidate_batch_name: 'Đợt tuyển dụng',
        candidate_loading: 'Đang tải danh sách ứng viên...',
        candidate_error: 'Không thể lấy danh sách ứng viên',
        candidate_error_round: 'Lỗi khi tải thông tin đợt tuyển dụng',
        candidate_error_round_id: 'Không tìm thấy ID đợt tuyển dụng',
        candidate_error_appearance_round: 'Không tìm thấy round Appearance',
        candidate_error_rounds: 'Không tìm thấy danh sách rounds',
        candidate_error_round_id_missing: 'Không tìm thấy ID của round Appearance',
        candidate_empty: 'Không có ứng viên nào',
        candidate_retry: 'Thử lại',
        candidate_label_phone: 'Điện thoại:',
        candidate_label_email: 'Email:',
        candidate_label_round: 'Round:',
        candidate_score_appearance: 'Chấm điểm ngoại hình',
        candidate_status_pending: 'Chờ duyệt',
        candidate_status_approved: 'Đã duyệt',
        candidate_status_rejected: 'Từ chối',
        candidate_status_passed: 'Đã đạt',
        candidate_status_ongoing: 'Đang diễn ra',
        candidate_status_failed: 'Không đạt',
        candidate_status_undetermined: 'Chưa xác định',

        // Scoring Screen
        scoring_title: 'Chấm điểm ứng viên',
        scoring_candidate: 'Ứng viên',
        scoring_loading: 'Đang tải tiêu chí chấm điểm...',
        scoring_error: 'Không thể tải danh sách tiêu chí',
        scoring_error_general: 'Lỗi khi tải danh sách tiêu chí',
        scoring_error_activity_id: 'Không tìm thấy activityId của ứng viên để gửi kết quả',
        scoring_error_no_data: 'Không có dữ liệu tiêu chí để gửi',
        scoring_error_submit: 'Không thể gửi kết quả',
        scoring_retry: 'Thử lại',
        scoring_selected: 'Đã chọn:',
        scoring_criteria: 'tiêu chí',
        scoring_pass: 'Đạt',
        scoring_fail: 'Không đạt',
        scoring_submit: 'Gửi kết quả',
        scoring_submitting: 'Đang gửi...',
        scoring_submit_message: 'Vui lòng chấm hết tất cả tiêu chí trước khi gửi kết quả',
        scoring_error_title: 'Lỗi',
        scoring_info_title: 'Thông báo',

        // Batch Screen
        batch_header_title: 'Đợt tuyển dụng',
        batch_campaign_fallback: 'Chiến dịch',
        batch_loading: 'Đang tải thông tin đợt tuyển dụng...',
        batch_error: 'Không thể tải thông tin chiến dịch',
        batch_error_no_data: 'Không nhận được dữ liệu từ server',
        batch_error_not_found: 'Không tìm thấy ID chiến dịch',
        batch_error_generic: 'Đã xảy ra lỗi khi tải dữ liệu',
        batch_retry: 'Thử lại',
        batch_default_prefix: 'Đợt',
        batch_status_ongoing: 'Đang diễn ra',
        batch_status_upcoming: 'Sắp diễn ra',
        batch_status_completed: 'Hoàn thành',
        batch_status_paused: 'Tạm dừng',
        batch_status_unknown: 'Không xác định',
        batch_start_time: 'Thời gian bắt đầu:',
        batch_end_time: 'Thời gian kết thúc:',
        batch_location: 'Địa điểm:',
        batch_format: 'Hình thức:',
        batch_manager: 'Phụ trách:',
        batch_target: 'Chỉ tiêu:',
        batch_notes: 'Ghi chú:',
        batch_progress_title: 'Tiến độ tuyển dụng',
        batch_view_candidates: 'Xem danh sách ứng viên',
        batch_not_available: 'Chưa thể xem danh sách',
        batch_empty: 'Không có đợt tuyển dụng nào',
        batch_campaign_info: 'Thông tin chiến dịch',
        batch_campaign_name: 'Tên chiến dịch:',
        batch_campaign_description: 'Mô tả:',
        batch_campaign_target: 'Chỉ tiêu:',
        batch_campaign_type: 'Loại chiến dịch:',
        batch_campaign_status: 'Trạng thái:',
        batch_campaign_partner: 'Đối tác:',
        batch_campaign_start_date: 'Ngày bắt đầu:',
        batch_campaign_end_date: 'Ngày kết thúc:',
        batch_campaign_approved_at: 'Ngày duyệt:',
        batch_campaign_rejected_at: 'Ngày từ chối:',
        batch_campaign_reviewer: 'Người duyệt:',
        batch_campaign_rejected_reason: 'Lý do từ chối:',
        batch_campaign_rejected_count: 'Số lần từ chối:',
        batch_campaign_created_at: 'Ngày tạo:',

        // Feedback Modal
        feedback_title: 'Ghi chú đánh giá',
        feedback_subtitle: 'Bạn có thể ghi lại feedback trước khi gửi kết quả.',
        feedback_placeholder: 'Nhập ghi chú/feedback (không bắt buộc)',
        feedback_cancel: 'Hủy',
        feedback_submit: 'Gửi',
    },
    en: {
        // MainScreen
        main_title: 'CabinCrew',
        main_subtitle: 'Fly High - Touch Dreams',
        signin: 'Sign in',
        signup: 'Sign up',
        language: 'Language',
        vi: 'Vietnamese',
        en: 'English',

        // Signin
        signin_title: 'Sign in',
        signin_subtitle: 'Welcome back',
        username_label: 'Username',
        username_placeholder: 'Enter your username',
        password_label: 'Password',
        password_placeholder: 'Enter your password',
        password_show: 'Show password',
        password_hide: 'Hide password',
        remember_me: 'Remember me',
        forgot_password: 'Forgot password?',
        or: 'Or',
        login_with_google: 'Sign in with Google',
        logging_in: 'Signing in...',
        no_account: "Don't have an account?",
        signup_now: 'Sign up now',
        login: 'Login',
        error: 'Error',
        error_fill_fields: 'Please fill in all fields',

        // Signup
        signup_title: 'Sign up',
        signup_subtitle: 'Create an account to get started',
        email_label: 'Email',
        email_placeholder: 'Enter your email',
        password_confirm_label: 'Confirm password',
        password_confirm_placeholder: 'Re-enter your password',
        creating_account: 'Creating account...',
        create_account: 'Create account',
        have_account: 'Already have an account?',

        // OTP
        otp_title: 'Enter OTP',
        otp_subtitle: 'We have sent a 6-digit code to your email',
        otp_verifying: 'Verifying...',
        otp_confirm: 'Confirm',
        otp_skip: 'Skip, sign in later',

        // Home
        home_title: 'Home',
        campaign: 'Campaign',
        task: 'Task',
        interviews: 'Interviews',
        scoring: 'Scoring',
        welcome_back: 'Welcome back',
        dashboard: 'Dashboard',

        // Campaign Screen
        campaigns: 'Campaigns',
        all_campaigns: 'All',
        active_campaigns: 'Ongoing',
        warning_campaigns: 'Warning',
        inactive_campaigns: 'Inactive',
        campaign_status_ongoing: 'Ongoing',

        // Task Screen
        task_assigned: 'Assigned',
        task_in_progress: 'In progress',
        task_completed: 'Completed',
        task_cancelled: 'Cancelled',
        task_loading: 'Loading tasks...',
        task_error: 'Unable to load tasks',
        task_error_general: 'An error occurred while loading data',
        task_retry: 'Retry',
        task_empty: 'No tasks available',
        task_label_title: 'Task:',
        task_label_description: 'Task description:',
        task_label_assigned_by: 'Assigned by:',
        task_label_status: 'Status:',
        task_label_start_date: 'Start date:',
        task_label_assigned_at: 'Assigned at:',
        task_label_end_date: 'End date:',

        // Campaign Screen
        campaign_header_subtitle: 'Campaign management',
        campaign_loading: 'Loading campaigns...',
        campaign_error: 'Unable to load campaigns',
        campaign_error_general: 'An error occurred while loading data',
        campaign_retry: 'Retry',
        campaign_empty: 'No campaigns available',
        campaign_status_active: 'Active',
        campaign_status_completed: 'Upcoming',
        campaign_status_paused: 'Ended',
        campaign_progress: 'Hiring progress',
        campaign_people: 'people',
        campaign_label_position: 'Position:',
        campaign_Lable_partner: 'Partner',
        campaign_Lable_type: 'Type',
        campaign_label_start_date: 'Start date:',
        campaign_label_end_date: 'End date:',

        // Candidate List Screen
        candidate_list_title: 'Candidate List',
        candidate_batch_name: 'Recruitment Campaign',
        candidate_loading: 'Loading candidates...',
        candidate_error: 'Unable to load candidates',
        candidate_error_round: 'Error loading recruitment batch information',
        candidate_error_round_id: 'Recruitment batch ID not found',
        candidate_error_appearance_round: 'Appearance round not found',
        candidate_error_rounds: 'Rounds list not found',
        candidate_error_round_id_missing: 'Appearance round ID not found',
        candidate_empty: 'No candidates available',
        candidate_retry: 'Retry',
        candidate_label_phone: 'Phone:',
        candidate_label_email: 'Email:',
        candidate_label_round: 'Round:',
        candidate_score_appearance: 'Score Appearance',
        candidate_status_pending: 'Pending',
        candidate_status_approved: 'Approved',
        candidate_status_rejected: 'Rejected',
        candidate_status_passed: 'Passed',
        candidate_status_ongoing: 'Ongoing',
        candidate_status_failed: 'Failed',
        candidate_status_undetermined: 'Undetermined',

        // Scoring Screen
        scoring_title: 'Score Candidate',
        scoring_candidate: 'Candidate',
        scoring_loading: 'Loading scoring criteria...',
        scoring_error: 'Unable to load scoring criteria',
        scoring_error_general: 'Error loading scoring criteria',
        scoring_error_activity_id: 'Candidate activityId not found to submit result',
        scoring_error_no_data: 'No criteria data to submit',
        scoring_error_submit: 'Unable to submit result',
        scoring_retry: 'Retry',
        scoring_selected: 'Selected:',
        scoring_criteria: 'criteria',
        scoring_pass: 'Pass',
        scoring_fail: 'Fail',
        scoring_submit: 'Submit Result',
        scoring_submitting: 'Submitting...',
        scoring_submit_message: 'Please score all criteria before submitting',
        scoring_error_title: 'Error',
        scoring_info_title: 'Notification',

        // Batch Screen
        batch_header_title: 'Recruitment Campaign',
        batch_campaign_fallback: 'Campaign',
        batch_loading: 'Loading batch information...',
        batch_error: 'Unable to load campaign information',
        batch_error_no_data: 'No data received from server',
        batch_error_not_found: 'Campaign ID not found',
        batch_error_generic: 'An error occurred while loading data',
        batch_retry: 'Retry',
        batch_default_prefix: 'Batch',
        batch_status_ongoing: 'Ongoing',
        batch_status_upcoming: 'Upcoming',
        batch_status_completed: 'Completed',
        batch_status_paused: 'Paused',
        batch_status_unknown: 'Unknown',
        batch_start_time: 'Start time:',
        batch_end_time: 'End time:',
        batch_location: 'Location:',
        batch_format: 'Format:',
        batch_manager: 'Owner:',
        batch_target: 'Target:',
        batch_notes: 'Notes:',
        batch_progress_title: 'Hiring progress',
        batch_view_candidates: 'View candidates',
        batch_not_available: 'Not available yet',
        batch_empty: 'No batches available',
        batch_campaign_info: 'Campaign information',
        batch_campaign_name: 'Name:',
        batch_campaign_description: 'Description:',
        batch_campaign_target: 'Target:',
        batch_campaign_type: 'Campaign type:',
        batch_campaign_status: 'Status:',
        batch_campaign_partner: 'Partner:',
        batch_campaign_start_date: 'Start date:',
        batch_campaign_end_date: 'End date:',
        batch_campaign_approved_at: 'Approved at:',
        batch_campaign_rejected_at: 'Rejected at:',
        batch_campaign_reviewer: 'Reviewer:',
        batch_campaign_rejected_reason: 'Rejected reason:',
        batch_campaign_rejected_count: 'Reject count:',
        batch_campaign_created_at: 'Created at:',

        // Feedback Modal
        feedback_title: 'Feedback notes',
        feedback_subtitle: 'You can add feedback before submitting the result.',
        feedback_placeholder: 'Enter notes/feedback (optional)',
        feedback_cancel: 'Cancel',
        feedback_submit: 'Submit',
    },
};

const listeners = new Set();

export async function getLang() {
    try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        return stored === 'en' || stored === 'vi' ? stored : 'en';
    } catch (error) {
        console.warn('Error getting language from storage:', error);
        return 'en';
    }
}

export async function setLang(nextLang) {
    try {
        const lang = nextLang === 'en' ? 'en' : 'vi';
        await AsyncStorage.setItem(STORAGE_KEY, lang);
        listeners.forEach((fn) => {
            try { fn(lang); } catch (e) { console.warn('Error in language change listener:', e); }
        });
    } catch (error) {
        console.warn('Error setting language:', error);
    }
}

export function onLangChange(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
}

export async function t(key) {
    const lang = await getLang();
    const dict = dictionaries[lang] || dictionaries.en;
    return dict[key] || key;
}

// Hook for React components
export function useTranslation() {
    const [lang, setLangState] = React.useState('en');

    React.useEffect(() => {
        getLang().then(setLangState);
        const unsubscribe = onLangChange(setLangState);
        return unsubscribe;
    }, []);

    const t = (key) => {
        const dict = dictionaries[lang] || dictionaries.en;
        return dict[key] || key;
    };

    const changeLanguage = async (newLang) => {
        await setLang(newLang);
    };

    return { t, lang, changeLanguage };
}

export default { t, getLang, setLang, onLangChange, useTranslation };