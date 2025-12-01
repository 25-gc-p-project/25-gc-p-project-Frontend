import Button from "components/Button";
import { mockOrders } from "mocks/orders";
import { ReactComponent as CommentIcon } from "assets/icons/comment.svg";
import { useState } from "react";
import ReviewModal from "./ReviewModal";
import OrderItemSection from "./OrderItemSection";

export default function OrderHistory() {
  const orders = mockOrders; // Todo: api 연동
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [reviewedOrderIds, setReviewedOrderIds] = useState([]);

  const handleOpenReview = (order) => {
    setSelectedOrder(order);
  };

  const handleCloseReview = () => {
    setSelectedOrder(null);
  };

  const handleSubmitReview = async (payload) => {
    console.log("review submit", payload);
    // TODO: 리뷰 api 연동
    setReviewedOrderIds((prev) =>
      prev.includes(payload.orderId) ? prev : [...prev, payload.orderId]
    );
  };

  if (!orders || orders.length === 0) {
    return (
      <section className="w-full max-w-[840px] rounded-md border border-gray-200 bg-white p-6 shadow-sm mb-8">
        <h2 className="mb-4 text-lg font-semibold">주문 내역</h2>
        <div className="py-20 text-center text-gray-500">
          주문 내역이 없습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-[840px] rounded-md border border-gray-200 bg-white p-6 shadow-sm mb-8">
      <h2 className="mb-4 text-lg font-semibold">주문 내역</h2>

      <div className="space-y-4">
        {orders.map((order) => {
          const isReviewed = reviewedOrderIds.includes(order.orderId);

          return (
            <div
              key={order.orderId}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md"
            >
              <OrderItemSection order={order} />

              <div className="mt-4 flex items-center justify-between border-t pt-3">
                <Button
                  variant="green"
                  onClick={() => handleOpenReview(order)}
                  className="mr-3 sm:mr-8 flex-1 items-center gap-1 px-4 py-2 text-sm sm:text-lg text-white"
                  disabled={isReviewed}
                >
                  {isReviewed ? (
                    "리뷰 작성 완료"
                  ) : (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <CommentIcon />
                      리뷰 작성하기
                    </div>
                  )}
                </Button>

                <p className="font-semibold text-lg text-brandGreen">
                  총 {order.totalPrice.toLocaleString()}원
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <ReviewModal
        isOpen={!!selectedOrder}
        order={selectedOrder}
        onClose={handleCloseReview}
        onSubmit={handleSubmitReview}
      />
    </section>
  );
}
