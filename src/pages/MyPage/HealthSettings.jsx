import { useState } from "react";
import Button from "components/Button";
import {
  ALLERGY_OPTIONS,
  DISEASE_OPTIONS,
  EFFECT_OPTIONS,
} from "constants/Health";

export default function HealthSettings({
  initialValues = {
    allergies: [],
    diseases: [],
    effects: [],
    customEffects: [],
  },
  onSave,
}) {
  const [allergies, setAllergies] = useState(initialValues.allergies);
  const [diseases, setDiseases] = useState(initialValues.diseases);
  const [effects, setEffects] = useState(initialValues.effects);
  const [customEffects, setCustomEffects] = useState(
    initialValues.customEffects
  );
  const [customEffect, setCustomEffect] = useState("");

  const toggleItem = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value));
    } else {
      setList([...list, value]);
    }
  };

  const handleAddEffect = () => {
    const trimmed = customEffect.trim();
    if (!trimmed) return;

    if (customEffects.includes(trimmed)) {
      setCustomEffect("");
      return;
    }

    setCustomEffects((prev) => [...prev, trimmed]);
    setCustomEffect("");
  };

  const handleRemoveCustomEffect = (value) => {
    setCustomEffects((prev) => prev.filter((item) => item !== value));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      allergies,
      diseases,
      effects,
      customEffects,
    };
    onSave?.(payload);
  };

  return (
    <section className="w-full max-w-[840px] rounded-md border border-gray-200 bg-white p-6 shadow-sm mb-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <header className="flex items-start gap-2">
          <div>
            <h2 className="text-lg font-semibold">건강정보설정</h2>
            <p className="mt-1 text-sm text-gray-500">
              알레르기나 지병이 있다면 선택해주세요. 맞춤상품을 추천해드립니다.
            </p>
          </div>
        </header>

        <div className="space-y-3">
          <p className="font-semibold text-gray-800">알레르기</p>
          <div className="flex flex-wrap gap-2">
            {ALLERGY_OPTIONS.map((item) => {
              const isActive = allergies.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleItem(item, allergies, setAllergies)}
                  className={
                    "rounded-full border px-3 py-1 text-xs sm:text-sm " +
                    (isActive
                      ? "border-brandBlue bg-brandBlue text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50")
                  }
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-gray-800">지병 및 질환</p>
          <div className="flex flex-wrap gap-2">
            {DISEASE_OPTIONS.map((item) => {
              const isActive = diseases.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleItem(item, diseases, setDiseases)}
                  className={
                    "rounded-full border px-3 py-1 text-xs sm:text-sm " +
                    (isActive
                      ? "border-brandBlue bg-brandBlue text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50")
                  }
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          <p className="font-semibold text-gray-800">섭취 시 기대 효과</p>

          <div className="flex flex-wrap gap-2 mb-10">
            {EFFECT_OPTIONS.map((item) => {
              const isActive = effects.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleItem(item, effects, setEffects)}
                  className={
                    "rounded-full border px-3 py-1 text-xs sm:text-sm " +
                    (isActive
                      ? "border-brandBlue bg-brandBlue text-white"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50")
                  }
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="추가로 기대하는 내용을 입력해주세요."
              value={customEffect}
              onChange={(e) => setCustomEffect(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brandBlue focus:ring-1 focus:ring-brandBlue"
            />
            <Button
              type="button"
              variant="blue"
              width={80}
              className="mt-1 py-2 text-sm sm:mt-0 sm:w-auto sm:px-6"
              onClick={handleAddEffect}
              disabled={!customEffect.trim()}
            >
              추가
            </Button>
          </div>

          {customEffects.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {customEffects.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleRemoveCustomEffect(item)}
                  className="flex items-center gap-1 rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs sm:text-sm text-gray-700 hover:bg-gray-100"
                >
                  <span>{item}</span>
                  <span className="text-gray-400">✕</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            variant="blue"
            className="w-full h-12 py-3 text-sm sm:text-base font-semibold"
          >
            설정 저장
          </Button>
        </div>
      </form>
    </section>
  );
}
