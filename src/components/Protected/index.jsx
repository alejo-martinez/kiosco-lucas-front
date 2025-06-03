"use client";

import { useRouter } from "next/navigation";

const Protected = ({ children }) => {
  const router = useRouter();

  const isAuth = false;

  if (!isAuth) {
    router.push("/login");
  }

  return children;
};

export default Protected;
