import Button from "components/Button";

export default function DeleteSection({ onDelete }) {
  const handleClick = () => {
    const ok = window.confirm(
      "정말 회원탈퇴 하시겠습니까?\n탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다."
    );
    if (!ok) return;

    onDelete?.();
    // TODO:  API 호출
  };

  return (
    <section className="w-full max-w-[840px] rounded-md border border-gray-200 bg-white p-6 shadow-sm mb-8">
      <h2 className="text-sm font-semibold text-red-500">위험 영역</h2>
      <p className="mt-2 text-sm text-gray-500">
        회원탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
      </p>

      <div className="mt-6">
        <Button
          type="button"
          variant="danger"
          mode="outlined"
          className="px-6 py-2 text-sm font-medium"
          onClick={handleClick}
        >
          회원탈퇴
        </Button>
      </div>
    </section>
  );
}
