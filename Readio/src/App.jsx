import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import PostWriting from "./pages/post/PostWriting";
import SearchBookList from './pages/searchList/SearchBookList';
import SearchVideoList from './pages/searchList/SearchVideoList';
import UserMain from "./pages/user/UserMain";
import PlayVideo from "./pages/videoDetail/PlayVideo";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<UserMain/>}/>
            <Route path="post/writing" element={<PostWriting/>}/>
            <Route path="/search/video" element={<SearchVideoList />} />
            <Route path="/search/book" element={<SearchBookList />} />
            <Route path="/video" element={<PlayVideo />} />
          </Route>


        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
