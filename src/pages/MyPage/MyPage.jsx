import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "stores/auth";
import ProfileEdit from "./ProfileEdit";
import OrderHistory from "./OrderHistory";
import HealthSettings from "./HealthSettings";
import DeleteSection from "./DeleteSection";
import { updateUserHealth } from "api/user";

export default function MyPage() {
  const { user, updateHealth } = useAuthStore();
  const nav = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      const t = setTimeout(() => nav("/", { replace: true }), 1000);
      return () => clearTimeout(t);
    }
    setChecking(false);
  }, [user, nav]);

  const handleDeleteAccount = async () => {
    console.log("탈퇴 요청 보내기...");
    // TODO: delete API 호출 후
    // logout();
    // navigate("/");
  };

  const handleSaveHealth = async (payload) => {
    try {
      await updateUserHealth(payload);

      updateHealth(payload);
    } catch (err) {
      console.error("건강 정보 저장 오류:", err);
      alert(
        err?.response?.data?.message || "건강 정보 설정 저장에 실패했어요."
      );
    }
  };

  const initialHealth = {
    allergies: user?.health?.allergies ?? user?.allergies ?? [],
    diseases: user?.health?.diseases ?? user?.diseases ?? [],
    effects: user?.health?.effects ?? user?.healthGoals ?? [],
    customEffects: user?.health?.customEffects ?? [],
  };

  if (checking) {
    return (
      <div className="bg-gray-50 min-h-screen px-4 py-8 flex items-center justify-center">
        <span className="text-gray-500 animate-pulse">
          로그인 상태를 확인하는 중…
        </span>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 flex flex-col items-center">
      <OrderHistory />
      <ProfileEdit />
      <HealthSettings initialValues={initialHealth} onSave={handleSaveHealth} />
      <DeleteSection onDelete={handleDeleteAccount} />
    </div>
  );
}
