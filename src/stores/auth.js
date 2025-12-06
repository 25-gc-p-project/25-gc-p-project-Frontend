import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginApi } from "api/auth";
import { setAuthToken } from "api/client";
import { fetchUserProfile, updateUserProfile } from "api/user";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isLoading: false,

      login: async ({ id, password }) => {
        try {
          set({ isLoading: true });

          const res = await loginApi({ username: id, password });
          const token = res.data.accessToken;

          setAuthToken(token);
          localStorage.setItem("accessToken", token);

          set({ accessToken: token });

          const profileRes = await fetchUserProfile();

          set({
            user: profileRes.data,
            isLoading: false,
          });

          return profileRes.data;
        } catch (err) {
          console.error(err);
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        set({ user: null, accessToken: null });
        setAuthToken(null);
        localStorage.removeItem("accessToken");
      },

      updateProfile: async (payload) => {
        set({ isLoading: true });

        try {
          const state = get();
          const currentUser = state.user;

          if (!currentUser) {
            set({ isLoading: false });
            throw new Error("로그인 상태가 아닙니다.");
          }

          const wantsChangePw = payload.passwordUpdateRequested;
          const newPassword = wantsChangePw ? payload.newPassword : undefined;

          const requestBody = {
            username: currentUser.username || payload.id,
            password: newPassword,
            name: payload.name,
            phone: payload.phone,
            birthDate: payload.birth,
            city: currentUser.city || "",
            street: payload.address,
            zipcode: currentUser.zipcode || "",
          };

          await updateUserProfile(requestBody);

          const refreshed = await fetchUserProfile();

          set({
            user: refreshed.data,
            isLoading: false,
          });

          return refreshed.data;
        } catch (err) {
          console.error("updateProfile error:", err);
          set({ isLoading: false });
          throw err;
        }
      },

      updateHealth: (payload) => {
        set((state) => {
          if (!state.user) return state;

          const prevHealth = state.user.health || {
            allergies: [],
            diseases: [],
            effects: [],
            customEffects: [],
          };

          return {
            user: {
              ...state.user,
              health: {
                ...prevHealth,
                ...payload,
              },
            },
          };
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
