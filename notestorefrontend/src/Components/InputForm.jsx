import React from "react";
import {
  Form,
  Button,
  Card,
  InputGroup,
  CardHeader,
  Nav,
  Container,
} from "react-bootstrap";
import "../Styles/Form.css";
import InputGroupText from "react-bootstrap/esm/InputGroupText";
import toast from "react-hot-toast";
import { request } from "./Axios_helper";

function InputForm() {
  const [open, setOpen] = React.useState("command");
  const [commandData, setCommandData] = React.useState({
    language: "",
    command: "",
  });
  const [noteData, setNoteData] = React.useState({
    title: "",
    fullNote: "",
  });

  const handleCommandChange = (e) => {
    const { name, value } = e.target;
    setCommandData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleNoteChange = (e) => {
    const { name, value } = e.target;
    setNoteData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const commandSubmit = () => {
    if (commandData.language && commandData.command) {
      toast.promise(saveCommand(), {
        loading: "Saving...",
        success: <b>Settings saved!</b>,
        error: <b>Could not save.</b>,
      });
    } else {
      toast.error("Please fill all the fields", {
        style: {
          borderRadius: "10px",
          background: "#9c0202",
          color: "#fff",
        },
      });
    }
  };

  const noteSubmit = () => {
    if (noteData.title && noteData.fullNote) {
      toast.promise(saveNote(), {
        loading: "Saving...",
        success: <b>Settings saved!</b>,
        error: <b>Could not save.</b>,
      });
    } else {
      toast.error("Please fill all the fields", {
        style: {
          borderRadius: "10px",
          background: "#9c0202",
          color: "#fff",
        },
      });
    }
  };

  const saveCommand = () => {
    return new Promise((resolve, reject) => {
      request(
        "POST",
        "/command/save",
        "application/json",
        commandData,
        "application/json"
      )
        .then((response) => {
          if (response.status === 201) {
            resolve();
            setCommandData({
              language: "",
              command: "",
            });
          } else {
            reject();
          }
        })
        .catch(() => {
          reject();
        });
    });
  };

  const saveNote = () => {
    return new Promise((resolve, reject) => {
      request(
        "POST",
        "/note/save",
        "application/json",
        noteData,
        "application/json"
      )
        .then((response) => {
          if (response.status === 201) {
            resolve();
            setNoteData({
              title: "",
              fullNote: "",
            });
          } else {
            reject();
          }
        })
        .catch(() => {
          reject();
        });
    });
  };

  return (
    <>
      <Container className="containerClass">
        <Card className="formbody">
          <h2>Save Information</h2>
          <CardHeader className="formheader">
            <Nav variant="tabs" style={{ display: "flex" }}>
              <Nav.Item
                className={`tabs ${open === "command" ? "active" : ""}`}
                onClick={() => setOpen("command")}
              >
                <Nav.Link>Command</Nav.Link>
              </Nav.Item>
              <Nav.Item
                className={`tabs ${open === "note" ? "active" : ""}`}
                onClick={() => setOpen("note")}
              >
                <Nav.Link>Note</Nav.Link>
              </Nav.Item>
            </Nav>
          </CardHeader>
          <Card.Body>
            <Form className="formArea">
              {open === "command" ? (
                <Container>
                  <footer className="blockquote-footer">Command Store</footer>
                  <InputGroup className="mb-3">
                    <InputGroupText>Language</InputGroupText>
                    <br />
                    <Form.Control
                      type="text"
                      name="language"
                      value={commandData.language}
                      onChange={handleCommandChange}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupText>Command</InputGroupText>
                    <br />
                    <Form.Control
                      type="text"
                      name="command"
                      value={commandData.command}
                      onChange={handleCommandChange}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <Button variant="primary" onClick={commandSubmit}>
                      Submit
                    </Button>
                  </InputGroup>
                </Container>
              ) : (
                <Container>
                  <footer className="blockquote-footer">Note Store</footer>
                  <InputGroup className="mb-3">
                    <InputGroupText>Title</InputGroupText>
                    <br />
                    <Form.Control
                      type="text"
                      name="title"
                      value={noteData.title}
                      onChange={handleNoteChange}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <InputGroupText>Note</InputGroupText>
                    <br />
                    <Form.Control
                      as="textarea"
                      aria-label="With textarea"
                      name="fullNote"
                      value={noteData.fullNote}
                      onChange={handleNoteChange}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <Button variant="primary" onClick={noteSubmit}>Submit</Button>
                  </InputGroup>
                </Container>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}

export default InputForm;
