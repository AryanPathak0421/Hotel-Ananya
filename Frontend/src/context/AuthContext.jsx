import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('user');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('hotel_user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
            setRole(parsed.role || 'user');
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            setUser(data);
            setRole(data.role || 'user');
            localStorage.setItem('hotel_user', JSON.stringify(data));
            return { success: true, role: data.role || 'user' };
        } catch (error) {
            console.error('Login error:', error.response?.data?.message || error.message);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (userData) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            setUser(data);
            setRole(data.role || 'user');
            localStorage.setItem('hotel_user', JSON.stringify(data));
            return { success: true };
        } catch (error) {
            console.error('Signup error:', error.response?.data?.message || error.message);
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    };

    const logout = () => {
        setUser(null);
        setRole('user');
        localStorage.removeItem('hotel_user');
    };

    const updateProfile = (newData) => {
        const updatedUser = { ...user, ...newData };
        setUser(updatedUser);
        localStorage.setItem('hotel_user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, role, login, signup, logout, updateProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

