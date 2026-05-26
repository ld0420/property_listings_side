/**
 * Hook + integration test for the favorites feature.
 *
 * Exercises FavoritesContext through its public `useFavorites` API and asserts it
 * persists through to localStorage — covering the context, the useLocalStorage
 * hook, and the storage helpers together, which is how they actually run in the app.
 */
import { type ReactNode } from "react";
import { renderHook, act } from "@testing-library/react";
import { FavoritesProvider, useFavorites } from "@/context/FavoritesContext";
import { STORAGE_KEYS } from "@/lib/storage";

const wrapper = ({ children }: { children: ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

describe("useFavorites", () => {
  beforeEach(() => localStorage.clear());

  it("toggles a favorite on and off", () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    expect(result.current.isFavorite(1)).toBe(false);

    act(() => result.current.toggleFavorite(1));
    expect(result.current.isFavorite(1)).toBe(true);

    act(() => result.current.toggleFavorite(1));
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it("persists favorited mlsIds to localStorage", () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => result.current.toggleFavorite(42));

    const stored = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.favorites) as string,
    );
    expect(stored).toEqual([42]);
  });

  it("throws if used outside a FavoritesProvider", () => {
    // React logs the thrown error; silence it to keep test output clean.
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useFavorites())).toThrow(/FavoritesProvider/);
    spy.mockRestore();
  });
});
