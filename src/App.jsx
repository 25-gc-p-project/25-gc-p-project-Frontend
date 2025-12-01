import Gnb from "components/Gnb/Gnb";
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
      </Routes>
    </>
  );
}

export default App;
