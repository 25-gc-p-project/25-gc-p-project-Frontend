import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockAllProducts } from "mocks/products";
import ProductCard from "components/ProductCard";
import Pagination from "components/Pagination";
import ProductSearchBar from "./ProductSearchBar";

const PAGE_SIZE = 4;

export default function AllProducts() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");

  const filteredProducts = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return mockAllProducts;
    return mockAllProducts.filter((p) => p.name.toLowerCase().includes(q));
  }, [keyword]);

  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE) || 1;

  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredProducts.slice(start, end);
  }, [currentPage, filteredProducts]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (value) => {
    setKeyword(value);
    setCurrentPage(1);
  };

  return (
    <section className="w-full mb-16">
      <ProductSearchBar value={keyword} onChange={handleSearchChange} />

      {totalItems === 0 ? (
        <div className="py-10 text-center text-sm text-gray-500">
          검색 결과가 없습니다.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {currentProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/products/${product.id}`)}
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
