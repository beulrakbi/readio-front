
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import PostWriting from "./pages/post/PostWriting";
import UserEdit from "./pages/user/UserEdit";
import UserMain from "./pages/user/UserMain";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
          <Route path="post/writing" element={<PostWriting/>}/>
          
        <Route path="users/edit" element={<UserEdit />} /> {/* 회원정보 수정 */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;