import { useNavigate } from "react-router-dom";
import ProfileDropdown from "./ProfileDropdown";
import Button from "components/Button";
import { useAuthStore } from "stores/auth";
import { ReactComponent as LogoIcon } from "assets/icons/logo.svg";
import { ReactComponent as CartIcon } from "assets/icons/cart.svg";

function Gnb() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleCartClick = () => {
    navigate("/cart");
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
          <button className="hover:bg-gray-100 p-2" onClick={handleCartClick}>
            <CartIcon />
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
