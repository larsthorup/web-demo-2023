import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { debug } from "vitest-preview";
import { AlbumProvider } from "./AlbumContext";
import AlbumPicker from "./AlbumPicker";
import mockResponse from "./release.json";

describe(AlbumPicker.name, () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should show search results", async () => {
    const user = userEvent.setup();

    const rihannaUrl =
      "https://musicbrainz.org/ws/2/release?fmt=json&query=artist:rihanna AND date:2017";
    const logUrl = "https://eoy1vosu2h8dew3.m.pipedream.net";
    const mockFetch = vi
      .spyOn(window, "fetch")
      .mockImplementation(async (url: RequestInfo | URL) => {
        if (url === rihannaUrl) {
          return {
            json: async () => mockResponse,
          } as Response;
        } else if (url === logUrl) {
          return {
            ok: true,
          } as Response;
        } else {
          return {} as Response;
        }
      });

    render(
      <AlbumProvider albumState={{ results: [], artist: "", date: "" }}>
        <AlbumPicker />
      </AlbumProvider>
    );

    const artistInput = screen.getByLabelText("Artist name:");
    await user.type(artistInput, "rihanna");
    const dateInput = screen.getByLabelText(
      "Release date:"
    ) as HTMLInputElement;
    debug();
    const form = screen.getByRole("form", { name: "search" });
    fireEvent.submit(form);

    expect(dateInput).toBeInvalid();
    expect(dateInput.validationMessage).toEqual("Please enter a valid year");
    await user.type(dateInput, "2017");
    fireEvent.submit(form);

    await screen.findByText("Love on the Brain (2017-01-20)");
    // debug();
  });
});
