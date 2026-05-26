import { useState, type ReactNode } from "react";
import Header from "./Header";

type MobileView = "map" | "list";

interface LayoutProps {
  title: string;
  /** Left panel on desktop; shown when mobile view is "map". */
  map: ReactNode;
  /** Right panel on desktop; shown when mobile view is "list". */
  list: ReactNode;
}

/**
 * Page shell: sticky header + two panels.
 *  - Desktop (md+): map and list side by side.
 *  - Mobile: one panel at a time with a floating toggle button, per the Figma.
 *    Showing the list -> button reads "MAP VIEW"; showing the map -> "LIST VIEW".
 *
 * Both panels stay mounted (hidden via CSS, never unmounted) so the map keeps its
 * camera/markers and the list keeps its scroll position when toggling. The `md:block`
 * overrides ensure both are always visible on desktop regardless of `mobileView`.
 */
export default function Layout({ title, map, list }: LayoutProps) {
  const [mobileView, setMobileView] = useState<MobileView>("list");

  const toggleView = () =>
    setMobileView((v) => (v === "list" ? "map" : "list"));

  return (
    <div className="flex h-screen flex-col">
      <Header title={title} />

      <main className="flex min-h-0 flex-1 flex-col md:flex-row">
        <section
          className={`relative flex-1 md:block md:flex-[0_0_50%] ${
            mobileView === "map" ? "block" : "hidden"
          }`}
        >
          {map}
        </section>

        <section
          className={`flex-1 overflow-y-auto md:block ${
            mobileView === "list" ? "block" : "hidden"
          }`}
        >
          {list}
        </section>
      </main>

      {/* Mobile-only floating toggle; label is the view you switch TO. */}
      <button
        type="button"
        onClick={toggleView}
        aria-label={mobileView === "list" ? "Show map view" : "Show list view"}
        className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2 cursor-pointer rounded border-0 bg-toggle px-6 py-3 font-bold tracking-wider text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-header md:hidden"
      >
        {mobileView === "list" ? "MAP VIEW" : "LIST VIEW"}
      </button>
    </div>
  );
}
