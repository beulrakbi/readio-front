import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import UserMain from "./pages/user/UserMain";
import PostWriting from "./pages/post/PostWriting";
import JoinComplete from "./pages/user/JoinComplete";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<UserMain />} />
            <Route path="post/writing" element={<PostWriting />} />
            <Route path="/join/complete" element={<JoinComplete />} /> {/* 회원가입 완료 */}
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
