export const validateName = (value) => {
  if (!value.trim()) return "이름은 필수 입력입니다.";
  if (value.length < 2) return "이름은 최소 2자 이상이어야 합니다.";
  if (value.length >= 20) return "이름은 최대 20자까지 가능합니다.";
  if (/^\d+$/.test(value)) return "이름은 숫자로만 구성될 수 없습니다.";
  return undefined;
};

export const validateId = (value) => {
  if (!value.trim()) return "아이디는 필수 입력입니다.";
  if (value.length < 4) return "아이디는 최소 4자 이상이어야 합니다.";
  if (!/^[a-zA-Z0-9._]+$/.test(value))
    return "아이디는 영문, 숫자, 마침표, 밑줄만 사용할 수 있습니다.";
  return undefined;
};

export const validatePhone = (value) => {
  if (!value.trim()) return "전화번호는 필수 입력입니다.";
  const phoneRegex = /^01[0-9]-\d{3,4}-\d{4}$/;
  if (!phoneRegex.test(value))
    return "전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)";
  return null;
};

export const validateAddress = (value) => {
  if (!value.trim()) return "주소는 필수 입력입니다.";
  if (value.trim().length < 5) return "좀 더 자세한 주소를 입력해주세요.";
  return null;
};

export const validateBirth = (value) => {
  if (!value.trim()) return "생년월일은 필수입력입니다.";
  const birthRegex =
    /^(19[0-9]{2}|20[0-2][0-9])-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
  if (!birthRegex.test(value))
    return "생년월일 형식을 확인해주세요. (예: 2000-01-01)";
  return null;
};

export const validatePassword = (value) => {
  if (!value.trim()) return "비밀번호는 필수 입력입니다.";
  if (value.length < 8) return "비밀번호는 최소 8자 이상이어야 합니다.";

  const hasNumber = /[0-9]/.test(value);
  const hasLetter = /[A-Za-z]/.test(value);
  const hasSpecialChar = /[!@#$%^&*]/.test(value);

  if (!hasNumber || !hasLetter || !hasSpecialChar) {
    return "비밀번호는 숫자, 영문, 특수문자를 모두 포함해야 합니다.";
  }

  return undefined;
};

export const validateConfirmPassword = (value, password) => {
  if (!value.trim()) return "비밀번호 확인을 입력해주세요.";

  if (value !== password) return "비밀번호가 일치하지 않습니다.";

  return undefined;
};
