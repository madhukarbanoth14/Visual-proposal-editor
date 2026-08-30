"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { ToastContainer } from "@/components/ui/toast";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullscreen =
    pathname.includes("/edit") ||
    pathname.includes("/client-view") ||
    pathname.includes("/preview");

  if (isFullscreen) {
    return (
      <>
        {children}
        <ToastContainer />
      </>
    );
  }

  return (
    <>
      <Sidebar />
      <main className="min-h-screen pl-64">{children}</main>
      <ToastContainer />
    </>
  );
}
