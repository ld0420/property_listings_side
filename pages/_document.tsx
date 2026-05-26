import { Html, Head, Main, NextScript } from "next/document";

/**
 * Custom Document so the root <html> carries a `lang` attribute (WCAG 3.1.1),
 * which assistive tech uses to pick the correct pronunciation.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
