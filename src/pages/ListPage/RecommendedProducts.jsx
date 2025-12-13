import { useEffect, useState } from 'react';
import { useAuthStore } from 'stores/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from 'components/ProductCard';
import { fetchRecommendedProducts } from 'api/product';
import { sendViewEvent } from 'api/events';

export default function RecommendedProducts() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

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

  const [sections, setSections] = useState([]);
  const [activeKey, setActiveKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const healthKey = JSON.stringify({
    allergies: health.allergies,
    diseases: health.diseases,
    effects: health.effects,
    customEffects: health.customEffects,
  });

  useEffect(() => {
    const loadRecommended = async () => {
      setLoading(true);
      setError('');

      try {
        const data = await fetchRecommendedProducts(sessionId);

        const resultSections = [];

        if (data?.realTime?.products?.length) {
          resultSections.push({
            key: 'realTime',
            label: '최근 본 상품',
            title: data.realTime.title || '실시간 관심사 추천',
            products: data.realTime.products,
          });
        }

        if (Array.isArray(data?.healthGoals)) {
          data.healthGoals.forEach((section, idx) => {
            if (section?.products?.length) {
              resultSections.push({
                key: `health-${idx}`,
                label: '건강 목표 추천',
                title: section.title || '건강 목표를 기반으로 한 추천',
                products: section.products,
              });
            }
          });
        }

        if (Array.isArray(data?.diseases)) {
          data.diseases.forEach((section, idx) => {
            if (section?.products?.length) {
              resultSections.push({
                key: `disease-${idx}`,
                label: '질환 추천',
                title: section.title || '질환 정보를 기반으로 한 추천',
                products: section.products,
              });
            }
          });
        }

        setSections(resultSections);

        if (resultSections.length > 0) {
          setActiveKey(resultSections[0].key);
        } else {
          setActiveKey(null);
        }
      } catch (err) {
        console.error(err);
        setError('추천 상품을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    loadRecommended();
  }, [sessionId, healthKey, location.pathname]);

  const handleProductClick = (productId) => {
    sendViewEvent({ productId, sessionId, token }).catch((e) =>
      console.error('view 이벤트 전송 실패', e)
    );
    navigate(`/products/${productId}`);
  };

  const activeSection =
    sections.find((section) => section.key === activeKey) || sections[0];

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

      {!loading &&
        !error &&
        (!activeSection || !activeSection.products?.length) && (
          <div className="py-6 text-sm text-gray-500">
            아직 추천할 상품이 없습니다.
          </div>
        )}

      {!loading &&
        !error &&
        activeSection &&
        activeSection.products?.length > 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
            {sections.length > 1 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-gray-100 pb-3">
                {sections.map((section) => {
                  const isActive = section.key === activeKey;
                  return (
                    <button
                      key={section.key}
                      type="button"
                      onClick={() => setActiveKey(section.key)}
                      className={
                        'rounded-full px-3 py-1 text-xs sm:text-sm border transition ' +
                        (isActive
                          ? 'border-brandBlue bg-brandBlue text-white shadow-sm'
                          : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100')
                      }
                    >
                      {section.label}
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mb-4 flex items-center justify-between gap-2">
              <h4 className="text-base sm:text-lg font-semibold text-gray-800">
                {activeSection.title}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {activeSection.products.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onClick={() => handleProductClick(product.id)}
                />
              ))}
            </div>
          </div>
        )}
    </section>
  );
}
