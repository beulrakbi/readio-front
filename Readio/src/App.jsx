import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import PostWriting from "./pages/post/PostWriting";
import UserDelete from "./pages/user/UserDelete";
import UserMain from "./pages/user/UserMain";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
          <Route path="post/writing" element={<PostWriting/>}/>
          
          <Route path="users/delete" element={<UserDelete/>}/>    {/* 회원탈퇴 */}
        </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
