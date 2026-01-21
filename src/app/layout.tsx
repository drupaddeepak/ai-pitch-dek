import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vacant Planetary",
  description: "AI-generated pitch decks for films",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
