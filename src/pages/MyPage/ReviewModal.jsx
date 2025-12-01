import { useState, useEffect } from "react";
import Modal, { ModalFooter } from "components/Modal/Modal";
import Button from "components/Button";
import OrderItemSection from "./OrderItemSection";

export default function ReviewModal({ isOpen, order, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHoverRating(0);
      setContent("");
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !content.trim()) return;

    const payload = {
      orderId: order?.orderId,
      rating,
      content: content.trim(),
    };

    try {
      await onSubmit?.(payload);
      onClose?.();
    } catch (err) {
      alert(err?.response?.data?.message || "리뷰 등록에 실패했어요.");
    }
  };

  const displayRating = hoverRating || rating;

  return (
    <Modal
      isOpen={isOpen}
      hasCloseButton={false}
      title="리뷰 작성"
      onClose={onClose}
      containerStyle={{ maxWidth: 480 }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {order && (
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-4">
            <OrderItemSection order={order} compact />
          </div>
        )}

        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-800">평점</p>
          <div className="flex items-center gap-1 text-2xl">
            {Array.from({ length: 5 }).map((_, index) => {
              const starValue = index + 1;
              const isActive = starValue <= displayRating;
              return (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="cursor-pointer"
                >
                  <span
                    className={isActive ? "text-yellow-400" : "text-gray-300"}
                  >
                    ★
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-800">리뷰 내용</p>
          <textarea
            className="h-40 w-full resize-none rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-brandGreen focus:ring-1 focus:ring-brandGreen"
            placeholder="상품에 대한 솔직한 내용을 적어주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <ModalFooter>
          <div className="flex w-full gap-2">
            <Button
              type="button"
              variant="green"
              mode="outlined"
              className="w-full h-10 py-2 text-sm"
              onClick={onClose}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="green"
              mode="filled"
              className="w-full h-10 py-2 text-sm"
              disabled={!rating || !content.trim()}
            >
              등록
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
