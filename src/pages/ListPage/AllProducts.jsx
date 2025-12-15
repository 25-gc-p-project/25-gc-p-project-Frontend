import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from 'components/ProductCard';
import Pagination from 'components/Pagination';
import ProductSearchBar from './ProductSearchBar';
import { fetchProducts, searchProducts } from 'api/product';
import { sendViewEvent } from 'api/events';
import { useAuthStore } from 'stores/auth';

const PAGE_SIZE = 4;

export default function AllProducts() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');

  const [products, setProducts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sessionId = localStorage.getItem('sessionId') || undefined;

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError('');

      try {
        const pageIndex = currentPage - 1;

        const commonParams = {
          page: pageIndex,
          size: PAGE_SIZE,
          sort: 'latest',
          sessionId,
        };

        let data;

        if (keyword.trim()) {
          data = await searchProducts({
            ...commonParams,
            keyword: keyword.trim(),
          });
        } else {
          data = await fetchProducts(commonParams);
        }

        const items = data.content ?? [];
        const pages =
          data.page?.totalPages ??
          (data.page?.totalElements
            ? Math.ceil(data.page.totalElements / PAGE_SIZE)
            : 1);

        setProducts(items);
        setTotalPages(pages || 1);
      } catch (err) {
        console.error(err);
        setError('상품을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, keyword, sessionId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value) => {
    setKeyword(value);
    setCurrentPage(1);
  };

  const handleProductClick = (productId) => {
    sendViewEvent({ productId, sessionId, token }).catch((e) =>
      console.error('view 이벤트 전송 실패', e)
    );

    navigate(`/products/${productId}`);
  };

  return (
    <section className="w-full mb-16">
      <ProductSearchBar value={keyword} onChange={handleSearchChange} />

      {loading && (
        <div className="py-10 text-center text-sm text-gray-500">
          상품을 불러오는 중입니다...
        </div>
      )}

      {error && !loading && (
        <div className="py-10 text-center text-sm text-red-500">{error}</div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="py-10 min-h-56 text-center text-sm text-gray-500">
          검색 결과가 없습니다.
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => handleProductClick(product.id)}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </section>
  );
}
