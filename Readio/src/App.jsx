import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import UserMain from "./pages/user/UserMain";
import PostWriting from "./pages/post/PostWriting";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 사용자용 페이지 */}
          <Route path="/" element={<Layout />}>
            <Route index element={<UserMain />} />

            <Route path="post/writing" element={<PostWriting />} />
          </Route>

          {/* 관리자용 페이지 */}

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
