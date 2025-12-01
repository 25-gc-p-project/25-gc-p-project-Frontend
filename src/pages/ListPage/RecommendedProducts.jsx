import { useAuthStore } from "stores/auth";
import { mockProducts } from "mocks/products";
import { useNavigate } from "react-router-dom";
import ProductCard from "components/ProductCard";

export default function RecommendedProducts() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const hasHealthInfo =
    user?.health?.allergies?.length > 0 ||
    user?.health?.diseases?.length > 0 ||
    user?.health?.effects?.length > 0 ||
    user?.health?.customEffects?.length > 0;

  if (!isLoggedIn) {
    return (
      <section className="w-full rounded-md border border-blue-200 bg-blue-50 p-10 text-blue-700 shadow-sm mb-8">
        <h3 className="font-semibold text-lg">
          맞춤 상품 추천을 받으시려면 로그인하세요
        </h3>
        <p className="mt-2 text-sm">
          로그인 후 마이페이지에서 건강정보를 입력하시면 회원님께 딱 맞는 상품을
          추천해드립니다.
        </p>
      </section>
    );
  }

  if (isLoggedIn && !hasHealthInfo) {
    return (
      <section className="w-full rounded-md border border-yellow-200 bg-yellow-50 p-10 text-yellow-700 shadow-sm mb-8">
        <h3 className="font-semibold text-lg">건강 정보를 입력해주세요</h3>
        <p className="mt-2 text-sm">
          마이페이지에서 알레르기나 지병 정보를 입력하시면 맞춤 상품을
          추천해드립니다.
        </p>
        <button
          onClick={() => navigate("/mypage")}
          className="mt-3 underline text-yellow-700"
        >
          마이페이지로 이동 →
        </button>
      </section>
    );
  }

  return (
    <section className="w-full mb-12">
      <h3 className="font-semibold text-xl mb-4">추천 상품</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => navigate(`/products/${product.id}`)}
          />
        ))}
      </div>
    </section>
  );
}
