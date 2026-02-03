
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const checkAuth = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setLoading(false);
            return;
        }

        // Set token for axios
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        try {
            const res = await api.get("/api/auth/me");
            setUser(res.data);
        } catch (error) {
            localStorage.removeItem("token");
            delete api.defaults.headers.common['Authorization'];
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await api.post("/api/auth/login", { email, password });
        localStorage.setItem("token", res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data);

        // Redirect based on role
        if (res.data.role === 'admin') {
            router.push("/admin");
        } else {
            router.push("/redeem");
        }
    };

    const register = async (name, email, password) => {
        const res = await api.post("/api/auth/register", { name, email, password });
        localStorage.setItem("token", res.data.token);
        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        setUser(res.data);
        router.push("/redeem");
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, checkAuth, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
