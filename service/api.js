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

