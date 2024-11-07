"use client"

import { useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FilterAccordion } from "./filter-accordion"
import { useFilter } from "@/contexts/FilterContext"
import useSWR from "swr"
import {
  Platform,
  Category,
  Duration,
  Language,
  EditingStyle,
  Orientation,
} from "@prisma/client"

// Type for any filter option
interface FilterOption {
  id: number
  name: string
}

// Type for array-based filter keys
type ArrayFilterKey =
  | "platforms"
  | "categories"
  | "durations"
  | "languages"
  | "editingStyles"
  | "orientations"

interface FilterItem {
  id: number
  name: string
  isChecked: boolean
  onToggle: (id: number) => void
}

function FilterItem({ id, name, isChecked, onToggle }: FilterItem) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`filter-${id}`}
        checked={isChecked}
        onCheckedChange={() => onToggle(id)}
      />
      <Label htmlFor={`filter-${id}`} className="text-sm cursor-pointer">
        {name}
      </Label>
    </div>
  )
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function FilterSidebar() {
  const { state, dispatch, updateURL } = useFilter()

  const { data: platforms } = useSWR<Platform[]>("/api/platforms", fetcher)
  const { data: categories } = useSWR<Category[]>("/api/categories", fetcher)
  const { data: durations } = useSWR<Duration[]>("/api/durations", fetcher)
  const { data: languages } = useSWR<Language[]>("/api/languages", fetcher)
  const { data: editingStyles } = useSWR<EditingStyle[]>(
    "/api/editing-styles",
    fetcher
  )
  const { data: orientations } = useSWR<Orientation[]>(
    "/api/orientations",
    fetcher
  )

  useEffect(() => {
    updateURL()
  }, [state, updateURL])

  const handleFilterToggle = (type: ArrayFilterKey, id: number) => {
    dispatch({ type: "TOGGLE_FILTER", filterType: type, id })
  }

  const handleClearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" })
  }

  const hasActiveFilters = [
    "platforms",
    "categories",
    "durations",
    "languages",
    "editingStyles",
    "orientations",
  ].some((key) => state[key as ArrayFilterKey].length > 0)

  const renderFilterSection = (
    title: string,
    type: ArrayFilterKey,
    options?: FilterOption[]
  ) => {
    if (!options) {
      return (
        <FilterAccordion title={title}>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        </FilterAccordion>
      )
    }

    const currentFilters = state[type] as number[]

    return (
      <FilterAccordion title={title} defaultOpen={currentFilters.length > 0}>
        {options.map((option) => (
          <FilterItem
            key={option.id}
            id={option.id}
            name={option.name}
            isChecked={currentFilters.includes(option.id)}
            onToggle={(id) => handleFilterToggle(type, id)}
          />
        ))}
      </FilterAccordion>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="mt-2 w-full text-muted-foreground hover:text-primary"
          >
            Clear all filters
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {renderFilterSection("Platform", "platforms", platforms)}
        {renderFilterSection("Category", "categories", categories)}
        {renderFilterSection("Duration", "durations", durations)}
        {renderFilterSection("Language", "languages", languages)}
        {renderFilterSection("Editing Style", "editingStyles", editingStyles)}
        {renderFilterSection("Orientation", "orientations", orientations)}
      </div>
    </div>
  )
}
