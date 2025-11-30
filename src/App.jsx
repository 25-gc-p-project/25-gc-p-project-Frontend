import Gnb from "components/Gnb/Gnb";
import LoginPage from "pages/LoginPage/LoginPage";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Gnb />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
