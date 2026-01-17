import React from "react";
import { request } from "./Axios_helper";
import { Pagination, Accordion, Card, Container } from "react-bootstrap";

import { FaCopy, FaTrash, FaChevronDown, FaSync } from "react-icons/fa";
import toast from "react-hot-toast";
import CustomModal from "./CustomModal";

function Note() {
  const [Content, setContent] = React.useState([]);
  const [page, setPage] = React.useState();
  const [pageNo, setPageNo] = React.useState(0);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [noteToDelete, setNoteToDelete] = React.useState(null);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const fetchData = (pageNum = 0, isRefresh = false) => {
    if (isRefresh) setIsRefreshing(true);

    request(
      "GET",
      "/note/fetch/5/" + pageNum,
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
            toast.success("Notes refreshed!");
          }, 500);
        }
      } else {
        if (isRefresh) setIsRefreshing(false);
      }
    });
  };

  React.useEffect(() => {
    fetchData(pageNo);
  }, [pageNo]);

  const handleRefresh = () => {
    setPageNo(0);
    fetchData(0, true);
  };

  const handleLoadMore = () => {
    if (page && page.pageIndex < page.totalPages - 1) {
      setPageNo(page.pageIndex + 1);
    }
  };

  const handleDelete = (id, title) => {
    setNoteToDelete({ id, title });
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (noteToDelete) {
      request(
        "DELETE",
        "/note/delete/" + noteToDelete.id,
        "application/json",
        {},
        "application/json"
      ).then((response) => {
        if (response.status === 200) {
          toast.success("Note deleted successfully");
          setShowDeleteModal(false);
          setNoteToDelete(null);
          // Refresh content by resetting to first page
          setPageNo(0);
          request(
            "GET",
            "/note/fetch/5/0",
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
            <h2 className="text-center my-3">Notes</h2>
            <button
              className={`btn-refresh ${isRefreshing ? 'refreshing' : ''}`}
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh notes"
            >
              <FaSync />
            </button>
          </div>
        </Card.Header>
        <Card.Body>
          <CustomModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
            title="Delete Note"
            message={`Are you sure you want to delete the note: "${noteToDelete?.title}"? This action cannot be undone.`}
          />

          <div className="animate-content">
            <div className="accordion-wrapper mb-4">
              {Content && Content.length > 0 ? (
                <Accordion className="accordion-group">
                  {Content.map((item, index) => (
                    <Accordion.Item key={index} eventKey={index.toString()} className="mb-3 border-0 shadow-sm overflow-hidden rounded-4">
                      <Accordion.Header>{item.title}</Accordion.Header>
                      <Accordion.Body>
                        <div className="d-flex flex-column">
                          {item.image && (
                            <div className="mb-3 text-center">
                              <img
                                src={"http://localhost:8080" + item.image}
                                alt="Note Attachment"
                                style={{ maxWidth: "100%", maxHeight: "350px", borderRadius: "12px", border: "1px solid var(--header-border)" }}
                              />
                            </div>
                          )}
                          <div className="d-flex justify-content-between align-items-start gap-3">
                            <div className="note-content flex-grow-1" dangerouslySetInnerHTML={{ __html: item.fullNote }}></div>
                            <div className="d-flex flex-column gap-2">
                              <button
                                className="btn btn-sm btn-outline-secondary rounded-circle"
                                onClick={() => {
                                  const getText = (html) => new DOMParser().parseFromString(html, "text/html").body.textContent;
                                  navigator.clipboard.writeText(getText(item.fullNote));
                                  toast.success("Copied to clipboard!");
                                }}
                                title="Copy to clipboard"
                              >
                                <FaCopy size={16} />
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger rounded-circle"
                                onClick={() => handleDelete(item.id, item.title)}
                                title="Delete note"
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                <div className="text-center py-5">
                  <p className="text-muted">No notes found.</p>
                </div>
              )}
            </div>
          </div>

          {page && page.totalElements > 0 && (
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {Math.min(Content.length, page.totalElements)} of {page.totalElements} notes
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

export default Note