import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
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
import UserManagement from "./pages/admin/UserManagement";
import AdminFaqList from "./pages/boardManagement/AdminFaqList";
import AdminFaqWriting from "./pages/boardManagement/AdminFaqWriting";
import AdminNoticeList from "./pages/boardManagement/adminNoticeList";
import AdminNoticeWriting from "./pages/boardManagement/AdminNoticeWriting";
import AdminQnaAnswer from "./pages/boardManagement/AdminQnaAnswer";
import AdminQnaDetail from "./pages/boardManagement/AdminQnaDetail";
import AdminQnaList from "./pages/boardManagement/AdminQnaList";
import Bookmark from "./pages/bookmark/bookmark";
import CalendarPage from "./pages/mylibrary/calendar/CalendarPage.jsx";
import InterestEditPage from "./pages/mylibrary/interest/InterestEdit.jsx";
import InterestViewPage from "./pages/mylibrary/interest/InterestView.jsx";
import MyLibraryGuestPage from "./pages/mylibrary/mainpage/MyLibraryGuestPage.jsx";
import MyLibraryPage from './pages/mylibrary/mainpage/MyLibraryPage.jsx';
import EditProfilePage from "./pages/mylibrary/profile/EditProfilePage.jsx";
import PostWriting from "./pages/post/PostWriting";
import PostWritingBook from "./pages/post/PostWritingBook";
import PostDetail from "./pages/post/PostDetail";
import FeedMain from "./pages/feed/FeedMain";
import FollowList from "./pages/mylibrary/follow/FollowList"
import PostList from "./pages/mylibrary/mypost/PostList"
import SearchBookList from './pages/searchList/SearchBookList';
import SearchVideoList from './pages/searchList/SearchVideoList';
import Faq from './pages/serviceCenter/Faq';
import NoticeDetail from './pages/serviceCenter/NoticeDetail';
import NoticeList from './pages/serviceCenter/NoticeList';
import QnaDetail from './pages/serviceCenter/QnaDetail';
import QnaList from './pages/serviceCenter/QnaList';
import QnaWriting from './pages/serviceCenter/QnaWriting';
import FindAccount, { FindIdForm, FindPwdForm } from "./pages/user/FindAccount";
import Join from "./pages/user/Join";
import Login from "./pages/user/Login";
import UserDelete from "./pages/user/UserDelete";
import UserDeleteComplete from "./pages/user/UserDeleteComplete";
import UserEdit from "./pages/user/UserEdit";
import UserMain from "./pages/user/UserMain";
import VerifyPwd from "./pages/user/VerifyPwd";
import PlayVideo from "./pages/videoDetail/PlayVideo";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 메인 페이지, 사용자 페이지 */}
          <Route path="/" element={<Layout />}>
            <Route index element={<UserMain />} />
            <Route path="/login" element={<Login />} />                           {/* 로그인 */}
            <Route path="join" element={<Join />} />                              {/* 회원가입 */}
            <Route path="users/verify-pwd" element={<VerifyPwd/>}/>               {/* 비밀번호 확인 */}
            <Route path="users/edit" element={<UserEdit />} />                    {/* 회원정보 수정 */}
              <Route path="users/delete" element={<UserDelete/>}/>                {/* 회원탈퇴 */}
            <Route path="users/delete/complete" element={<UserDeleteComplete/>} />{/* 회원탈퇴완료 */}
            <Route path="find-account" element={<FindAccount />}>                 {/* 계정정보찾기 */}
              <Route index element={<Navigate to="find-id" replace />} />         {/* 기본-아이디찾기 */}
              <Route path="find-id" element={<FindIdForm />} />                   {/* 아이디찾기 */}
              <Route path="find-pwd" element={<FindPwdForm />} />                 {/* 비밀번호찾기 */}
            </Route>
            <Route path="bookPage" element={<BookPage />} />
            <Route path="/notice" element={<NoticeList />} />
            <Route path="/notice/detail" element={<NoticeDetail />} />
            <Route path="/qna" element={<QnaList />} />
            <Route path="/qna/detail" element={<QnaDetail />} />
            <Route path="/qna/writing" element={<QnaWriting />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/bookmark" element={<Bookmark />} />
            <Route path="/notice" element={<Search />} />
            <Route path="/search/video" element={<SearchVideoList />} />
            <Route path="/search/book" element={<SearchBookList />} />
            <Route path="/video" element={<PlayVideo />} />
            <Route path="mylibrary" element={<MyLibraryPage />} />
            <Route path="guestlibrary" element={<MyLibraryGuestPage />} />
            <Route path="mylibrary/profile" element={<EditProfilePage />} />
            <Route path="mylibrary/interest" element={<InterestViewPage/>}/>
            <Route path="mylibrary/interest/edit" element={<InterestEditPage/>}/>
            <Route path="mylibrary/calendar" element={<CalendarPage/>}/>
            <Route path="post/writing" element={<PostWriting/>}/>
            <Route path="post/writing/book" element={<PostWritingBook/>}/>
            <Route path="post" element={<PostDetail/>}/>
            <Route path="feed" element={<FeedMain/>}/>
            <Route path="mylibrary/follow" element={<FollowList/>}/>
            <Route path="mylibrary/postlist" element={<PostList/>}/>
          </Route>

          {/* 관리자 페이지 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminMain />} />
            <Route path="users/list" element={<UserManagement />} />
            <Route path="filtering/list" element={<FilteringListPage />} />
            <Route path="filtering/create" element={<FilteringCreatePage />} />
            <Route path="filtering/detail" element={<FilteringDetailPage />} />
            <Route path="filtering/modify" element={<FilteringModifyPage />} />
            <Route path="reported/review/list" element={<ReportedReviewListPage />} />
            <Route path="reported/review/detail" element={<ReportedReviewDetailPage />} />
            <Route path="reported/post/list" element={<ReportedPostListPage />} />
            <Route path="reported/post/detail" element={<ReportedPostDetailPage />} />
            <Route path="/admin/notice" element={<AdminNoticeList />} />
            <Route path="/admin/notice/writing" element={<AdminNoticeWriting />} />
            <Route path="/admin/faq" element={<AdminFaqList />} />
            <Route path="/admin/faq/writing" element={<AdminFaqWriting />} />
            <Route path="/admin/qna" element={<AdminQnaList />} />
            <Route path="/admin/qna/answer" element={<AdminQnaAnswer />} />
            <Route path="/admin/qna/detail" element={<AdminQnaDetail />} />
          </Route>
        </Routes>
      </BrowserRouter >
    </>
  );
}

export default App;