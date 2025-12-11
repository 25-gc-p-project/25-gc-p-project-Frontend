import Dropdown from "components/Dropdown/Dropdown";
import DropdownButton from "components/Dropdown/DropdownButton";
import DropdownMenu from "components/Dropdown/DropdownMenu";
import DropdownMenuItem from "components/Dropdown/DropdownMenuItem";
import { useNavigate } from "react-router-dom";
import { ReactComponent as LogoutIcon } from "assets/icons/logout.svg";
import { ReactComponent as ArrowupIcon } from "assets/icons/arrowup.svg";
import { useAuthStore } from "stores/auth";

function ProfileDropdown() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    logout();
    navigate("/login", { replace: true });
  };
  const displayName = user?.name || user?.username || user?.id || "게스트";

  return (
    <Dropdown>
      <DropdownButton className="flex items-center justify-center text-lg px-1 gap-1 py-2 rounded-lg sm:px-3 hover:bg-gray-100">
        {displayName}님 <ArrowupIcon />
      </DropdownButton>
      <DropdownMenu className="w-[130px]">
        <DropdownMenuItem
          className="text-center"
          onClick={() => navigate("/mypage")}
        >
          마이페이지
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-1 text-[#ef4444] justify-center"
          onClick={handleLogout}
        >
          <LogoutIcon />
          로그아웃
        </DropdownMenuItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default ProfileDropdown;
