import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import UserMain from "./pages/user/UserMain";
import PostWriting from "./pages/post/PostWriting";
import FindAccount, { FindIdForm, FindPwdForm } from "./pages/user/FindAccount";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
          <Route path="post/writing" element={<PostWriting/>}/>
        <Route path="/find-account" element={<FindAccount />}>
          <Route index element={<Navigate to="find-id" replace />} />
          <Route path="find-id" element={<FindIdForm />} />
          <Route path="find-pwd" element={<FindPwdForm />} />
          </Route>
        </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
