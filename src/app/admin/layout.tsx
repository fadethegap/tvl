import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import {
  LucideIcon,
  LayoutGrid,
  Settings,
  Users,
  Library,
  FileCheck,
  Tag,
  Globe,
  Clock,
  Languages,
  Scissors,
  MessageSquare,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

interface NavigationItem {
  title: string
  href: string
  icon: LucideIcon
  adminOnly?: boolean
}

interface NavigationGroup {
  title: string
  items: NavigationItem[]
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const { sessionClaims } = await auth()
  const role = sessionClaims?.role as string

  if (!["admin", "staff_admin"].includes(role)) {
    redirect("/")
  }

  const navigation: NavigationGroup[] = [
    {
      title: "Content",
      items: [
        {
          title: "Dashboard",
          href: "/admin",
          icon: LayoutGrid,
        },
        {
          title: "Resources",
          href: "/admin/resources",
          icon: Library,
        },
        {
          title: "Pending Approval",
          href: "/admin/resources/pending",
          icon: FileCheck,
        },
      ],
    },
    {
      title: "Lookup Tables",
      items: [
        {
          title: "Platforms",
          href: "/admin/platforms",
          icon: Globe,
        },
        {
          title: "Categories",
          href: "/admin/categories",
          icon: Tag,
        },
        {
          title: "Durations",
          href: "/admin/durations",
          icon: Clock,
        },
        {
          title: "Languages",
          href: "/admin/languages",
          icon: Languages,
        },
        {
          title: "Editing Styles",
          href: "/admin/editing-styles",
          icon: Scissors,
        },
      ],
    },
    {
      title: "System",
      items: [
        {
          title: "Users",
          href: "/admin/users",
          icon: Users,
          adminOnly: true,
        },
        {
          title: "Settings",
          href: "/admin/settings",
          icon: Settings,
          adminOnly: true,
        },
      ],
    },
  ]

  return (
    <div className="grid lg:grid-cols-5 min-h-screen">
      {/* Sidebar */}
      <aside className="hidden lg:block lg:col-span-1 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <ScrollArea className="h-full py-6 px-4">
          <h2 className="text-lg font-semibold mb-4">Admin Panel</h2>
          <div className="space-y-6">
            {navigation.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  {group.title}
                </h3>
                <div className="space-y-1">
                  {group.items
                    .filter((item) => !item.adminOnly || role === "admin")
                    .map((item) => (
                      <Button
                        key={item.href}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        asChild
                      >
                        <a href={item.href}>
                          <item.icon className="h-4 w-4 mr-2" />
                          {item.title}
                        </a>
                      </Button>
                    ))}
                </div>
                <Separator className="my-4" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden fixed bottom-4 right-4 z-50"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <ScrollArea className="h-full py-6 px-4">
            <SheetHeader>
              <SheetTitle>Admin Panel</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-4">
              {navigation.map((group) => (
                <div key={group.title}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    {group.title}
                  </h3>
                  <div className="space-y-1">
                    {group.items
                      .filter((item) => !item.adminOnly || role === "admin")
                      .map((item) => (
                        <Button
                          key={item.href}
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start"
                          asChild
                        >
                          <a href={item.href}>
                            <item.icon className="h-4 w-4 mr-2" />
                            {item.title}
                          </a>
                        </Button>
                      ))}
                  </div>
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:col-span-4 p-6">
        <div className="mx-auto max-w-7xl">{children}</div>
      </div>
    </div>
  )
}
