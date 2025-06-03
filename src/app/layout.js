import "@/styles/_global.scss";

import { Header, Sidebar } from "@/components";

export const metadata = {
  description: "v2.0.0",
  title: "Kiosco",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          crossOrigin="anonymous"
          defer
          src="https://kit.fontawesome.com/80f6ca9277.js"
        ></script>
      </head>
      <body className="layout">
        <Sidebar />

        <main>
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
}
