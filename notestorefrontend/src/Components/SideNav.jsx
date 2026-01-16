import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { HiCommandLine } from "react-icons/hi2";
import { GiStabbedNote } from "react-icons/gi";
import { GiSecretBook } from "react-icons/gi";
import { FiSun, FiMoon } from "react-icons/fi";

function SideNav() {
  const [tabs, setTabs] = React.useState("command");
  const navigate = useNavigate();
  const handleNav = (value) => {
    navigate(value);
    if (value === "/") {
      setTabs("command");
    }
    if (value === "/store") {
      setTabs("store");
    }
    if (value === "/note") {
      setTabs("note");
    }
  };
  return (
    <div className="d-flex justify-content-center mt-3 mb-4 align-items-center">
      <Nav variant="tabs" className="formheader" style={{ borderBottom: 'none' }}>
        <Nav.Item className={`tabs ${tabs === "command" ? "active" : ""}`}>
          <Nav.Link onClick={() => handleNav("/")}>
            <HiCommandLine className="me-2" />
            Command
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className={`tabs ${tabs === "note" ? "active" : ""}`}>
          <Nav.Link onClick={() => handleNav("/note")}>
            <GiStabbedNote className="me-2" />
            Note
          </Nav.Link>
        </Nav.Item>
        <Nav.Item className={`tabs ${tabs === "store" ? "active" : ""}`}>
          <Nav.Link onClick={() => handleNav("/store")}>
            <GiSecretBook className="me-2" />
            Store new
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </div>
  );
}

export default SideNav;
