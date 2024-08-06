import "~/styles/globals.css";

import { Inter as FontSans } from "next/font/google";
import { type Metadata } from "next";
import { clsx } from "clsx";

import { TRPCReactProvider } from "~/trpc/react";
import { Navbar } from '~/components/navbar';

export const metadata: Metadata = {
  title: "Make My Day",
  description: "Your personalized AI-crafted daily adventures",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={clsx("font-sans antialiased", fontSans.variable)}
    >
      <body>
        <TRPCReactProvider>
          <main className="flex min-h-screen flex-col items-center bg-muted">
            <div className="relative max-w-md w-full border-x px-4 bg-gradient-to-b from-[#f3fab3] to-[#a6def2]">
              <Navbar />
              {children}
            </div>
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
