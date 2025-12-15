import Button from "components/Button";

export default function ReviewList({
  reviews = [],
  loading = false,
  myReviewIdSet = new Set(),
  editingId,
  editContent,
  editScore,
  saving = false,
  deletingId = null,
  onStartEdit,
  onCancelEdit,
  onChangeContent,
  onChangeScore,
  onSave,
  onDelete,
}) {
  if (loading)
    return <p className="text-sm text-gray-500">리뷰를 불러오는 중입니다.</p>;

  if (!reviews || reviews.length === 0)
    return (
      <p className="text-sm text-gray-500">아직 작성된 리뷰가 없습니다.</p>
    );

  return (
    <ul className="space-y-4">
      {reviews.map((r) => {
        const isMine = myReviewIdSet.has(r.id);
        const createdAt = r.createdAt
          ? new Date(r.createdAt).toLocaleDateString()
          : "";

        return (
          <li key={r.id} className="bg-white p-4 rounded-lg border">
            <div className="flex justify-between text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{r.authorName ?? "익명"}</span>
                <span className="text-yellow-400">★ {r.score ?? "-"}</span>

                {r.rating && (
                  <span className="rounded-xl bg-brandBlue/80 px-2 py-0.5 text-xs text-white">
                    {r.rating}
                  </span>
                )}
                {isMine && (
                  <span className="ml-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs text-brandBlue">
                    내 리뷰
                  </span>
                )}
              </div>

              <span className="text-gray-400">{createdAt}</span>
            </div>

            {editingId === r.id ? (
              <div className="mt-3 space-y-3">
                <textarea
                  className="w-full min-h-[90px] rounded-md border p-3 text-sm"
                  value={editContent}
                  onChange={(e) => onChangeContent(e.target.value)}
                  placeholder="리뷰 내용을 입력하세요"
                />

                <div className="flex flex-wrap gap-3 items-center">
                  <label className="text-sm text-gray-600">
                    점수
                    <select
                      className="ml-2 rounded-md border p-2 text-sm"
                      value={editScore}
                      onChange={(e) => onChangeScore(e.target.value)}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="ml-auto flex gap-2">
                    <Button
                      mode="outlined"
                      className="px-3 py-2 text-sm"
                      onClick={onCancelEdit}
                      disabled={saving}
                    >
                      취소
                    </Button>
                    <Button
                      variant="green"
                      mode="filled"
                      className="px-3 py-2 text-sm"
                      onClick={() => onSave(r.id)}
                      disabled={saving || !editContent.trim()}
                    >
                      {saving ? "저장 중..." : "저장"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="mt-2">{r.content}</p>

                {Array.isArray(r.images) && r.images.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {r.images.map((url, idx) => (
                      <img
                        key={`${r.id}-img-${idx}`}
                        src={url}
                        alt="리뷰 이미지"
                        className="h-20 w-20 rounded-lg object-cover border"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}

                {isMine && (
                  <div className="mt-3 flex justify-end gap-2">
                    <Button
                      className="px-3 py-2 text-sm"
                      onClick={() => onStartEdit(r)}
                    >
                      수정
                    </Button>
                    <Button
                      mode="outlined"
                      className="px-3 py-2 text-sm"
                      onClick={() => onDelete(r.id)}
                      disabled={deletingId === r.id}
                    >
                      {deletingId === r.id ? "삭제 중..." : "삭제"}
                    </Button>
                  </div>
                )}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}
