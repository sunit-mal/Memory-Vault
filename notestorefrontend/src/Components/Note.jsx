import React from "react";
import { request } from "./Axios_helper";
import { Pagination, Accordion } from "react-bootstrap";

function Note() {
    const [Content, setContent] = React.useState([]);
  const [page, setPage] = React.useState();
  const [pageNo, setPageNo] = React.useState(0);

  React.useEffect(() => {
    request(
      "GET",
      "/note/fetch/5/" + pageNo,
      "application/json",
      {},
      "application/json"
    ).then((response) => {
      if (response.status === 200) {
        console.log(response.data);
        setContent(JSON.parse(response.data).Content);
        setPage(JSON.parse(response.data).pagination);
      }
    });
  }, [pageNo]);

  const handlePageChange = (pageNo, min, max) => {
    if (pageNo < min) {
      setPageNo(min);
    } else if (pageNo > max) {
      setPageNo(max);
    } else {
      setPageNo(pageNo);
    }
  };

  return (
    <div className="container">
      <h1>Note</h1>
      {Content &&
        Content.map((item, index) => (
          <Accordion>
          <Accordion.Item eventKey={index}>
            <Accordion.Header>{item.title}</Accordion.Header>
            <Accordion.Body>
              {item.fullNote}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
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
          {pageNo < page.totalPages - 1 ? <Pagination.Ellipsis /> :null }
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
  )
}

export default Note