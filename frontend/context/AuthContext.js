// context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved auth state on app start
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");
        if (savedToken) {
          setToken(savedToken);
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${savedToken}`;
        }
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.log("Auth load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  // --- ACTIONS ---

  const register = async (form) => {
    const { data } = await axios.post(
      "http://10.124.194.56:3000/api/auth/register",
      form
    );
    return data; // will contain userId for VerifyOtp
  };

  const verifyOtp = async (userId, otp) => {
    const { data } = await axios.post(
      "http://10.124.194.56:3000/api/auth/verify-otp",
      {
        userId,
        otp,
      }
    );

    if (data?.token) {
      setToken(data.token);
      await AsyncStorage.setItem("token", data.token);
      setUser(data.user || null);
      if (data.user) {
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
      }
      axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    }
    return data;
  };

  const login = async (email, password) => {
    const { data } = await axios.post(
      "http://10.124.194.56:3000/api/auth/login",
      {
        email,
        password,
      }
    );

    setToken(data.token);
    await AsyncStorage.setItem("token", data.token);
    setUser(data.user || null);
    if (data.user) {
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    return data;
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  // inside AuthProvider
  const forgotPassword = async (email) => {
    const { data } = await axios.post(
      "http://10.124.194.56:3000/api/auth/forgot-password",
      {
        email,
      }
    );
    return data; // e.g. { message: "OTP sent to email" }
  };

  const resetPassword = async (userId, otp, newPassword) => {
    const { data } = await axios.post(
      "http://10.124.194.56:3000/api/auth/reset-password",
      {
        userId,
        otp,
        newPassword,
      }
    );
    return data; // e.g. { message: "Password reset successful" }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        verifyOtp,
        login,
        logout,
        forgotPassword,
        resetPassword,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
