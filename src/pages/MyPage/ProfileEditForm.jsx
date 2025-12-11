import { useState, useCallback, useEffect } from "react";
import InputField from "components/InputField";
import Button from "components/Button";
import {
  validateName,
  validatePhone,
  validateAddress,
  validateBirth,
  validatePassword,
  validateConfirmPassword,
} from "utils/formValidators";
import { useAuthStore } from "stores/auth";

export default function ProfileEditForm({ defaultUser, onCancel, onSaved }) {
  const safeId = defaultUser.username ?? defaultUser.id ?? "";
  const safeName = defaultUser.name ?? "";
  const safePhone = defaultUser.phone ?? "";

  let safeAddress = "";

  if (typeof defaultUser.address === "string") {
    safeAddress = defaultUser.address;
  } else if (defaultUser.address && typeof defaultUser.address === "object") {
    safeAddress = defaultUser.address.street || "";
  } else {
    safeAddress = defaultUser.street || "";
  }

  let safeBirth = defaultUser.birth ?? defaultUser.birthDate ?? "";
  if (safeBirth && safeBirth.includes("T")) {
    safeBirth = safeBirth.split("T")[0];
  }

  const [formData, setFormData] = useState({
    id: safeId,
    name: safeName,
    phone: safePhone,
    address: safeAddress,
    birth: safeBirth,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isValidated, setIsValidated] = useState(false);

  const validateForm = useCallback(() => {
    const nameError = validateName(formData.name.trim()) || "";
    const phoneError = validatePhone(formData.phone.trim()) || "";
    const addressError = validateAddress(formData.address.trim()) || "";
    const birthError = validateBirth(formData.birth.trim()) || "";

    const hasCurrent = !!formData.currentPassword.trim();
    const hasNew = !!formData.newPassword.trim();
    const hasConfirm = !!formData.confirmPassword.trim();
    const wantsChangePw = hasCurrent || hasNew || hasConfirm;

    let currentPwError = "";
    let newPwError = "";
    let confirmPwError = "";

    if (wantsChangePw) {
      if (!hasCurrent) currentPwError = "현재 비밀번호를 입력해주세요.";

      if (!hasNew) {
        newPwError = "새 비밀번호를 입력해주세요.";
      } else {
        newPwError = validatePassword(formData.newPassword.trim()) || "";
      }

      if (!hasConfirm) {
        confirmPwError = "비밀번호 확인을 입력해주세요.";
      } else {
        confirmPwError =
          validateConfirmPassword(
            formData.confirmPassword.trim(),
            formData.newPassword.trim()
          ) || "";
      }
    }

    const hasError = [
      nameError,
      phoneError,
      addressError,
      birthError,
      currentPwError,
      newPwError,
      confirmPwError,
    ].some(Boolean);

    setIsValidated(!hasError);
  }, [formData]);

  useEffect(() => {
    validateForm();
  }, [validateForm]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValidated) return;

    const wantsChangePw =
      !!formData.newPassword.trim() || !!formData.confirmPassword.trim();

    const payload = {
      id: formData.id,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      birth: formData.birth.trim(),
      passwordUpdateRequested: wantsChangePw,
      ...(wantsChangePw && {
        currentPassword: formData.currentPassword.trim(),
        newPassword: formData.newPassword.trim(),
        confirmPassword: formData.confirmPassword.trim(),
      }),
    };

    try {
      await useAuthStore.getState().updateProfile(payload);
      onSaved?.();
    } catch (err) {
      alert(err?.response?.data?.message || "프로필 수정에 실패했어요.");
    }
  };

  return (
    <section className="mb-8 w-full max-w-[840px] rounded-md border border-gray-200 bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="id">아이디</label>
          <InputField
            id="id"
            type="text"
            value={formData.id}
            state="default-disabled"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="name">이름</label>
          <InputField
            id="name"
            type="text"
            placeholder="이름을 입력해주세요."
            value={formData.name}
            onChange={handleChange}
            validator={validateName}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="phone">전화번호</label>
          <InputField
            id="phone"
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
            type="text"
            placeholder="주소를 입력해주세요."
            value={formData.address}
            onChange={handleChange}
            validator={validateAddress}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="birth">생년월일</label>
          <InputField
            id="birth"
            type="text"
            placeholder="연도-월-일 (예: 2000-01-01)"
            value={formData.birth}
            onChange={handleChange}
            validator={validateBirth}
          />
        </div>

        <div className="mt-4 space-y-4 border-t pt-4">
          <p className="text-sm text-gray-600">
            비밀번호를 변경하지 않으려면 아래 입력란을 비워두세요.
          </p>

          <div className="space-y-2">
            <label htmlFor="currentPassword">현재 비밀번호</label>
            <InputField
              id="currentPassword"
              type="password"
              placeholder="현재 비밀번호를 입력해주세요."
              value={formData.currentPassword}
              onChange={handleChange}
              isPassword
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="newPassword">새 비밀번호</label>
            <InputField
              id="newPassword"
              type="password"
              placeholder="새 비밀번호를 입력해주세요."
              value={formData.newPassword}
              onChange={handleChange}
              validator={(v) => (v.trim() ? validatePassword(v) : undefined)}
              isPassword
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword">새 비밀번호 확인</label>
            <InputField
              id="confirmPassword"
              type="password"
              placeholder="새 비밀번호를 다시 한 번 입력해주세요."
              value={formData.confirmPassword}
              onChange={handleChange}
              validator={(v) =>
                v.trim()
                  ? validateConfirmPassword(v, formData.newPassword)
                  : undefined
              }
              isPassword
            />
          </div>
        </div>

        <div className="flex w-full gap-3 pt-2">
          <Button
            type="button"
            variant="blue"
            mode="outlined"
            className="flex w-full h-12 items-center justify-center"
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="blue"
            className="flex w-full h-12 items-center justify-center"
            disabled={!isValidated}
          >
            저장
          </Button>
        </div>
      </form>
    </section>
  );
}
