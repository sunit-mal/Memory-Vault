import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Home from "./Home";
import SideNav from "./SideNav";
import InputForm from "./InputForm";
import Note from "./Note";
import { Toaster } from "react-hot-toast";
import LanguageBaseCommand from "./LanguageBaseCommand";

function Main() {
  return (
    <>
      <Router>
        <SideNav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/store" element={<InputForm />} />
          <Route path="/note" element={<Note />} />
          <Route path="/filter" element={<LanguageBaseCommand />} />
        </Routes>
        <Toaster position="top-right" reverseOrder={false} />
      </Router>
    </>
  );
}

export default Main;
