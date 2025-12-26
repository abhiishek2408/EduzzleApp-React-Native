import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://eduzzleapp-react-native.onrender.com/api",
  withCredentials: false,
});

export default API;

// Helpers
export async function isFriend(userId, otherId) {
  if (!userId || !otherId) return false;
  try {
    const { data } = await API.get(`/friends/is-friend/${userId}/${otherId}`);
    return !!data?.isFriend;
  } catch (e) {
    return false;
  }
}
