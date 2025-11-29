import Button from 'components/Button';
import { useNavigate } from 'react-router-dom';

function LoginMenu() {
  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login');
  };
  return (
    <>
      <Button onClick={handleLoginClick} width={80} height={32} variant="blue">
        로그인
      </Button>
    </>
  );
}

export default LoginMenu;
