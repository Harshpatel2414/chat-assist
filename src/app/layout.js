"use client"
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import Head from "next/head";
import { AuthContextProvider } from "@/context/AuthContext";
import { ChatContextProvider } from "@/context/ChatContext";
import { ChatLayoutProvider } from "@/context/ChatLayoutContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const metaData = {
  title: "Chat App",
  description: "A simple chat application built with Next.js and Firebase.",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en" theme='dark'>
      <Head>
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <AuthContextProvider>
            <ChatContextProvider>
              <ChatLayoutProvider>
                {children}
              </ChatLayoutProvider>
            </ChatContextProvider>
          </AuthContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
