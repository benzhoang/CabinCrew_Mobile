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

