import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookPage from '../src/pages/book/BookPage';
import AdminLayout from "./layouts/AdminLayout";
import Layout from './layouts/Layout';
import AdminMain from "./pages/admin/AdminMain";
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
            <Route path="bookPage" element={<BookPage />} />
          </Route>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminMain />} />
          </Route>
          <Route path="post/writing" element={<PostWriting />} />

          {/* 관리자용 페이지 */}


        </Routes>
      </BrowserRouter >
    </>
  );
}

export default App;
