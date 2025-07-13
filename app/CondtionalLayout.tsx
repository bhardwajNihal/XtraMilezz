"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ConditionalLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const hideLayout = ["/sign-in"];
  const isMinimal = hideLayout.includes(pathname);

  return isMinimal 
  ? (
    <>{children}</>
  ) 
  : (
    <>
      <Header />
      <main className="min-h-screen w-full mx-auto">{children}</main>
      <Footer />
    </>
  );
}
