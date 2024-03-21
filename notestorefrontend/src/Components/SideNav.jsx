import React from "react";
import { Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { HiCommandLine } from "react-icons/hi2";
import { GiStabbedNote } from "react-icons/gi";
import { GiSecretBook } from "react-icons/gi";

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
    <Nav variant="tabs">
      <Nav.Item>
        <Nav.Link
          onClick={(props) => handleNav("/")}
          active={tabs === "command" ? true : false}
        >
          <HiCommandLine />
          Command
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          onClick={(props) => handleNav("/note")}
          active={tabs === "note" ? true : false}
        >
          <GiStabbedNote />
          Note
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link
          onClick={(props) => handleNav("/store")}
          active={tabs === "store" ? true : false}
        >
          <GiSecretBook />
          Store new
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default SideNav;
