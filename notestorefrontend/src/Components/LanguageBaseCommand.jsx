import React from "react";
import { request } from "./Axios_helper";
import { Pagination, Dropdown } from "react-bootstrap";
import "../Styles/home.css";
import { FaCopy } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setCatchMemory } from "./catchMemory";
import { getCatchMemory } from "./catchMemory";

function LanguageBaseCommand() {
  const filterLang = getCatchMemory();
  const navigate = useNavigate();
  const [Content, setContent] = React.useState([]);
  const [page, setPage] = React.useState();
  const [pageNo, setPageNo] = React.useState(0);
  const [lang, setLang] = React.useState([]);
  React.useEffect(() => {
    request(
      "GET",
      `/command/fetch-by-lang/5/${pageNo}/${filterLang}`,
      "application/json",
      {},
      "application/json"
    ).then((response) => {
      if (response.status === 200) {
        setContent(JSON.parse(response.data).Content);
        setPage(JSON.parse(response.data).pagination);
      }
    });
  }, [pageNo, filterLang]);

  React.useEffect(() => {
    request(
      "GET",
      "/command/get-lang",
      "application/json",
      {},
      "application/json"
    ).then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        setLang(JSON.parse(response.data));
      }
    });
  }, []);

  const handlePageChange = (pageNo, min, max) => {
    if (pageNo < min) {
      setPageNo(min);
    } else if (pageNo > max) {
      setPageNo(max);
    } else {
      setPageNo(pageNo);
    }
  };

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content);
    toast("Copied!", {
      icon: "👏",
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const filterOnLang = (lang) => {
    setCatchMemory(lang);
    navigate("/filter");
  };

  return (
    <div className="container">
      <h1>Commands</h1>
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Language
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {lang &&
            lang.map((item, index) => (
              <Dropdown.Item key={index} onClick={() => filterOnLang(item)}>
                {item}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
      {Content &&
        Content.map((item, index) => (
          <div key={index}>
            <h2>{item.language}</h2>
            <pre className="base-text">
              {item.command}{" "}
              <FaCopy
                onClick={() => handleCopy(item.command)}
                style={{ cursor: "pointer" }}
              />
            </pre>
          </div>
        ))}
      {page && page.totalPages > 1 && (
        <Pagination>
          <Pagination.First onClick={() => handlePageChange(0)} />
          <Pagination.Prev
            onClick={() =>
              handlePageChange(page.pageIndex - 1, 0, page.totalPages - 1)
            }
          />
          {pageNo > 0 ? <Pagination.Ellipsis /> : null}
          <Pagination.Item active>{page.pageIndex}</Pagination.Item>
          {pageNo < page.totalPages - 1 ? <Pagination.Ellipsis /> : null}
          <Pagination.Next
            onClick={() =>
              handlePageChange(page.pageIndex + 1, 0, page.totalPages - 1)
            }
          />
          <Pagination.Last
            onClick={() => handlePageChange(page.totalPages - 1)}
          />
        </Pagination>
      )}
    </div>
  );
}

export default LanguageBaseCommand;
