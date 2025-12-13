import Button from 'components/Button';
import { ReactComponent as CommentIcon } from 'assets/icons/comment.svg';
import { useEffect, useState } from 'react';
import ReviewModal from './ReviewModal';
import OrderItemSection from './OrderItemSection';
import { fetchOrders, cancelOrder } from 'api/order';
import { fetchProductDetail } from 'api/product';
import { fetchMyReviews, createReview } from 'api/review';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const [myReviewedProductIdSet, setMyReviewedProductIdSet] = useState(
    new Set()
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await fetchOrders();
        const raw = Array.isArray(data) ? data : data.content ?? [];

        const allItems = raw.flatMap((o) => o.orderItems ?? o.items ?? []);
        const productIds = [
          ...new Set(
            allItems.map((i) => i.productId).filter((id) => id != null)
          ),
        ];

        const productList = await Promise.all(
          productIds.map(async (pid) => {
            try {
              const product = await fetchProductDetail(pid);
              return [pid, product];
            } catch (e) {
              console.error('상품 상세 조회 실패', pid, e);
              return [pid, null];
            }
          })
        );

        const productMap = new Map(productList.filter(([, p]) => p));

        const normalized = raw.map((order) => {
          const items = (order.orderItems ?? order.items ?? []).map((item) => {
            const product = productMap.get(item.productId);

            return {
              ...item,
              product,
              imageUrl: item.imageUrl ?? product?.imageUrl,
            };
          });

          const totalPrice =
            typeof order.totalPrice === 'number'
              ? order.totalPrice
              : items.reduce(
                  (sum, item) =>
                    sum +
                    (item.orderPrice ??
                      item.price ??
                      item.product?.price ??
                      0) *
                      (item.count ?? item.quantity ?? 1),
                  0
                );

          return {
            ...order,
            orderId: order.orderId ?? order.id,
            orderItems: items,
            totalPrice,
          };
        });

        setOrders(normalized);
      } catch (e) {
        console.error('주문 내역 조회 실패', e);
        setError('주문 내역을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    const loadMyReviews = async () => {
      try {
        const mine = await fetchMyReviews();
        const set = new Set(
          (Array.isArray(mine) ? mine : [])
            .map((r) => r?.productId)
            .filter((v) => typeof v === 'number' || typeof v === 'string')
        );
        setMyReviewedProductIdSet(set);
      } catch (e) {
        console.error('내 리뷰 조회 실패', e);
        setMyReviewedProductIdSet(new Set());
      }
    };

    loadMyReviews();
  }, []);

  const handleOpenReview = (order, productId) => {
    setSelectedOrder(order);
    setSelectedProductId(productId);
  };

  const handleCloseReview = () => {
    setSelectedOrder(null);
    setSelectedProductId(null);
  };

  const handleSubmitReview = async ({ productId, score, content, rating }) => {
    await createReview({ productId, score, content, rating });

    setMyReviewedProductIdSet((prev) => {
      const next = new Set(prev);
      next.add(productId);
      return next;
    });
  };

  const handleCancelOrder = async (order) => {
    if (!window.confirm('해당 주문을 취소하시겠습니까?')) return;

    try {
      setCancellingId(order.orderId);
      await cancelOrder(order.orderId);

      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === order.orderId ? { ...o, status: 'CANCEL' } : o
        )
      );
      alert('주문이 취소되었습니다.');
    } catch (e) {
      console.error('주문 취소 실패', e);
      alert('주문 취소에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <section className="w-full max-w-[840px] rounded-md border border-gray-200 bg-white p-6 shadow-sm mb-8">
        <h2 className="mb-4 text-lg font-semibold">주문 내역</h2>
        <div className="py-20 text-center text-gray-500">
          주문 내역을 불러오는 중입니다...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full max-w-[840px] rounded-md border border-gray-200 bg-white p-6 shadow-sm mb-8">
        <h2 className="mb-4 text-lg font-semibold">주문 내역</h2>
        <div className="py-20 text-center text-red-500">{error}</div>
      </section>
    );
  }

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
          const isCanceled = order.status === 'CANCEL';
          const items = order.orderItems ?? [];

          const hasAnyReviewed = items.some(
            (it) =>
              it?.productId != null && myReviewedProductIdSet.has(it.productId)
          );

          const allReviewed =
            items.length > 0 &&
            items.every(
              (it) =>
                it?.productId != null &&
                myReviewedProductIdSet.has(it.productId)
            );

          const handleClickReview = () => {
            const target =
              items.find(
                (it) =>
                  it?.productId != null &&
                  !myReviewedProductIdSet.has(it.productId)
              ) ?? items[0];

            if (target?.productId != null) {
              handleOpenReview(order, target.productId);
            }
          };

          return (
            <div
              key={order.orderId}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md"
            >
              <OrderItemSection order={order} />

              <div className="mt-4 border-t pt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="green"
                    className="px-4 py-2 text-sm text-white"
                    disabled={isCanceled || allReviewed}
                    onClick={handleClickReview}
                  >
                    <div className="flex items-center gap-1">
                      <CommentIcon />
                      {allReviewed ? '리뷰 작성 완료' : '리뷰 작성'}
                    </div>
                  </Button>

                  <Button
                    mode="outlined"
                    className="px-4 py-2 text-sm"
                    disabled={
                      isCanceled ||
                      hasAnyReviewed ||
                      cancellingId === order.orderId
                    }
                    onClick={() => handleCancelOrder(order)}
                  >
                    {isCanceled
                      ? '취소 완료'
                      : hasAnyReviewed
                      ? '리뷰 작성 후 취소 불가'
                      : cancellingId === order.orderId
                      ? '취소 중...'
                      : '주문 취소'}
                  </Button>
                </div>

                <div className="flex items-center gap-3 justify-between sm:justify-end">
                  {isCanceled && (
                    <span className="text-sm font-semibold text-red-500">
                      취소된 주문
                    </span>
                  )}
                  <p className="font-semibold text-xl text-brandGreen">
                    총 {order.totalPrice.toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ReviewModal
        isOpen={!!selectedOrder && !!selectedProductId}
        order={selectedOrder}
        productId={selectedProductId}
        onClose={handleCloseReview}
        onSubmit={handleSubmitReview}
      />
    </section>
  );
}
