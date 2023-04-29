import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

describe("App", () => {
  it("should render", () => {
    render(<App />);
    expect(screen.getByText("Album search")).toBeInTheDocument();
  });
});

interface ToggleProps {
  get: () => boolean;
  set: (value: boolean) => void;
}
function Toggle({ get, set }: ToggleProps) {
  const value = get();
  const onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    set(ev.target.checked);
  };
  return (
    <label>
      Toggle
      <input type="checkbox" checked={value} onChange={onChange} />
    </label>
  );
}

describe(Toggle.name, () => {
  it("should toggle", async () => {
    const set = vi.fn();
    render(<Toggle get={() => true} set={set} />);
    const toggleElement = screen.getByLabelText("Toggle");
    console.log(toggleElement);
    userEvent.click(toggleElement);
    await waitFor(() => {
      expect(set).toHaveBeenCalledWith(false);
    });
  });
});
