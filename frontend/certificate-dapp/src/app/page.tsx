"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import CertificateViewer from "./components/certificateViewer"; 
import { IoMenu } from "react-icons/io5";
import Navbar from "./components/navbar";


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
  const projectName = process.env.NEXT_PUBLIC_PROJECT_NAME;

  return (
    <main className="p-6">
      <ConnectButton />
      <Sidebar />
      <h1 className="page-title">🎓 Certificate (Group 2 FinalProject) DApp</h1>
      <CertificateViewer />
    </main>

  );
}