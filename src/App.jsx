import Gnb from "components/Gnb/Gnb";
import CartPage from "pages/CartPage/CartPage";
import DetailPage from "pages/DetailPage/DetailPage";
import ListPage from "pages/ListPage/ListPage";
import LoginPage from "pages/LoginPage/LoginPage";
import MyPage from "pages/MyPage/MyPage";
import SignupPage from "pages/SignupPage/SignupPage";
import { Route, Routes } from "react-router-dom";

function App() {
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
