import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "stores/auth";
import ProfileEdit from "./ProfileEdit";
import OrderHistory from "./OrderHistory";
import HealthSettings from "./HealthSettings";
import DeleteSection from "./DeleteSection";

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

  // TODO: 임시 헬스 저장 로직 후에 삭제할 수도
  const handleSaveHealth = (payload) => {
    updateHealth(payload);
  };

  const initialHealth = user?.health || {
    allergies: [],
    diseases: [],
    effects: [],
    customEffects: [],
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
