import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from './layouts/Layout';
import UserMain from "./pages/user/UserMain";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout/>}>
          <Route index element={<UserMain/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
