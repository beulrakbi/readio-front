import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import UserMain from "./pages/user/UserMain";
import MyLibraryPage from './pages/mylibrary/mainpage/MyLibraryPage.jsx';
import NoticeList from "./pages/user/NoticeList";
import NoticeDetail from "./pages/user/NoticeDetail";
import MyLibraryGuestPage from "./pages/mylibrary/mainpage/MyLibraryGuestPage.jsx";
import EditProfilePage from "./pages/mylibrary/profile/EditProfilePage.jsx";
import PostWriting from "./pages/post/PostWriting.jsx";
import InterestViewPage from "./pages/mylibrary/interest/InterestView.jsx";
import InterestEditPage from "./pages/mylibrary/interest/InterestEdit.jsx";
import CalendarPage from "./pages/mylibrary/calendar/CalendarPage.jsx";
function App() {

    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<UserMain />} />
                        <Route path="mylibrary" element={<MyLibraryPage />} />
                        <Route path="guestlibrary" element={<MyLibraryGuestPage />} />
                        <Route path="mylibrary/profile" element={<EditProfilePage />} />
                        <Route path="notice" element={<NoticeList />} />
                        <Route path="notice/detail" element={<NoticeDetail />} />
                        <Route path="post/writing" element={<PostWriting/>}/>
                        <Route path="mylibrary/interest" element={<InterestViewPage/>}/>
                        <Route path="mylibrary/interest/edit" element={<InterestEditPage/>}/>
                        <Route path="mylibrary/calendar" element={<CalendarPage/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
