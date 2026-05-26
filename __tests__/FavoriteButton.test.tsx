/**
 * Component test for FavoriteButton — interaction + accessibility.
 *
 * Asserts behavior through the accessible API (role/name/aria-pressed) rather than
 * implementation details, so it doubles as an a11y check. Rendered inside a real
 * FavoritesProvider so the click path exercises the actual state + persistence.
 */
import { type ReactNode } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FavoritesProvider } from "@/context/FavoritesContext";
import FavoriteButton from "@/components/listings/FavoriteButton";

const renderWithProvider = (ui: ReactNode) =>
  render(<FavoritesProvider>{ui}</FavoritesProvider>);

describe("FavoriteButton", () => {
  beforeEach(() => localStorage.clear());

  it("starts unfavorited with an accessible label", () => {
    renderWithProvider(<FavoriteButton mlsId={1} />);

    const button = screen.getByRole("button", { name: /add to favorites/i });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles to favorited on click, updating label and pressed state", () => {
    renderWithProvider(<FavoriteButton mlsId={1} />);

    fireEvent.click(screen.getByRole("button"));

    const button = screen.getByRole("button", {
      name: /remove from favorites/i,
    });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});
