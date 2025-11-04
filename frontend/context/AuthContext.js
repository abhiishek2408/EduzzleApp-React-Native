// // context/AuthContext.js
// import React, { createContext, useState, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Load saved auth state on app start
//   useEffect(() => {
//     const loadAuth = async () => {
//       try {
//         const savedToken = await AsyncStorage.getItem("token");
//         const savedUser = await AsyncStorage.getItem("user");
//         if (savedToken) {
//           setToken(savedToken);
//           axios.defaults.headers.common[
//             "Authorization"
//           ] = `Bearer ${savedToken}`;
//         }
//         if (savedUser) {
//           setUser(JSON.parse(savedUser));
//         }
//       } catch (err) {
//         console.log("Auth load error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadAuth();
//   }, []);

//   // --- ACTIONS ---

//   const register = async (form) => {
//     const { data } = await axios.post(
//       "https://eduzzleapp-react-native.onrender.com/api/auth/register",
//       form
//     );
//     return data; // will contain userId for VerifyOtpw
//   };

//   const verifyOtp = async (userId, otp) => {
//     const { data } = await axios.post(
//       "https://eduzzleapp-react-native.onrender.com/api/auth/verify-otp",
//       {
//         userId,
//         otp,
//       }
//     );

//     if (data?.token) {
//       setToken(data.token);
//       await AsyncStorage.setItem("token", data.token);
//       setUser(data.user || null);
//       if (data.user) {
//         await AsyncStorage.setItem("user", JSON.stringify(data.user));
//       }
//       axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
//     }
//     return data;
//   };

//   const login = async (email, password) => {
//     const { data } = await axios.post(
//       "https://eduzzleapp-react-native.onrender.com/api/auth/login",
//       {
//         email,
//         password,
//       }
//     );

//     setToken(data.token);
//     await AsyncStorage.setItem("token", data.token);
//     setUser(data.user || null);
//     if (data.user) {
//       await AsyncStorage.setItem("user", JSON.stringify(data.user));
//     }

//     axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
//     return data;
//   };


//   console.log("User context data:", user);


//   const logout = async () => {
//     setUser(null);
//     setToken(null);
//     await AsyncStorage.removeItem("token");
//     await AsyncStorage.removeItem("user");
//     delete axios.defaults.headers.common["Authorization"];
//   };

//   // inside AuthProvider
//   const forgotPassword = async (email) => {
//     const { data } = await axios.post(
//       "https://eduzzleapp-react-native.onrender.com/api/auth/forgot-password",
//       {
//         email,
//       }
//     );
//     return data; // e.g. { message: "OTP sent to email" }
//   };

//   const resetPassword = async (userId, otp, newPassword) => {
//     const { data } = await axios.post(
//       "https://eduzzleapp-react-native.onrender.com/api/auth/reset-password",
//       {
//         userId,
//         otp,
//         newPassword,
//       }
//     );
//     return data; // e.g. { message: "Password reset successful" }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         setUser, 
//         token,
//         loading,
//         register,
//         verifyOtp,
//         login,
//         logout,
//         forgotPassword,
//         resetPassword,
//         isAuthenticated: !!token,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };


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
      "https://eduzzleapp-react-native.onrender.com/api/auth/register",
      form
    );
    return data; // will contain userId for VerifyOtp
  };

  const verifyOtp = async (userId, otp) => {
    const { data } = await axios.post(
      "https://eduzzleapp-react-native.onrender.com/api/auth/verify-otp",
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
      "https://eduzzleapp-react-native.onrender.com/api/auth/login",
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

  //  console.log("User context data:", user);

  const logout = async () => {
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

  // 🔹 NEW: refresh user info from backend
  const refreshUser = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(
        "https://eduzzleapp-react-native.onrender.com/api/auth/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("🔹 refreshUser fetched:", data.user);
      setUser(data);
      await AsyncStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error("Error refreshing user:", err);
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
        refreshUser, // ✅ added here
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
