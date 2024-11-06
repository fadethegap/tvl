// app/layout.tsx
import { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "The Viral Library",
//   description: "Your gateway to viral marketing success",
// }
export const metadata: Metadata = {
  title: "The Viral Library",
  description: "Your gateway to viral marketing success",
  icons: {
    icon: [
      { rel: "icon", url: "/favicon.ico", sizes: "any" }, // Default favicon
      { rel: "icon", url: "/favicon-32x32.png", sizes: "32x32" }, // 32x32 PNG
      { rel: "icon", url: "/favicon-16x16.png", sizes: "16x16" }, // 16x16 PNG
    ],
    apple: "/apple-touch-icon.png", // Apple touch icon
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={inter.className}>
          <Navbar />

          <main>{children}</main>
          <ToastContainer />
          <Footer />
        </body>
      </ClerkProvider>
    </html>
  )
}
