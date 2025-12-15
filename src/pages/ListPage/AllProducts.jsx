import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from 'components/ProductCard';
import Pagination from 'components/Pagination';
import ProductSearchBar from './ProductSearchBar';
import { fetchProducts, searchProducts } from 'api/product';
import { sendViewEvent } from 'api/events';
import { useAuthStore } from 'stores/auth';
import Dropdown from 'components/Dropdown/Dropdown';
import DropdownButton from 'components/Dropdown/DropdownButton';
import DropdownMenu from 'components/Dropdown/DropdownMenu';
import DropdownMenuItem from 'components/Dropdown/DropdownMenuItem';

const PAGE_SIZE = 4;

const SORT_LABEL = {
  latest: '최신순',
  popular: '인기순',
};

export default function AllProducts() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState('');

  const [sort, setSort] = useState('latest');

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
          sort,
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
  }, [currentPage, keyword, sort, sessionId]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (value) => {
    setKeyword(value);
    setCurrentPage(1);
  };

  const handleSortChange = (nextSort) => {
    setSort(nextSort);
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
      <p className="mb-2 text-xl font-semibold text-gray-800">상품 목록</p>
      <div className="flex items-center justify-center gap-2">
        <div className="flex-1 mt-4">
          <ProductSearchBar value={keyword} onChange={handleSearchChange} />
        </div>
        <div className="flex justify-end">
          <Dropdown className="bg-gray-50 border border-gray-200 p-2 rounded-lg hover:bg-gray-100">
            <DropdownButton>정렬: {SORT_LABEL[sort] ?? sort}</DropdownButton>

            <DropdownMenu>
              <DropdownMenuItem onClick={() => handleSortChange('latest')}>
                최신순
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => handleSortChange('popular')}>
                인기순
              </DropdownMenuItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

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
