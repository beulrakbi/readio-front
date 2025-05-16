import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookPage from '../src/pages/book/BookPage';
import Search from "./components/board/common/search";
import AdminLayout from "./layouts/AdminLayout";
import Layout from './layouts/Layout';
import AdminMain from "./pages/admin/AdminMain";
import FilteringCreatePage from "./pages/admin/filtering/FilteringCreatePage";
import FilteringDetailPage from "./pages/admin/filtering/FilteringDetailPage";
import FilteringListPage from "./pages/admin/filtering/FilteringListPage";
import FilteringModifyPage from "./pages/admin/filtering/FilteringModifyPage";
import AdminFaqList from "./pages/boardManagement/AdminFaqList";
import AdminFaqWriting from "./pages/boardManagement/AdminFaqWriting";
import AdminNoticeList from "./pages/boardManagement/adminNoticeList";
import AdminNoticeWriting from "./pages/boardManagement/AdminNoticeWriting";
import AdminQnaAnswer from "./pages/boardManagement/AdminQnaAnswer";
import AdminQnaDetail from "./pages/boardManagement/AdminQnaDetail";
import AdminQnaList from "./pages/boardManagement/AdminQnaList";
import Bookmark from "./pages/bookmark/bookmark";
import PostWriting from "./pages/post/PostWriting";
import NoticeList from './pages/serviceCenter/NoticeList';
import UserMain from "./pages/user/UserMain";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 메인페이지 */}
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
          <Route path="bookPage" element={<BookPage/>}/>
          <Route path="/notice" element={<NoticeList/>}/>
          <Route path="/notice/detail" element={<NoticeDetail/>}/>
          <Route path="/qna" element={<QnaList/>}/>
          <Route path="/qna/detail" element={<QnaDetail/>}/>
          <Route path="/qna/writing" element={<QnaWriting/>}/>
          <Route path="/faq" element={<Faq/>}/>
          <Route path="/bookmark" element={<Bookmark/>}/>
          <Route path="/notice" element={<Search/>}/>
          </Route>
          <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<AdminMain/>}/>
          <Route path="filtering/list" element={<FilteringListPage/>}/>
          <Route path="filtering/create" element={<FilteringCreatePage/>}/>
          <Route path="filtering/detail" element={<FilteringDetailPage/>}/>
          <Route path="filtering/modify" element={<FilteringModifyPage/>}/>
          <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<AdminMain/>}/>
          <Route path="/admin/notice" element={<AdminNoticeList/>}/>
          <Route path="/admin/notice/writing" element={<AdminNoticeWriting/>}/>
          <Route path="/admin/faq" element={<AdminFaqList/>}/>
          <Route path="/admin/faq/writing" element={<AdminFaqWriting/>}/>
          <Route path="/admin/qna" element={<AdminQnaList/>}/>
          <Route path="/admin/qna/answer" element={<AdminQnaAnswer/>}/>
          <Route path="/admin/qna/detail" element={<AdminQnaDetail/>}/>
          </Route>
          </Route>
          <Route path="post/writing" element={<PostWriting/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
