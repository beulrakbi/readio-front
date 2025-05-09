import { BrowserRouter, Route, Routes } from "react-router-dom";
import BookPage from '../src/pages/book/BookPage';
import Layout from './layouts/Layout';
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
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
