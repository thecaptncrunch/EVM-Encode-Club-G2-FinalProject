"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import AdminRevoke from "../components/certRevoke"; 
import AdminMinter from "../components/certMinter"
import { IoMenu } from "react-icons/io5";
import Navbar from "../components/navbar";


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

export default function AdminPage() {
  return (
    <main className="p-6">
      <Sidebar />
      <h1 className="text-2xl font-bold mb-4"> Additional Functions</h1>
      <h2 className="text-2xl font-bold mb-4"> Assign and Revoke Certifications (Admin Only)</h2>
      <ConnectButton />
      < AdminMinter />
      < AdminRevoke />
    </main>
  );
}