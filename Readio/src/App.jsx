import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import UserMain from "./pages/user/UserMain";
import NoticeList from "./pages/user/NoticeList";
import NoticeDetail from "./pages/user/NoticeDetail";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
          <Route path="/notice" element={<NoticeList/>}/>
          <Route path="/notice/detail" element={<NoticeDetail/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
