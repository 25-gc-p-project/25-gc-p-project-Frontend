import { useNavigate } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import Button from 'components/Button';
import { useAuthStore } from 'stores/auth';
import { ReactComponent as LogoIcon } from 'assets/icons/logo.svg';
import { ReactComponent as CartIcon } from 'assets/icons/cart.svg';
import { useCartStore } from 'stores/cart';
import { useEffect } from 'react';
import { fetchCart } from 'api/cart';
import { fetchProductDetail } from 'api/product';

function Gnb() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, setItems } = useCartStore();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const loadCart = async () => {
      if (!user) {
        setItems([]);
        return;
      }

      try {
        const data = await fetchCart();

        const rawItems = Array.isArray(data) ? data : [];

        const productList = await Promise.all(
          rawItems.map(async (item) => {
            try {
              const product = await fetchProductDetail(item.productId);
              return { productId: item.productId, product };
            } catch (e) {
              console.error('상품 상세 조회 실패', item.productId, e);
              return { productId: item.productId, product: null };
            }
          })
        );

        const productMap = new Map(
          productList.map(({ productId, product }) => [productId, product])
        );

        const mapped = rawItems
          .map((item) => {
            const product = productMap.get(item.productId) || {};

            const price = typeof product.price === 'number' ? product.price : 0;

            const quantity = typeof item.count === 'number' ? item.count : 1;

            return {
              cartId: item.id,
              productId: item.productId,
              name: product.name ?? '이름 없는 상품',
              price,
              imageUrl: product.imageUrl,
              weight: product.weight,
              quantity,
              checked: true,
            };
          })
          .filter((i) => i.productId != null);

        setItems(mapped);
      } catch (e) {
        console.error('장바구니 조회 실패', e);
      }
    };

    loadCart();
  }, [user, setItems]);

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b bg-white px-3 sm:px-16">
      <button
        onClick={handleLogoClick}
        className="flex items-center gap-2"
        type="button"
      >
        <LogoIcon />
        <p className="text-2xl font-bold">효드림몰</p>
      </button>

      {user ? (
        <div className="flex items-center gap-2 sm:gap-3">
          <ProfileDropdown />
          <button
            className="relative p-2 hover:bg-gray-100"
            onClick={handleCartClick}
          >
            <CartIcon />
            {cartCount > 0 && (
              <span
                className="
                  absolute -top-1 -right-1
                  flex h-5 w-5 items-center justify-center
                  rounded-full bg-brandDanger text-xs font-bold text-white
                "
              >
                {cartCount}
              </span>
            )}
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="blue"
          className="px-4 py-1.5 text-sm font-medium"
          onClick={handleLoginClick}
        >
          로그인
        </Button>
      )}
    </header>
  );
}

export default Gnb;
