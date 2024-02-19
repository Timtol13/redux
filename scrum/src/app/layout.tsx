import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import styles from '@/styles/main.module.scss'
import React from "react";
import Loader from "@/widgets/Loader/Loader";
import Link from "next/link";
import Image from "next/image";
import Logo from '@/images/logo.png'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "InProjects",
  description: "InProjects",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} ${styles.app}`}>
        <React.Suspense fallback={<Loader />}>
          <Link target='_blank' href={'http://localhost:3000/'} className={styles.linkToInThreads}><Image src={Logo} alt=""/></Link>
          {children}
        </React.Suspense>
      </body>
    </html>
  );
}
