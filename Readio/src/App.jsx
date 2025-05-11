import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import PostWriting from "./pages/post/PostWriting";
import UserMain from "./pages/user/UserMain";
import SearchBookList from "./pages/videoDetail/SearchBookList";
import SearchVideoList from "./pages/videoDetail/SearchVIdeoList";
import VideoPage from "./pages/videoDetail/VideoPage";


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
            <Route path="/video" element={<VideoPage />} />
          </Route>

          {/* <Route path="/" element={<Layout/>}>
            <Route path="/" element={<UserMain/>}>
                <Route path="/search/video" element={<SearchVideoList />} />
                <Route path="/search/book" element={<SearchBookList />} />
            </Route>
          </Route> */}

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
