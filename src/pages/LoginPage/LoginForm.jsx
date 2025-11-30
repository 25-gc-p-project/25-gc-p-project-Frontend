import { useCallback, useEffect, useState } from "react";
import InputField from "components/InputField";
import Button from "components/Button";
import {
  validateEmail as validateId,
  validatePassword,
} from "utils/formValidators";
import { useNavigate } from "react-router-dom";

export default function LoginForm({
  onSubmit,
  initialFormData = {
    id: "",
    password: "",
  },
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [isValidated, setIsValidated] = useState(false);
  const navigate = useNavigate();

  const validateForm = useCallback(() => {
    const newErrors = {
      id: validateId(formData.id.trim()) || "",
      password: validatePassword(formData.password.trim()) || "",
    };
    setIsValidated(!Object.values(newErrors).some((error) => error));
  }, [formData]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidated) onSubmit(formData);
  };

  const handleSignupClick = () => {
    navigate("/signup");
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-8 bg-transparent font-medium"
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <label htmlFor="id">아이디</label>
            <InputField
              id="id"
              type="id"
              placeholder="아이디를 입력해주세요."
              value={formData.id}
              onChange={handleChange}
              validator={validateId}
            />
          </div>

          <div className="space-y-3">
            <label htmlFor="password">비밀번호</label>
            <InputField
              id="password"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={formData.password}
              onChange={handleChange}
              validator={validatePassword}
              isPassword={true}
            />
          </div>
        </div>

        <Button
          type="submit"
          variant="blue"
          className="w-full h-12 py-3.5 text-md"
          disabled={!isValidated}
        >
          로그인
        </Button>

        <Button
          type="button"
          variant="blue"
          className="w-full h-12 py-3.5 text-md"
          mode="outlined"
          onClick={handleSignupClick}
        >
          회원가입
        </Button>
      </form>
    </>
  );
}
