import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL cho API
const API_BASE_URL = "https://cabincrewcareer.azurewebsites.net/api/v1";

// API đăng nhập
export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const data = await response.json();

        // Kiểm tra code === 0 (success) theo format API
        if (data.code === 0 && data.data) {
            // Lưu token vào AsyncStorage
            if (data.data.accessToken) {
                await AsyncStorage.setItem('token', data.data.accessToken);
            }
            if (data.data.refreshToken) {
                await AsyncStorage.setItem('refreshToken', data.data.refreshToken);
            }

            return {
                success: true,
                data: data.data, // accessToken, refreshToken, user info
                message: data.message,
            };
        } else {
            // API trả về lỗi nhưng không ném exception
            const errorMessage =
                data.errorMessage ||
                data.message ||
                "Đăng nhập thất bại";
            return {
                success: false,
                error: errorMessage,
                errorCode: data.errorCode,
                errorType: data.error,
            };
        }
    } catch (error) {
        const errorMessage =
            error.message ||
            "Đăng nhập thất bại";

        return {
            success: false,
            error: errorMessage,
            status: error.status,
        };
    }
};

// Lấy token từ AsyncStorage
export const getToken = async () => {
    try {
        return await AsyncStorage.getItem('token');
    } catch (error) {
        return null;
    }
};

// Xóa token
export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
    } catch (error) {
        console.error('Error removing token:', error);
    }
};

// API lấy danh sách campaigns được giao cho examiner
export const getMyCampaigns = async () => {
    try {
        const token = await getToken();
        if (!token) {
            return {
                success: false,
                error: 'Không tìm thấy token đăng nhập',
            };
        }

        const response = await fetch(`${API_BASE_URL}/users/my-campaigns`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        // Kiểm tra code === 0 (success) theo format API
        if (data.code === 0 && data.data) {
            return {
                success: true,
                data: data.data,
                message: data.message,
            };
        } else {
            const errorMessage =
                data.errorMessage ||
                data.message ||
                "Không thể lấy danh sách chiến dịch";
            return {
                success: false,
                error: errorMessage,
                errorCode: data.errorCode,
            };
        }
    } catch (error) {
        const errorMessage =
            error.message ||
            "Lỗi khi tải danh sách chiến dịch";
        return {
            success: false,
            error: errorMessage,
        };
    }
};

// API lấy danh sách tasks được giao cho examiner
export const getMyTasks = async () => {
    try {
        const token = await getToken();
        if (!token) {
            return {
                success: false,
                error: 'Không tìm thấy token đăng nhập',
            };
        }

        const response = await fetch(`${API_BASE_URL}/users/my-tasks`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        // Kiểm tra code === 0 (success) theo format API
        if (data.code === 0 && data.data) {
            return {
                success: true,
                data: data.data,
                message: data.message,
            };
        } else {
            const errorMessage =
                data.errorMessage ||
                data.message ||
                "Không thể lấy danh sách công việc";
            return {
                success: false,
                error: errorMessage,
                errorCode: data.errorCode,
            };
        }
    } catch (error) {
        const errorMessage =
            error.message ||
            "Lỗi khi tải danh sách công việc";
        return {
            success: false,
            error: errorMessage,
        };
    }
};

// API lấy danh sách tiêu chí chấm điểm
export const getScoringCriterias = async () => {
    try {
        const token = await getToken();
        if (!token) {
            return {
                success: false,
                error: 'Không tìm thấy token đăng nhập',
            };
        }

        const response = await fetch(`${API_BASE_URL}/scoring-criterias`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        // Kiểm tra code === 0 (success) theo format API
        if (data.code === 0 && data.data) {
            return {
                success: true,
                data: data.data,
                message: data.message,
            };
        } else {
            const errorMessage =
                data.errorMessage ||
                data.message ||
                "Không thể lấy danh sách tiêu chí chấm điểm";
            return {
                success: false,
                error: errorMessage,
                errorCode: data.errorCode,
            };
        }
    } catch (error) {
        const errorMessage =
            error.message ||
            "Lỗi khi tải danh sách tiêu chí chấm điểm";
        return {
            success: false,
            error: errorMessage,
        };
    }
};

// API lấy thông tin chi tiết của campaign theo ID
export const getCampaignDetail = async (campaignId) => {
    try {
        console.log('API - getCampaignDetail called with campaignId:', campaignId);
        const token = await getToken();
        if (!token) {
            console.error('API - getCampaignDetail: No token found');
            return {
                success: false,
                error: 'Không tìm thấy token đăng nhập',
            };
        }

        const url = `${API_BASE_URL}/campaigns/${campaignId}`;
        console.log('API - getCampaignDetail: Calling URL:', url);
        console.log('API - getCampaignDetail: Token exists:', !!token);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('API - getCampaignDetail: Response status:', response.status);
        console.log('API - getCampaignDetail: Response ok:', response.ok);

        // Kiểm tra response status trước khi parse JSON
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API - getCampaignDetail: HTTP Error:', response.status, errorText);
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { message: errorText || `HTTP ${response.status}` };
            }
            return {
                success: false,
                error: errorData.errorMessage || errorData.message || `HTTP ${response.status}: Không thể lấy thông tin chiến dịch`,
                errorCode: errorData.errorCode || response.status,
            };
        }

        const data = await response.json();
        console.log('API - getCampaignDetail: Response data:', JSON.stringify(data, null, 2));

        // Kiểm tra code === 0 (success) theo format API
        // Hoặc nếu không có code field, kiểm tra xem có data không
        if (data.code === 0) {
            // Format chuẩn: { code: 0, data: {...} }
            if (data.data) {
                console.log('API - getCampaignDetail: Success (code=0), data received');
                return {
                    success: true,
                    data: data.data,
                    message: data.message,
                };
            } else {
                // Trường hợp code=0 nhưng không có data wrapper
                console.log('API - getCampaignDetail: Success (code=0), but no data wrapper');
                return {
                    success: true,
                    data: data,
                    message: data.message,
                };
            }
        } else if (data.code !== undefined && data.code !== 0) {
            // Có code nhưng khác 0 - lỗi
            const errorMessage =
                data.errorMessage ||
                data.message ||
                "Không thể lấy thông tin chiến dịch";
            console.error('API - getCampaignDetail: API returned error code:', data.code);
            console.error('API - getCampaignDetail: Error message:', errorMessage);
            return {
                success: false,
                error: errorMessage,
                errorCode: data.errorCode || data.code,
            };
        } else if (data.campaignId || data.campaignName || data.rounds) {
            // Không có code field nhưng có dữ liệu campaign - có thể là response trực tiếp
            console.log('API - getCampaignDetail: Success (no code field, but has campaign data)');
            return {
                success: true,
                data: data,
                message: 'Success',
            };
        } else {
            // Không có code và không có data hợp lệ
            const errorMessage =
                data.errorMessage ||
                data.message ||
                "Không thể lấy thông tin chiến dịch";
            console.error('API - getCampaignDetail: Unknown response format');
            console.error('API - getCampaignDetail: Response:', JSON.stringify(data, null, 2));
            return {
                success: false,
                error: errorMessage,
                errorCode: data.errorCode,
            };
        }
    } catch (error) {
        const errorMessage =
            error.message ||
            "Lỗi khi tải thông tin chiến dịch";
        console.error('API - getCampaignDetail: Exception caught:', error);
        return {
            success: false,
            error: errorMessage,
        };
    }
};

// API lấy thông tin chi tiết của campaign round theo ID
export const getCampaignRoundDetail = async (campaignRoundId) => {
    try {
        console.log('API - getCampaignRoundDetail called with campaignRoundId:', campaignRoundId);
        const token = await getToken();
        if (!token) {
            console.error('API - getCampaignRoundDetail: No token found');
            return {
                success: false,
                error: 'Không tìm thấy token đăng nhập',
            };
        }

        const url = `${API_BASE_URL}/campaign-rounds/${campaignRoundId}`;
        console.log('API - getCampaignRoundDetail: Calling URL:', url);
        console.log('API - getCampaignRoundDetail: Token exists:', !!token);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('API - getCampaignRoundDetail: Response status:', response.status);
        console.log('API - getCampaignRoundDetail: Response ok:', response.ok);

        // Kiểm tra response status trước khi parse JSON
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API - getCampaignRoundDetail: HTTP Error:', response.status, errorText);
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { message: errorText || `HTTP ${response.status}` };
            }
            return {
                success: false,
                error: errorData.errorMessage || errorData.message || `HTTP ${response.status}: Không thể lấy thông tin đợt tuyển dụng`,
                errorCode: errorData.errorCode || response.status,
            };
        }

        const data = await response.json();
        console.log('API - getCampaignRoundDetail: Response data:', JSON.stringify(data, null, 2));

        // Kiểm tra code === 0 (success) theo format API
        if (data.code === 0) {
            // Format chuẩn: { code: 0, data: {...} }
            if (data.data) {
                console.log('API - getCampaignRoundDetail: Success (code=0), data received');
                return {
                    success: true,
                    data: data.data,
                    message: data.message,
                };
            } else {
                // Trường hợp code=0 nhưng không có data wrapper
                console.log('API - getCampaignRoundDetail: Success (code=0), but no data wrapper');
                return {
                    success: true,
                    data: data,
                    message: data.message,
                };
            }
        } else if (data.code !== undefined && data.code !== 0) {
            // Có code nhưng khác 0 - lỗi
            const errorMessage =
                data.errorMessage ||
                data.message ||
                "Không thể lấy thông tin đợt tuyển dụng";
            console.error('API - getCampaignRoundDetail: API returned error code:', data.code);
            console.error('API - getCampaignRoundDetail: Error message:', errorMessage);
            return {
                success: false,
                error: errorMessage,
                errorCode: data.errorCode || data.code,
            };
        } else if (data.campaignRoundId || data.roundName || data.rounds) {
            // Không có code field nhưng có dữ liệu campaign round - có thể là response trực tiếp
            console.log('API - getCampaignRoundDetail: Success (no code field, but has campaign round data)');
            return {
                success: true,
                data: data,
                message: 'Success',
            };
        } else {
            // Không có code và không có data hợp lệ
            const errorMessage =
                data.errorMessage ||
                data.message ||
                "Không thể lấy thông tin đợt tuyển dụng";
            console.error('API - getCampaignRoundDetail: Unknown response format');
            console.error('API - getCampaignRoundDetail: Response:', JSON.stringify(data, null, 2));
            return {
                success: false,
                error: errorMessage,
                errorCode: data.errorCode,
            };
        }
    } catch (error) {
        const errorMessage =
            error.message ||
            "Lỗi khi tải thông tin đợt tuyển dụng";
        console.error('API - getCampaignRoundDetail: Exception caught:', error);
        return {
            success: false,
            error: errorMessage,
        };
    }
};

// API lấy danh sách participants của một round theo roundId
export const getRoundParticipants = async (roundId) => {
    try {
        console.log('API - getRoundParticipants called with roundId:', roundId);
        const token = await getToken();
        if (!token) {
            console.error('API - getRoundParticipants: No token found');
            return {
                success: false,
                error: 'Không tìm thấy token đăng nhập',
            };
        }

        const url = `${API_BASE_URL}/rounds/${roundId}/participants`;
        console.log('API - getRoundParticipants: Calling URL:', url);
        console.log('API - getRoundParticipants: Token exists:', !!token);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('API - getRoundParticipants: Response status:', response.status);
        console.log('API - getRoundParticipants: Response ok:', response.ok);

        // Kiểm tra response status trước khi parse JSON
        if (!response.ok) {
            const errorText = await response.text();
            console.error('API - getRoundParticipants: HTTP Error:', response.status, errorText);
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { message: errorText || `HTTP ${response.status}` };
            }
            return {
                success: false,
                error: errorData.errorMessage || errorData.message || `HTTP ${response.status}: Không thể lấy danh sách ứng viên`,
                errorCode: errorData.errorCode || response.status,
            };
        }

        const data = await response.json();
        console.log('API - getRoundParticipants: Response data:', JSON.stringify(data, null, 2));

        // Kiểm tra code === 0 (success) theo format API
        if (data.code === 0) {
            // Format chuẩn: { code: 0, data: {...} }
            if (data.data) {
                console.log('API - getRoundParticipants: Success (code=0), data received');
                return {
                    success: true,
                    data: data.data,
                    message: data.message,
                };
            } else {
                // Trường hợp code=0 nhưng không có data wrapper
                console.log('API - getRoundParticipants: Success (code=0), but no data wrapper');
                return {
                    success: true,
                    data: data,
                    message: data.message,
                };
            }
        } else if (data.code !== undefined && data.code !== 0) {
            // Có code nhưng khác 0 - lỗi
            const errorMessage =
                data.errorMessage ||
                data.message ||
                "Không thể lấy danh sách ứng viên";
            console.error('API - getRoundParticipants: API returned error code:', data.code);
            console.error('API - getRoundParticipants: Error message:', errorMessage);
            return {
                success: false,
                error: errorMessage,
                errorCode: data.errorCode || data.code,
            };
        } else if (data.items || data.data) {
            // Không có code field nhưng có dữ liệu - có thể là response trực tiếp
            console.log('API - getRoundParticipants: Success (no code field, but has data)');
            return {
                success: true,
                data: data.data || data,
                message: 'Success',
            };
        } else {
            // Không có code và không có data hợp lệ
            const errorMessage =
                data.errorMessage ||
                data.message ||
                "Không thể lấy danh sách ứng viên";
            console.error('API - getRoundParticipants: Unknown response format');
            console.error('API - getRoundParticipants: Response:', JSON.stringify(data, null, 2));
            return {
                success: false,
                error: errorMessage,
                errorCode: data.errorCode,
            };
        }
    } catch (error) {
        const errorMessage =
            error.message ||
            "Lỗi khi tải danh sách ứng viên";
        console.error('API - getRoundParticipants: Exception caught:', error);
        return {
            success: false,
            error: errorMessage,
        };
    }
};

// API lấy thông tin hồ sơ ứng tuyển theo applicationId
export const getApplicationById = async (applicationId) => {
    try {
        if (!applicationId) {
            return {
                success: false,
                error: 'Application ID is required',
            };
        }

        const token = await getToken();
        if (!token) {
            return {
                success: false,
                error: 'Không tìm thấy token đăng nhập',
            };
        }

        const url = `${API_BASE_URL}/applications/${applicationId}`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch (e) {
                errorData = { message: errorText || `HTTP ${response.status}` };
            }
            return {
                success: false,
                error: errorData.errorMessage || errorData.message || `HTTP ${response.status}: Không thể lấy thông tin hồ sơ`,
                errorCode: errorData.errorCode || response.status,
            };
        }

        const data = await response.json();

        if (data.code === 0 && data.data) {
            return {
                success: true,
                data: data.data,
                message: data.message,
            };
        }

        if (data.data) {
            return {
                success: true,
                data: data.data,
                message: data.message,
            };
        }

        if (data.applicationId) {
            return {
                success: true,
                data,
                message: data.message || 'Success',
            };
        }

        return {
            success: false,
            error: data.errorMessage || data.message || 'Không thể lấy thông tin hồ sơ',
        };
    } catch (error) {
        const errorMessage =
            error.message ||
            'Lỗi khi tải thông tin hồ sơ';
        return {
            success: false,
            error: errorMessage,
        };
    }
};


// API gửi kết quả chấm điểm Appearance
export const submitAppearanceResult = async ({ activityId, comment, choices }) => {
    try {
        const token = await getToken();
        if (!token) {
            return {
                success: false,
                error: 'Không tìm thấy token đăng nhập',
            };
        }

        const payload = {
            activityId,
            comment: comment ?? '',
            choices: Array.isArray(choices) ? choices : [],
        };

        const response = await fetch(`${API_BASE_URL}/appearance-results`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            return {
                success: false,
                error: data?.errorMessage || data?.message || `HTTP ${response.status}: Không thể gửi kết quả`,
                errorCode: data?.errorCode || response.status,
            };
        }

        if (data?.code === 0 || data?.data || response.status === 201) {
            return {
                success: true,
                data: data?.data || data,
                message: data?.message,
            };
        }

        return {
            success: false,
            error: data?.errorMessage || data?.message || 'Không thể gửi kết quả Appearance',
        };
    } catch (error) {
        const errorMessage =
            error.message ||
            'Lỗi khi gửi kết quả Appearance';
        return {
            success: false,
            error: errorMessage,
        };
    }
};

