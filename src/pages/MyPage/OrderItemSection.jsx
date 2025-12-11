import { formatKoreanDate } from 'utils/date';

export default function OrderItemSection({ order, compact = false }) {
  if (!order) return null;

  const items = order.orderItems ?? order.items ?? [];

  const imageClass = compact ? 'h-16 w-16' : 'h-20 w-20';
  const titleClass = compact ? 'text-lg' : 'text-xl';
  const metaClass = compact ? 'text-base' : 'text-lg';
  const dateClass = compact ? 'text-xs' : 'text-sm';

  const rawDate = order.orderDate ?? order.createdAt ?? null;
  const formattedDate = formatKoreanDate(rawDate);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => {
        const qty =
          typeof item.count === 'number'
            ? item.count
            : typeof item.quantity === 'number'
            ? item.quantity
            : 1;

        const price =
          typeof item.orderPrice === 'number'
            ? item.orderPrice
            : typeof item.price === 'number'
            ? item.price
            : 0;

        const imgSrc = item.imageUrl ?? '';

        const name = item.productName ?? item.name ?? '상품명 없음';

        return (
          <div key={item.productId} className="flex items-start gap-4">
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={name}
                className={`${imageClass} rounded-md object-cover`}
              />
            ) : (
              <div
                className={`${imageClass} flex items-center justify-center rounded-md bg-gray-100 text-xs text-gray-400`}
              >
                이미지 없음
              </div>
            )}

            <div className="flex flex-1 flex-col text-gray-800">
              <p className={`font-semibold ${titleClass}`}>{name}</p>

              <p className={`mt-1 text-gray-600 ${metaClass}`}>
                수량: {qty}개 | 단가: {price.toLocaleString()}원
              </p>

              <p className={`mt-1 text-gray-500 ${dateClass}`}>
                {formattedDate}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
