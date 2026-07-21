
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/auth/Login"
import Signup from "./pages/auth/Signup"
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";

{/* <Login/>
<Signup/> */}


function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route element={<AppLayout/>} >

           <Route path="/" element={<Home/>}/>
           <Route path="/about" element={<About/>}/>
           <Route path="/contact" element={<Contact/>}/>



          </Route>

          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>

      </Routes>


    </BrowserRouter>
  )
}

export default App