import { useCallback, useEffect, useState } from "react";
import InputField from "components/InputField";
import Button from "components/Button";
import {
  validateName,
  validateId,
  validatePhone,
  validateAddress,
  validateBirth,
  validatePassword,
  validateConfirmPassword,
} from "utils/formValidators";

export default function SignupForm({
  onSubmit,
  initialFormData = {
    name: "",
    id: "",
    phone: "",
    address: "",
    birth: "",
    password: "",
    passwordConfirm: "",
  },
}) {
  const [formData, setFormData] = useState(initialFormData);
  const [isValidated, setIsValidated] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isPrivacyChecked, setIsPrivacyChecked] = useState(false);

  const validateForm = useCallback(() => {
    const errors = {
      name: validateName(formData.name.trim()),
      id: validateId(formData.id.trim()),
      phone: validatePhone(formData.phone.trim()),
      address: validateAddress(formData.address.trim()),
      birth: validateBirth(formData.birth.trim()),
      password: validatePassword(formData.password.trim()),
      passwordConfirm: validateConfirmPassword(
        formData.passwordConfirm.trim(),
        formData.password.trim()
      ),
    };

    const hasFieldError = Object.values(errors).some((e) => e);
    const hasAgreementError = !(isTermsChecked && isPrivacyChecked);

    setIsValidated(!hasFieldError && !hasAgreementError);
  }, [formData, isTermsChecked, isPrivacyChecked]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValidated) return;
    onSubmit(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 bg-transparent font-medium"
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name">이름</label>
          <InputField
            id="name"
            name="name"
            type="text"
            placeholder="이름을 입력해주세요"
            value={formData.name}
            onChange={handleChange}
            validator={validateName}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="id">아이디</label>
          <InputField
            id="id"
            name="id"
            type="text"
            placeholder="아이디를 입력해주세요"
            value={formData.id}
            onChange={handleChange}
            validator={validateId}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone">전화번호</label>
          <InputField
            id="phone"
            name="phone"
            type="text"
            placeholder="010-1234-5678"
            value={formData.phone}
            onChange={handleChange}
            validator={validatePhone}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="address">주소</label>
          <InputField
            id="address"
            name="address"
            type="text"
            placeholder="주소를 입력해주세요"
            value={formData.address}
            onChange={handleChange}
            validator={validateAddress}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="birth">생년월일</label>
          <InputField
            id="birth"
            name="birth"
            type="text"
            placeholder="연도-월-일"
            value={formData.birth}
            onChange={handleChange}
            validator={validateBirth}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password">비밀번호</label>
          <InputField
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={formData.password}
            onChange={handleChange}
            validator={validatePassword}
            isPassword={true}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="passwordConfirm">비밀번호 확인</label>
          <InputField
            id="passwordConfirm"
            name="passwordConfirm"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            value={formData.passwordConfirm}
            onChange={handleChange}
            validator={(v) => validateConfirmPassword(v, formData.password)}
            isPassword={true}
          />
        </div>
      </div>

      <div className="space-y-2 font-normal text-base">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isTermsChecked}
            className="w-4 h-4"
            onChange={(e) => setIsTermsChecked(e.target.checked)}
          />
          <p>
            <span className="text-brandBlue">[필수]</span>{" "}
            <span className="font-medium">이용약관</span>에 동의합니다.
          </p>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isPrivacyChecked}
            className="w-4 h-4"
            onChange={(e) => setIsPrivacyChecked(e.target.checked)}
          />
          <p>
            <span className="text-brandBlue">[필수]</span>{" "}
            <span className="font-medium">개인정보 처리방침</span>에 동의합니다.
          </p>
        </label>
      </div>

      <Button
        type="submit"
        variant="blue"
        mode="filled"
        className="w-full h-12 py-3.5 text-md"
        disabled={!isValidated}
      >
        회원가입
      </Button>
    </form>
  );
}
