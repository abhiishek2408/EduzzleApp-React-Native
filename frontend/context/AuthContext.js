import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  // DEV toggle: when true, do not auto-logout on 401 so we can debug requests
  const TEMP_DISABLE_AUTO_LOGOUT = true;

  // Load saved auth state on app start
  useEffect(() => {
    const loadAuth = async () => {
      try {
        const savedToken = await AsyncStorage.getItem("token");
        const savedUser = await AsyncStorage.getItem("user");
        if (savedToken) {
          setToken(savedToken);
          axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
        }
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);

          // Track daily login for returning users
          if (parsedUser?._id && savedToken) {
            setTimeout(() => {
              axios.post(
                `https://eduzzleapp-react-native.onrender.com/api/streaks/daily-login/${parsedUser._id}`
              ).then(response => {
                if (response?.data?.success) {
                  // Refresh user to get updated coins
                  axios.get("https://eduzzleapp-react-native.onrender.com/api/auth/me", {
                    headers: { Authorization: `Bearer ${savedToken}` }
                  }).then(res => {
                    if (res?.data?.user) {
                      setUser(res.data.user);
                      AsyncStorage.setItem("user", JSON.stringify(res.data.user));
                    }
                  }).catch(e => console.log("Refresh after streak:", e?.message));
                }
              }).catch(e => console.log("Daily login track error:", e?.message));
            }, 1000);
          }
        }
      } catch (err) {
        console.log("Auth load error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadAuth();
  }, []);

  // Global 401 handler: auto-logout on unauthorized
  useEffect(() => {
    const reqInterceptor = axios.interceptors.request.use(
      (config) => {
        try {
          const authHeader = config.headers?.Authorization || axios.defaults.headers.common["Authorization"];
          const preview = authHeader ? String(authHeader).slice(0, 30) : null;
         // console.log("[Auth] axios request:", config.method, config.url, "AuthorizationPreview:", preview);
        } catch (e) {}
        return config;
      },
      (err) => Promise.reject(err)
    );

    const resInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        // Log the 401 and originating request for debugging
          if (error?.response?.status === 401) {
            try {
              console.log("[Auth] axios 401 intercepted. tokenExists:", !!token, "url:", error?.config?.url, "method:", error?.config?.method);
              if (token) {
                if (TEMP_DISABLE_AUTO_LOGOUT) {
                  console.log('[Auth] AUTO-LOGOUT DISABLED (DEV): not logging out for', error?.config?.url);
                } else {
                  console.log('[Auth] triggering logout due to 401 for', error?.config?.url);
                  await logout();
                }
              }
            } catch (e) {
              console.log('[Auth] error during auto-logout handler:', e?.message || e);
            }
          }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, [token]);

  // --- ACTIONS ---
  const register = async (form) => {
    const { data } = await axios.post(
      "https://eduzzleapp-react-native.onrender.com/api/auth/register",
      form
    );
    return data; // will contain userId for VerifyOtp
  };

  const verifyOtp = async (userId, otp) => {
    const { data } = await axios.post(
      "https://eduzzleapp-react-native.onrender.com/api/auth/verify-otp",
      { userId, otp }
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
      "https://eduzzleapp-react-native.onrender.com/api/auth/login",
      { email, password }
    );

    setToken(data.token);
    await AsyncStorage.setItem("token", data.token);
    setUser(data.user || null);
    if (data.user) {
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
    }

    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    try {
      console.log("[Auth] login success, token set (prefix):", String(data.token).slice(0, 12));
    } catch (e) {}

    // Track daily login streak after successful login
    if (data.user?._id) {
      setTimeout(() => trackDailyLogin(), 500);
    }

    return data;
  };

  const logout = async () => {
    console.log('[Auth] logout called');
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("user");
    delete axios.defaults.headers.common["Authorization"];
  };

  const forgotPassword = async (email) => {
    const { data } = await axios.post(
      "https://eduzzleapp-react-native.onrender.com/api/auth/forgot-password",
      { email }
    );
    return data;
  };

  const resetPassword = async (userId, otp, newPassword) => {
    const { data } = await axios.post(
      "https://eduzzleapp-react-native.onrender.com/api/auth/reset-password",
      { userId, otp, newPassword }
    );
    return data;
  };

  // refresh user info from backend
  const refreshUser = async () => {
    try {
      let effectiveToken = token;
      if (!effectiveToken) {
        effectiveToken = await AsyncStorage.getItem("token");
        if (effectiveToken) {
          setToken(effectiveToken);
          axios.defaults.headers.common["Authorization"] = `Bearer ${effectiveToken}`;
        }
      }
      if (!effectiveToken) return;

      const makeRequest = async () =>
        axios.get("https://eduzzleapp-react-native.onrender.com/api/auth/me", {
          headers: { Authorization: `Bearer ${effectiveToken}` },
        });

      let res;
      try {
        res = await makeRequest();
      } catch (e) {
        // Retry once if defaults header missing or transient failure
        axios.defaults.headers.common["Authorization"] = `Bearer ${effectiveToken}`;
        res = await makeRequest();
      }

      const data = res?.data;
      if (data?.user) {
        setUser(data.user);
        await AsyncStorage.setItem("user", JSON.stringify(data.user));
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        console.log("refreshUser: token invalid/expired. Logging out.");
        await logout();
        return;
      }
      console.error("Error refreshing user:", err?.message || err);
    }
  };

  // Track daily login streak
  const trackDailyLogin = async () => {
    try {
      if (!user?._id) return;

      const { data } = await axios.post(
        `https://eduzzleapp-react-native.onrender.com/api/streaks/daily-login/${user._id}`
      );

      if (data?.success) {
        console.log("✅ Daily login streak updated:", data.streak);
        await refreshUser();
      }
    } catch (err) {
      console.error("Error tracking daily login:", err?.message || err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        loading,
        register,
        verifyOtp,
        login,
        logout,
        forgotPassword,
        resetPassword,
        refreshUser,
        trackDailyLogin,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
