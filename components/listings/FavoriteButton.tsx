import Image from "next/image";
import { useFavorites } from "@/context/FavoritesContext";

interface FavoriteButtonProps {
  mlsId: number;
}

export default function FavoriteButton({ mlsId }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(mlsId);

  return (
    <button
      type="button"
      aria-pressed={favorited}
      aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
      onClick={() => toggleFavorite(mlsId)}
      className="absolute right-2 top-2 cursor-pointer rounded-full border-0 bg-transparent p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <Image
        src={favorited ? "/heart-fill.svg" : "/heart-stroke.svg"}
        alt=""
        width={30}
        height={30}
      />
    </button>
  );
}
