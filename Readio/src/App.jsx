import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookPage from '../src/pages/book/BookPage';
import AdminLayout from "./layouts/AdminLayout";
import Layout from './layouts/Layout';
import AdminMain from "./pages/admin/AdminMain";
import FilteringCreatePage from "./pages/admin/filtering/FilteringCreatePage";
import FilteringDetailPage from "./pages/admin/filtering/FilteringDetailPage";
import FilteringListPage from "./pages/admin/filtering/FilteringListPage";
import FilteringModifyPage from "./pages/admin/filtering/FilteringModifyPage";
import PostWriting from "./pages/post/PostWriting";
import UserMain from "./pages/user/UserMain";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
          <Route path="bookPage" element={<BookPage/>}/>
          </Route>
          <Route path="/admin" element={<AdminLayout/>}>
          <Route index element={<AdminMain/>}/>
          <Route path="filtering/list" element={<FilteringListPage/>}/>
          <Route path="filtering/create" element={<FilteringCreatePage/>}/>
          <Route path="filtering/detail" element={<FilteringDetailPage/>}/>
          <Route path="filtering/modify" element={<FilteringModifyPage/>}/>
          </Route>
          <Route path="post/writing" element={<PostWriting/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
