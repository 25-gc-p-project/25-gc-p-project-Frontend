import { useNavigate } from 'react-router-dom';
// import LoginMenu from './LoginMenu';
import { ReactComponent as LogoIcon } from 'assets/icons/logo.svg';
import ProfileDropdown from './ProfileDropdown';

function Gnb() {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    navigate('/');
  };
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between h-14 border-b bg-white">
      <button onClick={handleLogoClick} className="flex gap-2 items-center">
        <LogoIcon />
        <p className="text-2xl font-bold">효드림몰</p>
      </button>
      <ProfileDropdown />
      {/*Todo:  <LoginMenu />*/}
    </header>
  );
}

export default Gnb;
