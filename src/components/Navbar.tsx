// components/Navbar.tsx
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Navbar() {
  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/">
              <Image
                src="/the-viral-library-logo-black.png"
                alt="The Viral Library"
                width={150}
                height={100}
              />
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link href="/checkout">
              <Button variant="default">Purchase ($29.00)</Button>
            </Link>
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  )
}
