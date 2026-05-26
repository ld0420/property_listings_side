/**
 * Component test for PropertyCard — verifies the right data reaches the screen,
 * formatted correctly, and that the missing-photo placeholder renders. This is the
 * integration point where the formatters meet the markup, so it guards the actual
 * user-facing output (specs line, price, address heading, list date).
 */
import { type ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import { FavoritesProvider } from "@/context/FavoritesContext";
import PropertyCard from "@/components/listings/PropertyCard";
import { makeProperty } from "../test-utils/property";

const renderWithProvider = (ui: ReactNode) =>
  render(<FavoritesProvider>{ui}</FavoritesProvider>);

describe("PropertyCard", () => {
  beforeEach(() => localStorage.clear());

  it("renders formatted specs, price, address, and list date", () => {
    const property = makeProperty({
      listPrice: 199000,
      listDate: "2020-12-13T00:00:00Z",
      property: { bedrooms: 2, bathsFull: 1, bathsHalf: 3, area: 1500 },
    });

    const { container } = renderWithProvider(
      <PropertyCard property={property} />,
    );

    // Specs line is composed of several text nodes, so assert on combined text.
    expect(container.textContent).toContain("2 BR | 2.5 Bath | 1,500 Sq Ft");
    expect(container.textContent).toContain("Listed: 12/13/20");
    expect(screen.getByText("$199,000")).toBeInTheDocument();
    // Address is a semantic heading.
    expect(
      screen.getByRole("heading", { name: "1839 Berkely Way" }),
    ).toBeInTheDocument();
  });

  it("shows a placeholder when the property has no photo", () => {
    const property = makeProperty({ photos: [] });

    renderWithProvider(<PropertyCard property={property} />);

    expect(screen.getByText(/no photo available/i)).toBeInTheDocument();
  });
});
