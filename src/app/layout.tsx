import "@/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "@/trpc/react";
import Sidebar from "@/components/navigation/sidebar";
import NavbarHeader from "@/components/navigation/navbar-header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const runtime = "edge";

export const metadata = {
  title: "IronSwords - חרבות ברזל",
  description: "Together we are stronger, Pray for Israel 🇮🇱",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" suppressHydrationWarning>
      <body dir="rtl" className={`font-sans ${inter.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider headers={headers()}>
            <div className="flex">
              <Sidebar />
              <div className=" flex flex-1 flex-col ">
                <NavbarHeader />
                {children}
              </div>
            </div>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
