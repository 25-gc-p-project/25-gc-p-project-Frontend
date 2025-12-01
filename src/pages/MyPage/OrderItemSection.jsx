export default function OrderItemSection({ order, compact = false }) {
  if (!order) return null;

  const imageClass = compact ? "h-16 w-16" : "h-20 w-20";
  const titleClass = compact ? "text-lg" : "text-xl";
  const metaClass = compact ? "text-base" : "text-lg";
  const dateClass = compact ? "text-xs" : "text-sm";

  return (
    <div className="flex items-start gap-4">
      <img
        src={order.productImage}
        alt={order.productName}
        className={`${imageClass} rounded-md object-cover`}
      />

      <div className="flex flex-1 flex-col text-gray-800">
        <p className={`font-semibold ${titleClass}`}>{order.productName}</p>
        <p className={`mt-1 flex flex-wrap text-gray-600 ${metaClass}`}>
          수량: {order.quantity}개 | 단가: {order.price.toLocaleString()}원
        </p>
        <p className={`mt-1 text-gray-500 ${dateClass}`}>{order.orderDate}</p>
      </div>
    </div>
  );
}
