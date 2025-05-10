import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import PostWriting from "./pages/post/PostWriting";
import NoticeDetail from './pages/user/NoticeDetail';
import NoticeList from './pages/user/NoticeList';
import UserMain from "./pages/user/UserMain";
import QnaList from "./pages/user/QnaLIst";
import QnaDetail from "./pages/user/QnaDetail";
import QnaWriting from "./pages/user/QnaWriting";



function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
          <Route path="post/writing" element={<PostWriting/>}/>
          <Route path="/notice" element={<NoticeList/>}/>
          <Route path="/notice/detail" element={<NoticeDetail/>}/>
          <Route path="/qna" element={<QnaList/>}/>
          <Route path="/qna/detail" element={<QnaDetail/>}/>
          <Route path="/qna/writing" element={<QnaWriting/>}/>
        </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
