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
  const [theme, setTheme] = React.useState(localStorage.getItem("theme") || "light");

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <>
      <div className="bg-animation-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Interactive Hanging Bulb Theme Toggle */}
      <div className="bulb-container" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
        <div className="bulb-cord"></div>
        <div className="bulb-main"></div>
      </div>

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
