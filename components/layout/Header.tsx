interface HeaderProps {
  title: string;
}

/**
 * Global sticky header. Reused across pages (the page name is a prop), so adding
 * future pages means rendering <Header title="..." /> rather than duplicating chrome.
 */
export default function Header({ title }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-header px-6 py-5 text-white">
      <h1 className="m-0 text-2xl font-bold">{title}</h1>
    </header>
  );
}
