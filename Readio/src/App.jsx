import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import UserMain from "./pages/user/UserMain";
import PostWriting from "./pages/post/PostWriting";
import PostWritingBook from "./pages/post/PostWritingBook";
import PostDetail from "./pages/post/PostDetail";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<UserMain/>}/>
            <Route path="post/writing" element={<PostWriting/>}/>
            <Route path="post/writing/book" element={<PostWritingBook/>}/>
            <Route path="post" element={<PostDetail/>}/>
        </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
