import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/lib/storage";

/**
 * Favorites are shared app-wide (cards toggle them, other pages could read them)
 * so they live in Context rather than being prop-drilled. Context + a localStorage
 * hook satisfies the "no Redux/Mobx" constraint while persisting across reloads.
 */

interface FavoritesContextValue {
  favorites: number[];
  isFavorite: (mlsId: number) => boolean;
  toggleFavorite: (mlsId: number) => void;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useLocalStorage<number[]>(
    STORAGE_KEYS.favorites,
    [],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isFavorite: (mlsId: number) => favorites.includes(mlsId),
      toggleFavorite: (mlsId: number) =>
        setFavorites((prev) =>
          prev.includes(mlsId)
            ? prev.filter((id) => id !== mlsId)
            : [...prev, mlsId],
        ),
    }),
    [favorites, setFavorites],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

/** Convenience hook; throws if used outside the provider. */
export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return ctx;
}
