"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { FilterIcon, X } from "lucide-react"
import { FilterSidebar } from "./filter-sidebar"
import { useFilter } from "@/contexts/FilterContext"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export function MobileFilters() {
  const { state } = useFilter()
  const [open, setOpen] = useState(false)

  // Count active filters
  const activeFilterCount = Object.entries(state).reduce(
    (count, [key, value]) => {
      if (Array.isArray(value)) {
        return count + value.length
      }
      return count
    },
    0
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="md:hidden">
          <FilterIcon className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-[380px] p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Filters</SheetTitle>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        <div className="overflow-y-auto h-full pb-16">
          <FilterSidebar />
        </div>
      </SheetContent>
    </Sheet>
  )
}
