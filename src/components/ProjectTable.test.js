import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProjectTable from "./ProjectTable";

global.fetch = jest.fn();

describe("ProjectTable Component", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("renders the table headers and initial empty state", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<ProjectTable />);

    expect(screen.getByText("S.No.")).toBeInTheDocument();
    expect(screen.getByText("Percentage Funded")).toBeInTheDocument();
    expect(screen.getByText("Amount Pledged")).toBeInTheDocument();

    await waitFor(() => {
      expect(
        screen.getByText("No projects to display.")
      ).toBeInTheDocument();
    });
  });

  it("renders projects correctly after fetching data", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { "s.no": 1, "percentage.funded": 120, "amt.pledged": 5000 },
        { "s.no": 2, "percentage.funded": 80, "amt.pledged": 2000 },
      ],
    });

    render(<ProjectTable />);

    await waitFor(() => {
      expect(screen.getByText("1")).toBeInTheDocument();
      expect(screen.getByText("120")).toBeInTheDocument();
      expect(screen.getByText("5,000")).toBeInTheDocument();
      expect(screen.getByText("2")).toBeInTheDocument();
      expect(screen.getByText("80")).toBeInTheDocument();
      expect(screen.getByText("2,000")).toBeInTheDocument();
    });
  });

  it("displays the correct projects when navigating pages", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () =>
        Array.from({ length: 15 }, (_, i) => ({
          "s.no": i + 1,
          "percentage.funded": (i + 1) * 10,
          "amt.pledged": (i + 1) * 1000,
        })),
    });
  
    render(<ProjectTable />);
  
    await waitFor(() => {
      expect(screen.getByText("1", { selector: "td" })).toBeInTheDocument();
      expect(screen.getByText("10", { selector: "td" })).toBeInTheDocument();
      expect(screen.getByText("1,000", { selector: "td" })).toBeInTheDocument();
    });
  
    const nextButton = screen.getByLabelText(/next page/i);
    fireEvent.click(nextButton);
  
    await waitFor(() => {
      expect(screen.getByText("6", { selector: "td" })).toBeInTheDocument();
      expect(screen.getByText("60", { selector: "td" })).toBeInTheDocument();
      expect(screen.getByText("6,000", { selector: "td" })).toBeInTheDocument();
    });
  });

  it("displays fallback text on API failure", async () => {
    jest.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.reject(new Error("Failed to fetch"))
    );
  
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  
    render(<ProjectTable />);
  
    await waitFor(() => {
      expect(
        screen.getByText("No projects to display.")
      ).toBeInTheDocument();
    });
  
    consoleErrorSpy.mockRestore();
    global.fetch.mockRestore();
  });
});