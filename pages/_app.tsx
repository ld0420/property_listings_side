import "@/styles/global.css";
import type { AppProps } from "next/app";
import { FavoritesProvider } from "@/context/FavoritesContext";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <FavoritesProvider>
      <Component {...pageProps} />
    </FavoritesProvider>
  );
}
