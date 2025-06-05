// src/App.js

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import BookPage from '../src/pages/book/BookPage';
import Search from "./components/board/common/search";
// Header와 UserNav는 이제 Layout에서 임포트할 것이므로 여기서는 제거하거나 주석 처리
// import Header from "./components/common/Header.jsx";
// import UserNav from "./components/common/UserNav.jsx";
import AdminLayout from "./layouts/AdminLayout";
import Layout from './layouts/Layout'; // Layout 컴포넌트 임포트
import { loginSuccess, logout } from "./modules/user/userSlice.js";
import AdminMain from "./pages/admin/AdminMain";
import CurationManagerPage from "./pages/admin/curation/CurationManagerPage.jsx";
import FilteringCreatePage from "./pages/admin/filtering/FilteringCreatePage";
import FilteringDetailPage from "./pages/admin/filtering/FilteringDetailPage";
import FilteringListPage from "./pages/admin/filtering/FilteringListPage";
import FilteringModifyPage from "./pages/admin/filtering/FilteringModifyPage";
import AdminInterestManager from "./pages/admin/interest/AdminInterestManager.jsx";
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
import FeedMain from "./pages/feed/FeedMain";
import CalendarPage from "./pages/mylibrary/calendar/CalendarPage.jsx";
import FollowList from "./pages/mylibrary/follow/FollowList";
import InterestEditPage from "./pages/mylibrary/interest/InterestEdit.jsx";
import InterestViewPage from "./pages/mylibrary/interest/InterestView.jsx";
import MyLibraryGuestPage from "./pages/mylibrary/mainpage/MyLibraryGuestPage.jsx";
import MyLibraryPage from './pages/mylibrary/mainpage/MyLibraryPage.jsx';
import PostList from "./pages/mylibrary/mypost/PostList";
import EditProfilePage from "./pages/mylibrary/profile/EditProfilePage.jsx";
import PostDetail from "./pages/post/PostDetail";
import PostWriting from "./pages/post/PostWriting.jsx";
import PostWritingBook from "./pages/post/PostWritingBook";
import SearchBookList from './pages/searchList/SearchBookList';
import SearchVideoList from './pages/searchList/SearchVideoList';
import Faq from './pages/serviceCenter/Faq';
import NoticeDetail from "./pages/serviceCenter/NoticeDetail";
import NoticeList from "./pages/serviceCenter/NoticeList";
import QnaDetail from './pages/serviceCenter/QnaDetail';
import QnaList from './pages/serviceCenter/QnaList';
import QnaWriting from './pages/serviceCenter/QnaWriting';
import AccessDenied from "./pages/user/AccessDenied.jsx";
import AccountSuspended from "./pages/user/AccountSuspended.jsx";
import FindAccount, { FindIdForm, FindPwdForm } from "./pages/user/FindAccount";
import Join from "./pages/user/Join";
import JoinComplete from './pages/user/JoinComplete';
import Login from "./pages/user/Login";
import UserDelete from "./pages/user/UserDelete";
import UserDeleteComplete from "./pages/user/UserDeleteComplete";
import UserEdit from "./pages/user/UserEdit";
import UserMain from "./pages/user/UserMain";
import VerifyPwd from "./pages/user/VerifyPwd";
import PlayVideo from "./pages/videoDetail/PlayVideo";
import VerifyPwdForDelete from "./pages/user/VerifyPwdForDelete.jsx";
import ContentStatsPage from "./pages/admin/statistics/ContentStatistics/ContentStatsPage.jsx"
import InterestStatsPage from "./pages/admin/statistics/InterestStatistcs/InterestStatsPage.jsx";


function App() {
    const dispatch = useDispatch();

    // isNavOpen 상태는 App.js에 유지하거나, Layout 컴포넌트 내부로 옮길 수 있습니다.
    // 일단 App.js에 유지하는 것으로 가정합니다.
    const [isNavOpen, setIsNavOpen] = useState(false);
    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    useEffect(() => { /* ... 기존 로그인 상태 유지 로직 ... */ }, [dispatch]);

    return (
        <>
            <BrowserRouter>
                {/* Header와 UserNav는 이제 Layout 컴포넌트 안에서 렌더링되도록 합니다. */}
                {/* 따라서 이곳 <Routes> 바깥의 Header, UserNav 컴포넌트 호출은 제거합니다. */}
                {/* <Header toggleNav={toggleNav} setIsOpen={setIsNavOpen} /> */}
                {/* <UserNav isOpen={isNavOpen} setIsOpen={setIsNavOpen} /> */}

                <Routes>
                    <Route path="/access-denied" element={<AccessDenied />} />

                    {/* ✨ Layout 컴포넌트로 isNavOpen 상태와 함수들을 전달합니다. ✨ */}
                    <Route
                        path="/"
                        element={<Layout isNavOpen={isNavOpen} setIsOpen={setIsNavOpen} toggleNav={toggleNav} />}
                    >
                        <Route index element={<UserMain />} />
                        <Route path="users/login" element={<Login />} />
                        <Route path="users/join" element={<Join />} />
                        <Route path="users/join/complete" element={<JoinComplete />} />
                        <Route path="users/verifypwd" element={<VerifyPwd />} />
                        <Route path="users/edit" element={<UserEdit />} />
                        <Route path="users/delete" element={<UserDelete />} />
                        <Route path="users/verifypwd/delete" element={<VerifyPwdForDelete />} />
                        <Route path="users/delete/complete" element={<UserDeleteComplete />} />
                        <Route path="account/suspended" element={<AccountSuspended />} />
                        <Route path="account" element={<FindAccount />}>
                            <Route index element={<Navigate to="findId" replace />} />
                            <Route path="findId" element={<FindIdForm />} />
                            <Route path="findPwd" element={<FindPwdForm />} />
                        </Route>
                        <Route path="/bookPage/:bookIsbn" element={<BookPage />} />
                        <Route path="/notice" element={<NoticeList />} />
                        <Route path="/notice/detail/:noticeId" element={<NoticeDetail />} />
                        <Route path="/qna" element={<QnaList />} />
                        <Route path="/qna/detail/:qnaId" element={<QnaDetail />} />
                        <Route path="/qna/writing" element={<QnaWriting />} />
                        <Route path="/qna/writing/:qnaId" element={<QnaWriting />} />
                        <Route path="/faq" element={<Faq />} />
                        <Route path="/bookmark/:targetUserId" element={<Bookmark />} />
                        <Route path="/notice" element={<Search />} />
                        <Route path="/search/video" element={<SearchVideoList />} />
                        <Route path="/search/book" element={<SearchBookList />} />
                        <Route path="/video/:videoId" element={<PlayVideo />} />
                        <Route path="mylibrary" element={<MyLibraryPage />} />
                        <Route path="guestlibrary" element={<MyLibraryGuestPage />} />
                        <Route path="mylibrary/profile" element={<EditProfilePage />} />
                        <Route path="mylibrary/interest" element={<InterestViewPage />} />
                        <Route path="mylibrary/interest/edit" element={<InterestEditPage />} />
                        <Route path="mylibrary/calendar" element={<CalendarPage />} />
                        <Route path="mylibrary/post/writing" element={<PostWriting />} />
                        <Route path="mylibrary/post/writing/book" element={<PostWritingBook />} />
                        <Route path="mylibrary/post/:postId" element={<PostDetail />} />
                        <Route path="feed" element={<FeedMain />} />
                        <Route path="mylibrary/follow" element={<FollowList />} />
                        <Route path="mylibrary/postlist/:userId" element={<PostList />} />
                        <Route path="/mylibrary/:userId" element={<MyLibraryPage />} />
                    </Route>

                    {/* 관리자 페이지는 AdminLayout을 사용하므로, UserNav와 Header가 나타나지 않습니다. */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminMain />} />
                        <Route path="users/list" element={<UserManagement />} />
                        <Route path="filtering" element={<FilteringListPage />} />
                        <Route path="filtering/create" element={<FilteringCreatePage />} />
                        <Route path="filtering/:groupId" element={<FilteringDetailPage />} />
                        <Route path="filtering/:groupId/edit" element={<FilteringModifyPage />} />
                        <Route path="reported/review" element={<ReportedReviewListPage />} />
                        <Route path="reported/review/:reportId" element={<ReportedReviewDetailPage />} />
                        <Route path="reported/post" element={<ReportedPostListPage />} />
                        <Route path="reported/post/:reportId" element={<ReportedPostDetailPage />} />
                        <Route path="/admin/notice" element={<AdminNoticeList />} />
                        <Route path="/admin/notice/writing" element={<AdminNoticeWriting />} />
                        <Route path="/admin/faq" element={<AdminFaqList />} />
                        <Route path="/admin/faq/writing" element={<AdminFaqWriting />} />
                        <Route path="/admin/faq/edit/:faqId" element={<AdminFaqWriting />} />
                        <Route path="/admin/notice/edit/:noticeId" element={<AdminNoticeWriting />} />
                        <Route path="/admin/qna" element={<AdminQnaList />} />
                        <Route path="/admin/qna/answer" element={<AdminQnaAnswer />} />
                        <Route path="/admin/qna/detail/:qnaId" element={<AdminQnaDetail />} />
                        <Route path="/admin/interest" element={< AdminInterestManager />} />
                        <Route path="/admin/curation" element={<CurationManagerPage />} />
                        <Route path="/admin/analytics/clicklog" element={<ContentStatsPage />} />
                        <Route path="/admin/analytics/interest" element={<InterestStatsPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;