import { describe, vi, it, afterEach, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AlbumPicker from "./AlbumPicker";
import mockResponse from "./release.json";
import { debug } from "vitest-preview";

describe(AlbumPicker.name, () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should show search results", async () => {
    const user = userEvent.setup();

    const rihannaUrl =
      "https://musicbrainz.org/ws/2/release?fmt=json&query=artist:rihanna AND date:";
    const mockFetch = vi
      .spyOn(window, "fetch")
      .mockImplementation(async (url: RequestInfo | URL) => {
        console.log(url);
        if (url === rihannaUrl) {
          return {
            json: async () => mockResponse,
          } as Response;
        } else {
          return {} as Response;
        }
      });

    render(<AlbumPicker />);

    const artistInput = screen.getByLabelText("Artist name:");
    await user.type(artistInput, "rihanna");
    debug();
    const form = screen.getByRole("form", { name: "search" });
    fireEvent.submit(form);

    await screen.findByText("Love on the Brain (2017-01-20)");
    // debug();
  });
});
