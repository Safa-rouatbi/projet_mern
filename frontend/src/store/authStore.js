import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  loading: true, // 🔴 IMPORTANT

  login: (data) => {
    localStorage.setItem("token", data.token);
    set({
      user: data.user,
      token: data.token,
      loading: false
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      user: null,
      token: null,
      loading: false
    });
  },

  // 🔥 LA FONCTION QUI MANQUAIT
  loadUser: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      const res = await api.get("/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      set({
        user: res.data.user,
        token,
        loading: false
      });

    } catch (err) {
      localStorage.removeItem("token");
      set({
        user: null,
        token: null,
        loading: false
      });
    }
  }
}));

export default useAuthStore;
