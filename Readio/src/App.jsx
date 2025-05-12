import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import UserMain from "./pages/user/UserMain";
import MyLibraryPage from './pages/user/MyLibraryPage';
import NoticeList from "./pages/user/NoticeList";
import NoticeDetail from "./pages/user/NoticeDetail";
import MyLibraryGuestPage from "./components/mylibrary/mainpage/MyLibraryGuestPage.jsx";
import EditProfilePage from "./components/mylibrary/profile/EditProfilePage.jsx";


function App() {

  return (
    <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<UserMain />} />
                    <Route path="mylibrary" element={<MyLibraryPage />} />
                    <Route path="guestlibrary" element={<MyLibraryGuestPage />} />
                    <Route path="mylibrary/editprofile" element={<EditProfilePage />} />
                    <Route path="notice" element={<NoticeList />} />
                    <Route path="notice/detail" element={<NoticeDetail />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </>
  )
}

export default App
