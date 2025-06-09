import "@/styles/_global.scss";

import { ToastContainer } from "react-toastify";

//Components
// import { Header, Sidebar, LayoutWrapper } from "@/components";
import LayoutWrapper from "@/components/LayoutWrapper/LayoutWrapper";
import { CartProvider } from "@/context/CartContext";
import { ProductProvider } from "@/context/ProductContext";
import { ResumeProvider } from "@/context/ResumeContext";
//Providers
import { SessionProvider } from "@/context/SessionContext";

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
        <SessionProvider>
          <ProductProvider>
            <CartProvider>
              <ResumeProvider>
                <LayoutWrapper>
                  {children}
                </LayoutWrapper>
              </ResumeProvider>
              <ToastContainer newestOnTop={false} position="top-center" />
            </CartProvider>
          </ProductProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
