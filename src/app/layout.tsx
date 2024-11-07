import { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { FilterProvider } from "@/contexts/FilterContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "The Viral Library",
  description: "Your gateway to viral marketing success",
  icons: {
    icon: [
      { rel: "icon", url: "/favicon.ico", sizes: "any" },
      { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32" },
      { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <FilterProvider>
              <div className="flex min-h-screen">
                <aside className="w-64 fixed top-[64px] bottom-0 left-0 overflow-y-auto border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  {/* Sidebar content will go here */}
                </aside>
                <main className="flex-1 ml-64">{children}</main>
              </div>
            </FilterProvider>
            <ToastContainer
              theme="dark"
              position="bottom-right"
              autoClose={5000}
            />
            <Footer />
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
