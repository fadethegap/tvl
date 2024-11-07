"use client"

import { useUser } from "@clerk/nextjs"
import { SearchBar } from "@/components/resources/search-bar"
import { ResourceGrid } from "@/components/resources/resource-grid"
import { MobileFilters } from "@/components/resources/mobile-filters"
import { Separator } from "@/components/ui/separator"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

const queryClient = new QueryClient()

export default function ResourcesPage() {
  const { user } = useUser()

  return (
    <QueryClientProvider client={queryClient}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <SearchBar />
          <MobileFilters />
        </div>
        <Separator className="my-4" />
        <ResourceGrid userId={user?.id} />
      </div>
      <Toaster />
    </QueryClientProvider>
  )
}

// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
// import { toast } from "sonner"

// interface Favorite {
//   id: number
//   userId: string
//   resourceId: number
// }

// export function useFavorites(userId?: string) {
//   const queryClient = useQueryClient()

//   const { data: favorites = [], isLoading } = useQuery({
//     queryKey: ["favorites", userId],
//     queryFn: async (): Promise<Favorite[]> => {
//       if (!userId) return []
//       const response = await fetch(`/api/favorites?userId=${userId}`)
//       if (!response.ok) throw new Error("Failed to fetch favorites")
//       return response.json()
//     },
//     enabled: !!userId,
//   })

//   const toggleFavorite = useMutation({
//     mutationFn: async (resourceId: number) => {
//       if (!userId) throw new Error("User not authenticated")

//       const isFavorited = favorites.some((f) => f.resourceId === resourceId)
//       const response = await fetch("/api/favorites", {
//         method: isFavorited ? "DELETE" : "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ userId, resourceId }),
//       })

//       if (!response.ok) throw new Error("Failed to update favorite")
//       return response.json()
//     },
//     onSuccess: (_, resourceId) => {
//       const isFavorited = favorites.some((f) => f.resourceId === resourceId)
//       queryClient.invalidateQueries({ queryKey: ["favorites", userId] })
//       toast.success(
//         isFavorited ? "Removed from favorites" : "Added to favorites"
//       )
//     },
//     onError: (error) => {
//       toast.error("Failed to update favorite")
//       console.error("Favorite error:", error)
//     },
//   })

//   return {
//     favorites: favorites.map((f) => f.resourceId),
//     isLoading,
//     toggleFavorite: toggleFavorite.mutate,
//     isToggling: toggleFavorite.isPending,
//   }
// }
