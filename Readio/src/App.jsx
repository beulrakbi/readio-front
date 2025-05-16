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
import ReportedPostDetailPage from "./pages/admin/reported/ReportedPostDetailPage";
import ReportedPostListPage from "./pages/admin/reported/ReportedPostListPage";
import ReportedReviewDetailPage from "./pages/admin/reported/ReportedReviewDetailPage";
import ReportedReviewListPage from "./pages/admin/reported/ReportedReviewListPage";
import AdminFaqList from "./pages/boardManagement/AdminFaqList";
import AdminFaqWriting from "./pages/boardManagement/AdminFaqWriting";
import AdminNoticeList from "./pages/boardManagement/adminNoticeList";
import AdminNoticeWriting from "./pages/boardManagement/AdminNoticeWriting";
import AdminQnaAnswer from "./pages/boardManagement/AdminQnaAnswer";
import AdminQnaDetail from "./pages/boardManagement/AdminQnaDetail";
import AdminQnaList from "./pages/boardManagement/AdminQnaList";
import Bookmark from "./pages/bookmark/bookmark";
import PostWriting from "./pages/post/PostWriting";
import Faq from './pages/serviceCenter/Faq';
import NoticeDetail from './pages/serviceCenter/NoticeDetail';
import NoticeList from './pages/serviceCenter/NoticeList';
import QnaDetail from './pages/serviceCenter/QnaDetail';
import QnaList from './pages/serviceCenter/QnaList';
import QnaWriting from './pages/serviceCenter/QnaWriting';
import Join from "./pages/user/Join";
import Login from "./pages/user/Login";
import UserMain from "./pages/user/UserMain";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 메인페이지 */}
          <Route path="/" element={<Layout />}>
            <Route index element={<UserMain />} />
            <Route path="/login" element={<Login />} /> {/* 로그인 */}
            <Route path="join" element={<Join />} /> {/* 회원가입 */}
            <Route path="bookPage" element={<BookPage />} />
            <Route path="/notice" element={<NoticeList />} />
            <Route path="/notice/detail" element={<NoticeDetail />} />
            <Route path="/qna" element={<QnaList />} />
            <Route path="/qna/detail" element={<QnaDetail />} />
            <Route path="/qna/writing" element={<QnaWriting />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/bookmark" element={<Bookmark />} />
            <Route path="/notice" element={<Search />} />
          </Route>
          <Route path="/admin" element={<AdminLayout/>}>
            <Route index element={<AdminMain/>}/>
            <Route path="filtering/list" element={<FilteringListPage/>}/>
            <Route path="filtering/create" element={<FilteringCreatePage/>}/>
            <Route path="filtering/detail" element={<FilteringDetailPage/>}/>
            <Route path="filtering/modify" element={<FilteringModifyPage/>}/>
            <Route path="reported/review/list" element={<ReportedReviewListPage/>} />
            <Route path="reported/review/detail" element={<ReportedReviewDetailPage/>} />
            <Route path="reported/post/list" element={<ReportedPostListPage/>} />
            <Route path="reported/post/detail" element={<ReportedPostDetailPage/>} />
            <Route path="/admin/notice" element={<AdminNoticeList/>}/>
            <Route path="/admin/notice/writing" element={<AdminNoticeWriting/>}/>
            <Route path="/admin/faq" element={<AdminFaqList/>}/>
            <Route path="/admin/faq/writing" element={<AdminFaqWriting/>}/>
            <Route path="/admin/qna" element={<AdminQnaList/>}/>
            <Route path="/admin/qna/answer" element={<AdminQnaAnswer/>}/>
            <Route path="/admin/qna/detail" element={<AdminQnaDetail/>}/>
          </Route>
          <Route path="post/writing" element={<PostWriting />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;