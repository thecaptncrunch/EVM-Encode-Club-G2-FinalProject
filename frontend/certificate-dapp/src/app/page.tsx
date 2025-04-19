"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import CertificateViewer from "./certificateViewer"; 

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">🎓 Certificate (Group 2 FinalProject) DApp</h1>
      <ConnectButton />
      <CertificateViewer />
    </main>
  );
}
