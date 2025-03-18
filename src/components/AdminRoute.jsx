'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { useSession } from "@/context/SessionContext";

const AdminRoute = (WrappedComponent) => {

    // const {user} = useSession();

  return (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
      if (!user || user.role !== "admin") {
        router.replace("/"); // Redirige al home si no es admin
      } else {
        setIsAdmin(true);
      }
      
      setLoading(false);
    }, []);

    if (loading) return <p>Cargando...</p>;

    return isAdmin ? <WrappedComponent {...props} /> : null;
  };
};

export default AdminRoute;
