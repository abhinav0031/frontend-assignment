import React, { useState, useEffect } from "react";
import "./Pagination.css";

const Pagination = ({
  totalProjects,
  projectsPerPage,
  setCurrentPage,
  currentPage,
}) => {
  const [pageNumbers, setPageNumbers] = useState([]);

  const totalPages = Math.ceil(totalProjects / projectsPerPage);

  useEffect(() => {
    const getPaginationNumbers = () => {
      const newPageNumbers = [];

      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          newPageNumbers.push(i);
        }
      } else {
        newPageNumbers.push(1);

        if (currentPage > 3) {
          newPageNumbers.push("...");
        }

        const start = Math.max(currentPage - 1, 2);
        const end = Math.min(currentPage + 1, totalPages - 1);

        for (let i = start; i <= end; i++) {
          if (!newPageNumbers.includes(i)) {
            newPageNumbers.push(i);
          }
        }

        if (currentPage < totalPages - 2) {
          newPageNumbers.push("...");
        }

        if (totalPages > 1) {
          newPageNumbers.push(totalPages);
        }
      }

      setPageNumbers(newPageNumbers);
    };

    getPaginationNumbers();
  }, [currentPage, totalPages]);
  return (
    <div
      className="pagination"
      role="navigation"
      aria-label="Pagination controls"
    >
      <div>
        {pageNumbers.map((number, index) =>
          number === "..." ? (
            <span key={`dots-${index}`} className="dots" aria-hidden="true">
              {number}
            </span>
          ) : (
            <button
              key={number}
              className={number === currentPage ? "active" : ""}
              onClick={() => setCurrentPage(number)}
              aria-label={`Page ${number}`}
            >
              <span className="number-text">{number}</span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default Pagination;
