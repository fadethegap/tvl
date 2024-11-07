import { FilterProvider } from "@/contexts/FilterContext"
import { FilterSidebar } from "@/components/resources/filter-sidebar"

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FilterProvider>
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex">
          {/* Sidebar - collapses on mobile */}
          <aside className="hidden md:block w-64 fixed top-16 bottom-0 left-0 overflow-y-auto border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <FilterSidebar />
          </aside>

          {/* Main content */}
          <main className="flex-1 md:ml-64 p-4">{children}</main>
        </div>
      </div>
    </FilterProvider>
  )
}
