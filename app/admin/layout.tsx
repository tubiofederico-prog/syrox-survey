"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Don't redirect if we're on the login page
    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/admin/login");
    }
    setIsLoading(false);
  }, [router, pathname]);

  if (isLoading) {
    return null;
  }

  // If on login page, don't show sidebar
  if (pathname === "/admin/login") {
    return children;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 min-h-screen bg-gray-50">
        {children}
      </div>
    </div>
  );
}
