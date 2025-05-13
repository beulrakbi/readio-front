
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import Join from "./pages/user/Join";
import Login from "./pages/user/Login";
import UserMain from "./pages/user/UserMain";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
          
        <Route path="/login" element={<Login />} /> {/* 로그인 */}
        <Route path="/join" element={<Join />} /> {/* 회원가입 */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;