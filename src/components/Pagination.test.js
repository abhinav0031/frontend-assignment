import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "./Pagination";

describe("Pagination Component", () => {
  let currentPage;
  let setCurrentPage;

  beforeEach(() => {
    currentPage = 1;
    setCurrentPage = jest.fn();
  });

  it("correctly shows page numbers and ellipses", () => {
    render(
      <Pagination
        totalProjects={100}
        projectsPerPage={10}
        setCurrentPage={setCurrentPage}
        currentPage={5}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();

    const ellipses = screen.getAllByText("...");
    expect(ellipses).toHaveLength(2);
  });

  it("calls setCurrentPage when a page number is clicked", () => {
    render(
      <Pagination
        totalProjects={100}
        projectsPerPage={10}
        setCurrentPage={setCurrentPage}
        currentPage={1}
      />
    );

    fireEvent.click(screen.getByText("2"));
    expect(setCurrentPage).toHaveBeenCalledWith(2);
  });
});