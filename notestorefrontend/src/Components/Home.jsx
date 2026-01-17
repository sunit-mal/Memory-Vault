import React from "react";
import { request } from "./Axios_helper";
import { Pagination, Dropdown, Container, Card } from "react-bootstrap";
import "../Styles/home.css";

import { FaCopy, FaTrash, FaChevronDown, FaSync } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { setCatchMemory } from "./catchMemory";
import CustomModal from "./CustomModal";

function Home() {
  const navigate = useNavigate();
  const [Content, setContent] = React.useState([]);
  const [page, setPage] = React.useState();
  const [pageNo, setPageNo] = React.useState(0);
  const [lang, setLang] = React.useState([]);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const fetchData = (pageNum = 0, isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);

    request(
      "GET",
      "/command/fetch/5/" + pageNum,
      "application/json",
      {},
      "application/json"
    ).then((response) => {
      if (response.status === 200) {
        if (pageNum === 0) {
          setContent(response.data.Content);
        } else {
          setContent((prev) => [...prev, ...response.data.Content]);
        }
        setPage(response.data.pagination);

        if (isRefresh) {
          setTimeout(() => {
            setIsRefreshing(false);
            toast.success("Content refreshed!");
          }, 500);
        }
      } else {
        // Handle error state
        if (isRefresh) setIsRefreshing(false);
      }
    });
  };

  React.useEffect(() => {
    fetchData(pageNo);
  }, [pageNo]);


  const fetchLanguages = () => {
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
  };

  React.useEffect(() => {
    fetchLanguages();
  }, []);

  const handleRefresh = () => {
    setPageNo(0);
    fetchData(0, true);
    fetchLanguages();
  };

  const handleLoadMore = () => {
    if (page && page.pageIndex < page.totalPages - 1) {
      setPageNo(page.pageIndex + 1);
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

  const handleDelete = (id) => {
    setItemToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      request(
        "DELETE",
        "/command/delete/" + itemToDelete,
        "application/json",
        {},
        "application/json"
      ).then((response) => {
        if (response.status === 200) {
          toast.success("Command deleted successfully");
          setShowDeleteModal(false);
          setItemToDelete(null);
          // Refresh content by resetting to first page
          setPageNo(0);
          request(
            "GET",
            "/command/fetch/5/0",
            "application/json",
            {},
            "application/json"
          ).then((response) => {
            if (response.status === 200) {
              setContent(response.data.Content);
              setPage(response.data.pagination);
            } else if (response.status === 204) {
              setContent([]);
              setPage(null);
            }
          });
        }
      });
    }
  };

  return (
    <Container className="py-4">
      <Card className="formbody mx-auto" style={{ maxWidth: "900px" }}>

        <Card.Header className="formheader">
          <div className="header-container">
            <h2 className="text-center my-3">Commands</h2>
            <button
              className={`btn-refresh ${isRefreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh commands"
            >
              <FaSync />
            </button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Dropdown className="filter-dropdown">
              <Dropdown.Toggle variant="outline-primary" id="dropdown-basic" className="rounded-pill px-4">
                Filter by Language
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => navigate("/")} className="text-secondary fw-bold">
                  All Languages (Clear)
                </Dropdown.Item>
                <Dropdown.Divider />
                {lang &&
                  lang.map((item, index) => (
                    <Dropdown.Item key={index} onClick={() => filterOnLang(item)}>
                      {item}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>

          <CustomModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            title="Delete Command"
            message="Are you sure you want to delete this command? This action cannot be undone."
          />

          <div className="animate-content">
            {Content && Content.length > 0 ? (
              Content.map((item, index) => (
                <div key={index} className="mb-4 command-box">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5 className="mb-0 fw-bold border-bottom pb-1" style={{ color: "#6c63ff" }}>{item.language}</h5>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary rounded-circle"
                        onClick={() => handleCopy(item.command)}
                        title="Copy command"
                      >
                        <FaCopy />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger rounded-circle"
                        onClick={() => handleDelete(item.id)}
                        title="Delete command"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                  <pre className="command-pre">
                    {item.command}
                  </pre>
                </div>
              ))
            ) : (
              <div className="text-center py-5">
                <p className="text-muted">No commands found.</p>
              </div>
            )}
          </div>

          {page && page.totalElements > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {Math.min(Content.length, page.totalElements)} of {page.totalElements} commands
              </div>
              {page.pageIndex < page.totalPages - 1 && (
                <button
                  className="btn btn-load-more rounded-pill"
                  onClick={handleLoadMore}
                >
                  Load More <FaChevronDown className="load-more-icon" />
                </button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Home;
