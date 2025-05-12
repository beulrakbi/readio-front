import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import PostWriting from "./pages/post/PostWriting";
import UserMain from "./pages/user/UserMain";
import VerifyPwd from "./pages/user/VerifyPwd";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
          <Route path="post/writing" element={<PostWriting/>}/>
          <Route path="verify-pwd" element={<VerifyPwd/>}/>
        </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
