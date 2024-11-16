"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import withAuth from "@/utils/withAuth";

function Dashboard({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen text-foreground bg-background">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex flex-col flex-grow">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default withAuth(Dashboard);