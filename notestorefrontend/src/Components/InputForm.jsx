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

import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

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
  const [image, setImage] = React.useState(null);

  const [lang, setLang] = React.useState([]);
  const [isLanguageFocused, setIsLanguageFocused] = React.useState(false);
  const [filteredLang, setFilteredLang] = React.useState([]);

  React.useEffect(() => {
    request(
      "GET",
      "/command/get-lang",
      "application/json",
      {},
      "application/json"
    ).then((response) => {
      if (response.status === 200) {
        setLang(response.data);
        setFilteredLang(response.data);
      }
    });
  }, []);

  const handleCommandChange = (e) => {
    const { name, value } = e.target;
    setCommandData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
    if (name === "language") {
      const filtered = lang.filter((l) =>
        l.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLang(filtered);
      setIsLanguageFocused(true);
    }
  };

  const selectLanguage = (val) => {
    setCommandData((prev) => ({ ...prev, language: val }));
    setIsLanguageFocused(false);
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

  const handleQuillChange = (value) => {
    setNoteData((prevData) => {
      return {
        ...prevData,
        fullNote: value,
      };
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
    // ReactQuill often returns "<p><br></p>" when empty, so we check for meaningful content
    const isNoteEmpty = noteData.fullNote.replace(/<(.|\n)*?>/g, "").trim().length === 0;

    if (noteData.title && !isNoteEmpty) {
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
            // Re-fetch languages in case a new one was added
            request(
              "GET",
              "/command/get-lang",
              "application/json",
              {},
              "application/json"
            ).then((response) => {
              if (response.status === 200) {
                setLang(response.data);
              }
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
      const formData = new FormData();
      formData.append("title", noteData.title);
      formData.append("fullNote", noteData.fullNote);
      if (image) {
        formData.append("image", image);
      }

      request(
        "POST",
        "/note/save",
        "multipart/form-data", // Will be ignored by modified helper for FormData
        formData,
        "application/json"
      )
        .then((response) => {
          if (response.status === 201) {
            resolve();
            setNoteData({
              title: "",
              fullNote: "",
            });
            setImage(null);
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
            <Form className="formArea" onSubmit={(e) => e.preventDefault()}>
              {open === "command" ? (
                <Container>
                  <footer className="blockquote-footer" style={{ color: 'var(--text-muted)' }}>Command Store</footer>
                  <div className="custom-search-container mb-3">
                    <InputGroup>
                      <InputGroupText>Language</InputGroupText>
                      <Form.Control
                        type="text"
                        name="language"
                        autoComplete="off"
                        value={commandData.language}
                        onChange={handleCommandChange}
                        onFocus={() => setIsLanguageFocused(true)}
                        onBlur={() => setTimeout(() => setIsLanguageFocused(false), 200)}
                        placeholder="Search or type language..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            commandSubmit();
                          }
                        }}
                      />
                    </InputGroup>
                    {isLanguageFocused && (
                      <div className="search-results-list shadow">
                        {filteredLang.map((l, index) => {
                          const highlightMatch = (text, query) => {
                            if (!query) return text;
                            const parts = text.split(new RegExp(`(${query})`, 'gi'));
                            return (
                              <span>
                                {parts.map((part, i) =>
                                  part.toLowerCase() === query.toLowerCase() ? (
                                    <span key={i} className="highlighted-text">{part}</span>
                                  ) : part
                                )}
                              </span>
                            );
                          };

                          return (
                            <div
                              key={index}
                              className="search-result-item"
                              onClick={() => selectLanguage(l)}
                            >
                              {highlightMatch(l, commandData.language)}
                            </div>
                          );
                        })}
                        {commandData.language && !lang.includes(commandData.language) && (
                          <div
                            className="search-result-item add-new"
                            onClick={() => selectLanguage(commandData.language)}
                          >
                            <span>+ Create new: </span>
                            <strong>{commandData.language}</strong>
                          </div>
                        )}
                        {filteredLang.length === 0 && !commandData.language && (
                          <div className="search-result-item text-muted small">
                            Start typing to see languages...
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <InputGroup className="mb-3">
                    <InputGroupText>Command</InputGroupText>
                    <br />
                    <Form.Control
                      type="text"
                      name="command"
                      value={commandData.command}
                      onChange={handleCommandChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          commandSubmit();
                        }
                      }}
                    />
                  </InputGroup>
                  <InputGroup className="mb-3">
                    <Button type="button" variant="primary" onClick={commandSubmit}>
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          noteSubmit();
                        }
                      }}
                    />
                  </InputGroup>
                  <div className="mb-3">
                    <Form.Label className="fw-bold" style={{ color: "#495057" }}>Note</Form.Label>
                    <ReactQuill
                      theme="snow"
                      value={noteData.fullNote}
                      onChange={handleQuillChange}
                      style={{ height: "200px", marginBottom: "50px" }} // Keeping margin to accommodate toolbar if needed, though clean CSS handles it better.
                    />
                  </div>
                  <div className="mb-3">
                    <Form.Label className="fw-bold" style={{ color: "#495057" }}>Upload Image</Form.Label>
                    <Form.Control type="file" onChange={handleImageChange} accept="image/*" />
                  </div>
                  <InputGroup className="mb-3">
                    <Button type="button" variant="primary" onClick={noteSubmit}>
                      Submit
                    </Button>
                  </InputGroup>
                </Container>
              )}
            </Form>
          </Card.Body>
        </Card>
      </Container >
    </>
  );
}

export default InputForm;
