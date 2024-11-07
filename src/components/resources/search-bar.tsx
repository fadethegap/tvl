"use client"

import { useEffect, useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFilter } from "@/contexts/FilterContext"
import { useDebouncedCallback } from "use-debounce"

export function SearchBar() {
  const { state, dispatch } = useFilter()
  const [localSearch, setLocalSearch] = useState(state.search)

  const debouncedSearch = useDebouncedCallback((value: string) => {
    dispatch({ type: "SET_SEARCH", payload: value })
  }, 300)

  useEffect(() => {
    setLocalSearch(state.search)
  }, [state.search])

  const handleClear = () => {
    setLocalSearch("")
    dispatch({ type: "SET_SEARCH", payload: "" })
  }

  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={localSearch}
        onChange={(e) => {
          setLocalSearch(e.target.value)
          debouncedSearch(e.target.value)
        }}
        placeholder="Search resources..."
        className="pl-9 pr-10"
      />
      {localSearch && (
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
          onClick={handleClear}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  )
}

// "use client"

// import { useEffect, useRef } from "react"
// import { useInfiniteQuery } from "@tanstack/react-query"
// import { useInView } from "framer-motion"
// import { ResourceCard } from "./resource-card"
// import { useFilter } from "@/contexts/FilterContext"
// import { Loader2 } from "lucide-react"
// import {
//   Resource,
//   Platform,
//   Category,
//   Duration,
//   Language,
//   EditingStyle,
//   Orientation,
// } from "@prisma/client"

// const ITEMS_PER_PAGE = 12

// // Define the shape of a resource with its relations
// interface ResourceWithRelations extends Resource {
//   platform: Platform
//   category: Category
//   duration: Duration
//   language: Language
//   editingStyle: EditingStyle
//   orientation: Orientation
// }

// // Define the API response type
// interface ResourcesResponse {
//   resources: ResourceWithRelations[]
//   total: number
//   hasMore: boolean
// }

// async function fetchResources(
//   page: number,
//   filters: Record<string, any>
// ): Promise<ResourcesResponse> {
//   const params = new URLSearchParams({
//     page: page.toString(),
//     limit: ITEMS_PER_PAGE.toString(),
//     ...Object.entries(filters).reduce((acc, [key, value]) => {
//       if (Array.isArray(value) && value.length > 0) {
//         acc[key] = value.join(",")
//       } else if (value && typeof value === "string") {
//         acc[key] = value
//       }
//       return acc
//     }, {} as Record<string, string>),
//   })

//   const response = await fetch(`/api/resources?${params}`)
//   if (!response.ok) throw new Error("Failed to fetch resources")
//   return response.json()
// }

// export function ResourceGrid() {
//   const { state } = useFilter()
//   const loadMoreRef = useRef(null)
//   const isLoadMoreInView = useInView(loadMoreRef)

//   const {
//     data,
//     fetchNextPage,
//     hasNextPage,
//     isFetchingNextPage,
//     isLoading,
//     isError,
//   } = useInfiniteQuery({
//     queryKey: ["resources", state],
//     queryFn: ({ pageParam }) => fetchResources(pageParam, state),
//     initialPageParam: 1,
//     getNextPageParam: (lastPage) => {
//       if (lastPage.hasMore) {
//         return lastPage.resources.length / ITEMS_PER_PAGE + 1
//       }
//       return undefined
//     },
//   })

//   const handleFavorite = async (id: number) => {
//     // Implement favorite functionality
//     console.log("Favorite:", id)
//   }

//   useEffect(() => {
//     if (isLoadMoreInView && hasNextPage) {
//       fetchNextPage()
//     }
//   }, [isLoadMoreInView, fetchNextPage, hasNextPage])

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <Loader2 className="h-8 w-8 animate-spin" />
//       </div>
//     )
//   }

//   if (isError) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
//         Error loading resources. Please try again.
//       </div>
//     )
//   }

//   const resources = data?.pages.flatMap((page) => page.resources) ?? []

//   if (resources.length === 0) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px] text-muted-foreground">
//         No resources found. Try adjusting your filters.
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-8">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//         {resources.map((resource) => (
//           <ResourceCard
//             key={resource.id}
//             resource={resource}
//             onFavorite={handleFavorite}
//             // isFavorited={favorites.includes(resource.id)}
//           />
//         ))}
//       </div>

//       {(hasNextPage || isFetchingNextPage) && (
//         <div
//           ref={loadMoreRef}
//           className="flex items-center justify-center py-8"
//         >
//           <Loader2 className="h-8 w-8 animate-spin" />
//         </div>
//       )}
//     </div>
//   )
// }
