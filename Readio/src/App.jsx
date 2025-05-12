import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import AdminNoticeList from "./pages/boardManagement/adminNoticeList";
import PostWriting from "./pages/post/PostWriting";
import Faq from "./pages/serviceCenter/Faq";
import NoticeDetail from "./pages/serviceCenter/NoticeDetail";
import NoticeList from "./pages/serviceCenter/NoticeList";
import QnaDetail from "./pages/serviceCenter/QnaDetail";
import QnaList from "./pages/serviceCenter/QnaList";
import QnaWriting from "./pages/serviceCenter/QnaWriting";
import UserMain from "./pages/user/UserMain";



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* 메인페이지 */}
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
          <Route path="post/writing" element={<PostWriting/>}/>
          <Route path="/notice" element={<NoticeList/>}/>
          <Route path="/notice/detail" element={<NoticeDetail/>}/>
          <Route path="/qna" element={<QnaList/>}/>
          <Route path="/qna/detail" element={<QnaDetail/>}/>
          <Route path="/qna/writing" element={<QnaWriting/>}/>
          <Route path="/faq" element={<Faq/>}/>
        </Route>
          {/* 어드민 페이지 */}
          <Route path="/admin/notice" element={<AdminNoticeList/>}/>

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
