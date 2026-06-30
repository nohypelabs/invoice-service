import type { Metadata } from "next";
import "./globals.css";
import { TRPCProvider } from "@/lib/trpc/client";
import { Sidebar } from "./_components/sidebar";

export const metadata: Metadata = {
  title: "Invoice Service",
  description: "Multi-project invoice generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-dvh bg-gray-50">
        <TRPCProvider>
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </TRPCProvider>
      </body>
    </html>
  );
}
