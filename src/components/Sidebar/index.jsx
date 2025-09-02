"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const Sidebar = ({ }) => {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout } = useSession();

  const closeSession = async (e) => {
    e.preventDefault();
    const response = await logout();
    if (response.status === 'success') {
      router.push('/login')
    }
  }

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) return null;
  else return (
    <div className="sidebar">
      <Link className={pathname === "/" ? "active" : ""} href={"/"}>
        <div>
          <i className="fa-solid fa-house"></i>
        </div>
        Inicio
      </Link>

      {(user?.role === 'admin' || user?.role === 'god') && (
        <>
          <Link
            className={pathname === "/panel" ? "active" : ""}
            href={"/panel"}
          >
            <div>
              <i className="fa-solid fa-gear"></i>
            </div>
            Panel
          </Link>
          <Link
            className={pathname === "/sells" ? "active" : ""}
            href={"/sells"}
          >
            <div>
              <i className="fa-solid fa-money-bill"></i>
            </div>
            Ventas
          </Link>
          <Link
            className={pathname === "/panel/add/product" ? "active" : ""}
            href={"/panel/add/product"}
          >
            <div>
              <i className="fa-solid fa-circle-plus"></i>
            </div>
            Crear
          </Link>
        </>
      )}
      <Link
        className={pathname === "/resumes/diary" ? "active" : ""}
        href={"/resumes/diary"}
      >
        <div>
          <i className="fa-solid fa-file"></i>
        </div>
        Resúmenes
      </Link>

      <Button color="red" onClick={closeSession}>Cerrar Sesión</Button>
    </div>
  );
};

export default Sidebar;
