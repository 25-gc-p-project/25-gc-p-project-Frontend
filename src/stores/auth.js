import { create } from "zustand";
import { demoId, demoPassword, demoUser } from "mocks/user";

export const useAuthStore = create((set, get) => ({
  user: null,
  isLoading: false,

  // Todo: api 연동

  login: async ({ id, password }) => {
    set({ isLoading: true });

    await new Promise((resolve) => setTimeout(resolve, 400));

    if (id === demoId && password === demoPassword) {
      set({ user: demoUser, isLoading: false });
      return demoUser;
    }

    set({ isLoading: false });

    const error = new Error("로그인에 실패했어요.");
    error.response = {
      data: { message: "아이디 또는 비밀번호가 올바르지 않습니다." },
    };
    throw error;
  },

  logout: () => {
    set({ user: null });
  },
}));
