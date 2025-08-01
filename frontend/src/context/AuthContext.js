import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const updateUserFromToken = (token) => {
        if (!token) {
            setUser(null);
            return;
        }
        try {
            const decoded = jwtDecode(token);
            if (decoded.exp * 1000 > Date.now()) {
                // This is the fix: Safely get the username.
                // It prefers the 'username' claim, but has fallbacks to prevent crashes.
                let username = decoded.username;
                if (!username) {
                    const identity = decoded.sub;
                    username = (typeof identity === 'object' && identity !== null) ? identity.id : identity;
                }
                
                setUser({
                    token: token,
                    username: username || 'User', // Ensure username is never undefined
                    role: decoded.role,
                });
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
        } catch (error) {
            console.error("Invalid token:", error);
            localStorage.removeItem('token');
            setUser(null);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        updateUserFromToken(token);
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        updateUserFromToken(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
