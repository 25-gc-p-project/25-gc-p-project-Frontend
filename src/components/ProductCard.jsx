export default function ProductCard({ product, onClick }) {
  if (!product) return null;

  const { name, rating, price, imageUrl } = product;

  return (
    <div
      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <img
        src={imageUrl}
        alt={name}
        className="h-60 w-full rounded-md object-cover"
      />

      <div className="mt-3 space-y-1">
        <p className="text-gray-800 font-semibold text-2xl">{name}</p>

        {rating != null && (
          <p className="text-xl flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span>{rating.toFixed ? rating.toFixed(1) : rating}</span>
          </p>
        )}

        <p className="text-brandGreen text-2xl font-semibold">
          {price.toLocaleString()}원
        </p>
      </div>
    </div>
  );
}
