import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import PostWriting from "./pages/post/PostWriting";
import UserMain from "./pages/user/UserMain";
import VideoPage from "./pages/videoDetail/VideoPage";
import SearchList from "./pages/videoDetail/SearchList";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
          <Route path="post/writing" element={<PostWriting/>}/>
        </Route>

        <Route path="/video" element={<VideoPage />} />
        <Route path="/search/video" element={<SearchList />} />

        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
