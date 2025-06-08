import "@/styles/_global.scss";

//Providers
import { SessionProvider } from "@/context/SessionContext";
import { ProductProvider } from "@/context/ProductContext";
import { CartProvider } from "@/context/CartContext";
import { ResumeProvider } from "@/context/ResumeContext";
import { ToastContainer } from "react-toastify";

//Components
// import { Header, Sidebar, LayoutWrapper } from "@/components";
import LayoutWrapper from "@/components/LayoutWrapper/LayoutWrapper";

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
              <ToastContainer position="top-center" newestOnTop={false} />
            </CartProvider>
          </ProductProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
