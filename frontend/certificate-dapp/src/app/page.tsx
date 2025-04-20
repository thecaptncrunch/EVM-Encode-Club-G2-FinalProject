"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import CertificateViewer from "./certificateViewer"; 
import { IoMenu } from "react-icons/io5";
import Navbar from "./navbar";
import { use } from "chai";


function Sidebar() {
  const [ showNav, setShowNav ] = useState(false)
  return (
    <div className="p=6">
      <header>
      <IoMenu onClick={() => setShowNav(!showNav)}/>
      </header>
      <Navbar show={showNav} />
    </div>
  )
}
export default function Home() {
  return (
    <main className="p-6">
      <Sidebar />
      <h1 className="text-2xl font-bold mb-4">🎓 Certificate (Group 2 FinalProject) DApp</h1>
      <ConnectButton />
      <CertificateViewer />
    </main>

  );
}
 