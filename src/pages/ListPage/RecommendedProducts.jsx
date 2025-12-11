import { useEffect, useState } from 'react';
import { useAuthStore } from 'stores/auth';
import { useNavigate } from 'react-router-dom';
import ProductCard from 'components/ProductCard';
import { fetchRecommendedProducts } from 'api/product';

export default function RecommendedProducts() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isLoggedIn = !!user;

  const health = {
    allergies: user?.health?.allergies ?? user?.allergies ?? [],
    diseases: user?.health?.diseases ?? user?.diseases ?? [],
    effects: user?.health?.effects ?? user?.healthGoals ?? [],
    customEffects: user?.health?.customEffects ?? [],
  };

  const hasHealthInfo =
    health.allergies.length > 0 ||
    health.diseases.length > 0 ||
    health.effects.length > 0 ||
    health.customEffects.length > 0;

  const sessionId = localStorage.getItem('sessionId') || undefined;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRecommended = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await fetchRecommendedProducts(sessionId);

        const items = Array.isArray(data)
          ? data
          : data.content ?? data.items ?? [];

        setProducts(items);
      } catch (err) {
        console.error(err);
        setError('추천 상품을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    loadRecommended();
  }, [sessionId]);

  return (
    <section className="w-full mb-12">
      <h3 className="font-semibold text-xl mb-4">추천 상품</h3>

      {!isLoggedIn && (
        <div className="mb-4 rounded-md border border-blue-200 bg-blue-50 p-4 text-blue-700 text-sm">
          로그인 후 마이페이지에서 건강정보를 입력하시면 더 정교한 맞춤 상품을
          추천해드립니다.
        </div>
      )}

      {isLoggedIn && !hasHealthInfo && (
        <div className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-4 text-yellow-700 text-sm">
          건강정보를 입력하시면 회원님께 더 잘 맞는 상품을 추천해드려요.&nbsp;
          <button
            onClick={() => navigate('/mypage')}
            className="underline font-medium"
          >
            마이페이지로 이동 →
          </button>
        </div>
      )}
      {loading && (
        <div className="py-6 text-sm text-gray-500">
          추천 상품을 불러오는 중입니다...
        </div>
      )}

      {error && !loading && (
        <div className="py-6 text-sm text-red-500">{error}</div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="py-6 text-sm text-gray-500">
          아직 추천할 상품이 없습니다.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => navigate(`/products/${product.id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
