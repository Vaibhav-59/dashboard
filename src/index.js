// import React from "react";
// import ReactDOM from "react-dom/client";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import "./index.css";
// import Home from "./components/Home";

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Routes>
//         <Route path="/*" element={<Home />} />
//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );

import { StrictMode } from 'react'

import './index.css'
import { createRoot } from "react-dom/client";




import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from "./components/Home"





createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>

    <Routes>
      <Route path="/*" element = {<Home/>} ></Route>
    </Routes>
    </BrowserRouter>
    
  </StrictMode>,
)
