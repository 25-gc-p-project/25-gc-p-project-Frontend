import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from 'components/ProductCard';
import { fetchRelatedProducts } from 'api/product';

export default function RelatedProducts({ productId, className = '' }) {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchRelatedProducts(productId);
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productId]);

  if (loading) {
    return (
      <section className={`mt-6 rounded-lg bg-gray-50 p-6 ${className}`}>
        <div className="text-sm text-gray-500">
          연관 상품을 불러오는 중입니다...
        </div>
      </section>
    );
  }

  if (!items || items.length === 0) return null;

  return (
    <section className={`mt-6 rounded-lg bg-gray-50 p-6 ${className}`}>
      <h2 className="mb-3 text-lg font-semibold">구매자가 함께 구매한 상품</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 5).map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onClick={() => navigate(`/products/${p.id}`)}
          />
        ))}
      </div>
    </section>
  );
}
