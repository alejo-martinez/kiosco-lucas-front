'use client';

import React, {useEffect, useState} from "react";

import Payment from "@/components/Payment";
import NavBar from "@/components/NavBar";
import Sell from "@/components/Sell";
import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";
import InitModal from "@/components/InitModal";
import { useResume } from "@/context/ResumeContext";

export default function Home() {

  // const {showModal, setShowModal} = useResume();


  return (
    <div className="grid grid-cols-[0.2fr_4fr_1.5fr] grid-rows-[auto_1fr_auto] h-screen gap-2 p-2">
      <div className="row-span-2 bg-gray-200 p-4">
        <Sidebar />
      </div>

      <div className="col-span-2 bg-gray-200 p-4">
        <NavBar />
      </div>
      <div className="p-4">
        <Sell />
      </div>

      <div className="col-span-1 row-span-2">
        <Payment />
      </div>
      <InitModal />
    </div>
  );
}
