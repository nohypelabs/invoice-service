import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invoice Service",
  description: "Multi-project invoice generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
