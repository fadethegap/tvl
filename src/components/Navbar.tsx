"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"

export default function Navbar() {
  const { theme } = useTheme()

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-shrink-0">
            <Link href="/">
              <img
                src={
                  theme === "dark"
                    ? "/the-viral-library-logo-white.png"
                    : "/the-viral-library-logo-black.png"
                }
                alt="The Viral Library"
                className="h-8 w-auto"
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/checkout">
              <Button variant="default" className="font-medium">
                Get Lifetime Access - $29
              </Button>
            </Link>
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </nav>
  )
}
