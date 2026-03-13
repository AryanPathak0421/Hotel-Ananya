import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState('user'); // 'user' or 'admin'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate check for existing session
        const savedUser = localStorage.getItem('hotel_user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
            setRole(parsed.role || 'user');
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        setRole(userData.role || 'user');
        localStorage.setItem('hotel_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setRole('user');
        localStorage.removeItem('hotel_user');
    };

    return (
        <AuthContext.Provider value={{ user, role, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
