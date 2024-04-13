import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs'
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

import { ToastContainer} from 'react-toastify'
import { ThemeProvider } from "@/components/provider/theme-provider";
import ModalProvider from "@/components/provider/modal-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: [
    {
      url: '/images/logoipsum-265.svg',
      href: '/images/logoipsum-265.svg'
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider> 
      <html lang="en" suppressHydrationWarning>
        <body className={cn(
          inter.className,
          'bg-[#EDEADE] dark:bg-black'
        )}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="template-gen"
          >
            <ModalProvider />
            <ToastContainer 
              position="bottom-right"
              closeOnClick={true}
              autoClose={2000}
            />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
