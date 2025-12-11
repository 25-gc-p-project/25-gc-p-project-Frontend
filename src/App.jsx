import { setAuthToken } from "api/client";
import Gnb from "components/Gnb/Gnb";
import CartPage from "pages/CartPage/CartPage";
import DetailPage from "pages/DetailPage/DetailPage";
import ListPage from "pages/ListPage/ListPage";
import LoginPage from "pages/LoginPage/LoginPage";
import MyPage from "pages/MyPage/MyPage";
import SignupPage from "pages/SignupPage/SignupPage";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuthStore } from "stores/auth";

function App() {
  const accessToken = useAuthStore((state) => state.accessToken);
  useEffect(() => {
    if (accessToken) {
      setAuthToken(accessToken);
    } else {
      setAuthToken(null);
    }
  }, [accessToken]);
  return (
    <>
      <Gnb />
      <Routes>
        <Route path="/" element={<ListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/products/:id" element={<DetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </>
  );
}

export default App;
