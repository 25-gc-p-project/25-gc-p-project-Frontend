import AllProducts from "./AllProducts";
import RecommendedProducts from "./RecommendedProducts";

export default function ListPage() {
  return (
    <div className="px-4 sm:px-16 py-8">
      <RecommendedProducts />
      <AllProducts />
    </div>
  );
}
