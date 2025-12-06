import { useNavigate } from "react-router-dom";
import SignupForm from "./SignupForm";
import { signupApi } from "api/auth";

export default function SignupPage() {
  const navigate = useNavigate();

  const handleSignup = async (formData) => {
    try {
      await signupApi({
        username: formData.id.trim(),
        password: formData.password.trim(),
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        birthDate: formData.birth.trim(),
        city: "",
        street: formData.address.trim(),
        zipcode: "",
      });

      alert("회원가입이 완료되었습니다. 로그인 해주세요.");
      navigate("/login");
    } catch (err) {
      console.error("signup error:", err);
      const msg =
        err?.response?.data?.message ||
        "회원가입에 실패했습니다. 다시 시도해주세요.";
      alert(msg);
    }
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
