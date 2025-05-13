import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import PostWriting from "./pages/post/PostWriting";
import UserDeleteComplete from "./pages/user/UserDeleteComplete";
import UserMain from "./pages/user/UserMain";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
          <Route path="post/writing" element={<PostWriting/>}/>

          <Route path="users/delete/complete" element={<UserDeleteComplete/>} />
        </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
