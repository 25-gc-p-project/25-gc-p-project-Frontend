import { useNavigate } from "react-router-dom";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  const navigate = useNavigate();

  const handleSignup = async (formData) => {
    // TODO: 나중에 회원가입 API
    console.log("signup form:", formData);

    // 임시 동작: 회원가입 완료 후 로그인 페이지로 이동
    alert("회원가입이 완료되었습니다. 로그인 해주세요.");
    navigate("/login");
  };

  const handleGoLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-4 my-10 w-full max-w-[640px] rounded-3xl bg-white px-8 py-10 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-bold">회원가입</h1>

        <SignupForm onSubmit={handleSignup} />

        <p className="mt-6 text-center text-sm">
          이미 회원이신가요?{" "}
          <button
            type="button"
            onClick={handleGoLogin}
            className="font-semibold text-blue-500 hover:underline"
          >
            로그인
          </button>
        </p>
      </div>
    </div>
  );
}
