"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components";

const Sidebar = ({}) => {
  const pathname = usePathname();

  const auth = true;

  return (
    <div className="sidebar">
      <Link className={pathname === "/" ? "active" : ""} href={"/"}>
        <div>
          <i className="fa-solid fa-house"></i>
        </div>
        Inicio
      </Link>

      {auth && (
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
          <Link
            className={pathname === "/resumes/diary" ? "active" : ""}
            href={"/resumes/diary"}
          >
            <div>
              <i className="fa-solid fa-file"></i>
            </div>
            Resúmenes
          </Link>
        </>
      )}

      <Button color="red">Cerrar Sesión</Button>
    </div>
  );
};

export default Sidebar;
