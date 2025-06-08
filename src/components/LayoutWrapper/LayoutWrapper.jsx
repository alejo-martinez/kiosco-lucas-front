"use client";

import { usePathname } from "next/navigation";
import { Header, Sidebar } from "@/components";

const LayoutWrapper = ({ children })=> {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Sidebar />}
      <main>
        {!isLoginPage && <Header />}
        {children}
      </main>
    </>
  );
}

export default LayoutWrapper;
