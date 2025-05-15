import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import UserMain from "./pages/user/UserMain";
import PostWriting from "./pages/post/PostWriting";
import PostWritingBook from "./pages/post/PostWritingBook";
import PostDetail from "./pages/post/PostDetail";
import FeedMain from "./pages/feed/FeedMain";
import FollowList from "./pages/mylibrary/follow/FollowList"
import PostList from "./pages/mylibrary/mypost/PostList"

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
            <Route path="feed" element={<FeedMain/>}/>
            <Route path="mylibrary/follow" element={<FollowList/>}/>
            <Route path="mylibrary/postlist" element={<PostList/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
