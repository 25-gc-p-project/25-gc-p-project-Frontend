import { useState, useEffect } from 'react';
import Modal, { ModalFooter } from 'components/Modal/Modal';
import Button from 'components/Button';
import OrderItemSection from './OrderItemSection';

const scoreToRatingEnum = (score) => {
  if (score >= 4) return 'GOOD';
  if (score === 3) return 'AVERAGE';
  return 'BAD';
};

export default function ReviewModal({
  isOpen,
  order,
  productId,
  onClose,
  onSubmit,
}) {
  const [score, setScore] = useState(0);
  const [hoverScore, setHoverScore] = useState(0);
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setScore(0);
      setHoverScore(0);
      setContent('');
      setSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !score || !content.trim()) return;

    const payload = {
      productId,
      score,
      rating: scoreToRatingEnum(score),
      content: content.trim(),
    };

    try {
      setSubmitting(true);
      await onSubmit?.(payload);
      onClose?.();
    } catch (err) {
      alert(err?.response?.data?.message || '리뷰 등록에 실패했어요.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayScore = hoverScore || score;

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
              const isActive = starValue <= displayScore;

              return (
                <button
                  key={starValue}
                  type="button"
                  onClick={() => setScore(starValue)}
                  onMouseEnter={() => setHoverScore(starValue)}
                  onMouseLeave={() => setHoverScore(0)}
                  className="cursor-pointer"
                >
                  <span
                    className={isActive ? 'text-yellow-400' : 'text-gray-300'}
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
              disabled={submitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="green"
              mode="filled"
              className="w-full h-10 py-2 text-sm"
              disabled={!productId || !score || !content.trim() || submitting}
            >
              {submitting ? '등록 중...' : '등록'}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
}
