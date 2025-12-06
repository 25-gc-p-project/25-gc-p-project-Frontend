import { create } from "zustand";
import { demoId, demoPassword, demoUser } from "mocks/user";
import { loginApi } from "api/auth";

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,

  login: async ({ id, password }) => {
    set({ isLoading: true });

    if (id === demoId && password === demoPassword) {
      await new Promise((resolve) => setTimeout(resolve, 400));

      set({ user: demoUser, isLoading: false });
      return demoUser;
    }

    try {
      const response = await loginApi({
        username: id.trim(),
        password,
      });

      const data = response.data;

      const user = data.user || data;

      set({
        user,
        isLoading: false,
      });

      return user;
    } catch (err) {
      console.error("login error:", err);
      set({ isLoading: false });

      if (!err.response) {
        const error = new Error("로그인에 실패했어요.");
        throw error;
      }

      throw err;
    }
  },

  logout: () => {
    set({ user: null });
  },

  updateProfile: async (payload) => {
    set({ isLoading: true });

    await new Promise((resolve) => setTimeout(resolve, 400));

    const currentUser = get().user;

    if (!currentUser) {
      set({ isLoading: false });
      throw new Error("로그인 상태가 아닙니다.");
    }

    if (payload.passwordUpdateRequested) {
      if (payload.currentPassword !== demoPassword) {
        set({ isLoading: false });

        const error = new Error("비밀번호가 올바르지 않습니다.");
        error.response = {
          data: { message: "현재 비밀번호가 올바르지 않습니다." },
        };
        throw error;
      }
    }

    const updatedUser = {
      ...currentUser,
      name: payload.name,
      phone: payload.phone,
      address: payload.address,
      birth: payload.birth,
    };

    set({
      user: updatedUser,
      isLoading: false,
    });

    return updatedUser;
  },

  // TODO: 임시 건강정보 설정 후에 삭제할 수도 있는 코드
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
}));
