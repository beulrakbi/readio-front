import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookPage from '../src/pages/book/BookPage';
import AdminLayout from "./layouts/AdminLayout";
import Layout from './layouts/Layout';
import AdminMain from "./pages/admin/AdminMain";
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
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
