import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Button from 'components/Button';
import { useAuthStore } from 'stores/auth';
import { useCartStore } from 'stores/cart';
import { fetchProductDetail } from 'api/product';
import { addCartItem } from 'api/cart';

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useAuthStore();
  const { addItem } = useCartStore();

  const productId = Number(id);
  const sessionId = localStorage.getItem('sessionId') || undefined;

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!productId) return;

    const loadDetail = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await fetchProductDetail(productId, sessionId);

        const normalized = {
          ...data,
          image: data.imageUrl,
          benefits: data.healthBenefits ?? data.benefits ?? [],
          reviews: data.reviews ?? [],
        };

        setProduct(normalized);
      } catch (err) {
        console.error(err);
        setError('상품 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [productId, sessionId]);

  const redirectToLogin = () => {
    navigate('/login', { state: { from: location.pathname } });
  };

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleAddToCart = async () => {
    if (!user) {
      redirectToLogin();
      return;
    }

    if (!product) return;

    try {
      await addCartItem({ productId, count: quantity });

      addItem(product, quantity);
    } catch (e) {
      console.error(e);
      alert('장바구니 담기에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      redirectToLogin();
      return;
    }

    if (!product) return;

    try {
      await addCartItem({ productId, count: quantity });
      addItem(product, quantity);
      navigate('/cart');
    } catch (e) {
      console.error(e);
      alert('장바구니 담기에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-center text-gray-500">
          상품 정보를 불러오는 중입니다...
        </p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-center text-red-500">{error}</p>
        <div className="mt-4 flex justify-center">
          <Button variant="blue" mode="outlined" onClick={() => navigate(-1)}>
            이전 페이지로
          </Button>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8">
        <p className="text-center text-gray-500">존재하지 않는 상품입니다.</p>
        <div className="mt-4 flex justify-center">
          <Button variant="blue" mode="outlined" onClick={() => navigate(-1)}>
            이전 페이지로
          </Button>
        </div>
      </main>
    );
  }

  const {
    name,
    imageUrl,
    rating,
    price,
    description,
    benefits = [],
    reviews = [],
  } = product;

  const reviewCount = reviews?.length ?? 0;

  const avgRatingText =
    typeof rating === 'number' && reviewCount > 0
      ? `${rating.toFixed(1)}점 (${reviewCount}개 리뷰)`
      : reviewCount === 0
      ? '아직 리뷰가 없습니다.'
      : '';

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-4 text-sm text-gray-500 hover:underline"
      >
        &lt; 목록으로 돌아가기
      </button>

      <section className="flex flex-col gap-8 md:flex-row  md:items-stretch">
        <div className="md:w-1/2">
          <img
            src={imageUrl}
            alt={name}
            className="w-full rounded-xl object-cover md:h-[420px]"
          />
        </div>

        <div className="md:w-1/2 relative flex flex-col space-y-4 md:pb-24">
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>

          <div className="flex items-center gap-2 text-gray-600">
            <span className="text-yellow-400">★</span>
            <span>{avgRatingText}</span>
          </div>

          <div>
            <p>판매가</p>
            <div className="text-2xl font-semibold text-brandGreen">
              {price != null ? `${price.toLocaleString()}원` : '-'}
            </div>
          </div>

          {/* <div className="min-h-22 bg-yellow-50 border border-yellow-200 p-5">
            {weight && (
              <>
                <p className="mb-2 text-orange-600">용량을 확인해주세요</p>
                <p className="text-sm text-gray-500">용량 정보: {weight}</p>
              </>
            )}
          </div> */}

          <div className="space-y-3 pt-2 md:absolute md:bottom-0 md:left-0 md:right-0 md:bg-white md:pt-4">
            <p className="font-semibold text-gray-800">수량</p>
            <div>
              <div className="mb-4 flex items-center rounded-lg border border-gray-300 max-w-28">
                <button
                  type="button"
                  onClick={handleDecrease}
                  className="h-9 w-9 text-lg"
                  disabled={quantity === 1}
                >
                  -
                </button>
                <div className="w-10 text-center text-sm">{quantity}</div>
                <button
                  type="button"
                  onClick={handleIncrease}
                  className="h-9 w-9 text-lg"
                >
                  +
                </button>
              </div>

              <div className="flex flex-1 gap-2 h-12">
                <Button
                  type="button"
                  mode="outlined"
                  className="flex-1 py-2 text-sm"
                  onClick={handleAddToCart}
                >
                  장바구니 담기
                </Button>
                <Button
                  type="button"
                  variant="green"
                  mode="filled"
                  className="flex-1 py-2 text-sm"
                  onClick={handleBuyNow}
                >
                  바로 구매
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-lg bg-gray-50 p-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">상품 설명</h2>
        <p className="text-gray-700">
          {description || '해당 상품에 대한 설명이 준비 중입니다.'}
        </p>
      </section>

      {benefits.length > 0 && (
        <section className="mt-6 rounded-lg bg-gray-50 p-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">
            어디에 좋은가요?
          </h2>
          <div className="flex flex-wrap gap-2">
            {benefits.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-gray-800 shadow-sm"
              >
                <span className="text-brandGreen">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-6 rounded-lg bg-gray-50 p-6 mb-12">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">고객 리뷰</h2>

        {reviews.length === 0 ? (
          <p className="text-sm text-gray-500">아직 작성된 리뷰가 없습니다.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-lg bg-white p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.author}</span>
                    <span className="text-yellow-400">★</span>
                    <span>
                      {review.rating?.toFixed
                        ? review.rating.toFixed(1)
                        : review.rating}
                    </span>
                    <span className="ml-2 rounded-full bg-green-50 px-2 py-1 text-xs text-brandGreen">
                      긍정
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {review.createdAt}
                  </span>
                </div>
                <p className="mt-2 text-gray-800">{review.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
