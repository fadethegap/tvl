"use client"

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface FilterState {
  search: string
  platforms: number[]
  categories: number[]
  orientations: number[]
  editingStyles: number[]
  durations: number[]
  languages: number[]
  status?: string
  page: number
  limit: number
}

type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | {
      type: "TOGGLE_FILTER"
      filterType: keyof Omit<
        FilterState,
        "search" | "page" | "limit" | "status"
      >
      id: number
    }
  | { type: "SET_STATUS"; payload: string }
  | { type: "CLEAR_FILTERS" }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_LIMIT"; payload: number }
  | { type: "SYNC_WITH_URL"; payload: Partial<FilterState> }

const initialState: FilterState = {
  search: "",
  platforms: [],
  categories: [],
  orientations: [],
  editingStyles: [],
  durations: [],
  languages: [],
  page: 1,
  limit: 12,
}

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 }
    case "TOGGLE_FILTER": {
      const currentFilters = state[action.filterType]
      const newFilters = currentFilters.includes(action.id)
        ? currentFilters.filter((id) => id !== action.id)
        : [...currentFilters, action.id]
      return { ...state, [action.filterType]: newFilters, page: 1 }
    }
    case "SET_STATUS":
      return { ...state, status: action.payload, page: 1 }
    case "CLEAR_FILTERS":
      return { ...initialState, search: state.search }
    case "SET_PAGE":
      return { ...state, page: action.payload }
    case "SET_LIMIT":
      return { ...state, limit: action.payload, page: 1 }
    case "SYNC_WITH_URL":
      return { ...state, ...action.payload }
    default:
      return state
  }
}

interface FilterContextType {
  state: FilterState
  dispatch: React.Dispatch<FilterAction>
  syncWithURL: () => void
  updateURL: () => void
}

const FilterContext = createContext<FilterContextType | null>(null)

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(filterReducer, initialState)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Sync URL with state
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()

    // Only add non-empty values to URL
    if (state.search) params.set("search", state.search)
    if (state.platforms.length)
      params.set("platforms", state.platforms.join(","))
    if (state.categories.length)
      params.set("categories", state.categories.join(","))
    if (state.orientations.length)
      params.set("orientations", state.orientations.join(","))
    if (state.editingStyles.length)
      params.set("editingStyles", state.editingStyles.join(","))
    if (state.durations.length)
      params.set("durations", state.durations.join(","))
    if (state.languages.length)
      params.set("languages", state.languages.join(","))
    if (state.status) params.set("status", state.status)
    if (state.page > 1) params.set("page", state.page.toString())
    if (state.limit !== initialState.limit)
      params.set("limit", state.limit.toString())

    router.push(`${pathname}?${params.toString()}`)
  }, [state, pathname, router])

  // Sync state with URL
  const syncWithURL = useCallback(() => {
    const params: Partial<FilterState> = {
      search: searchParams.get("search") || "",
      platforms: searchParams.get("platforms")?.split(",").map(Number) || [],
      categories: searchParams.get("categories")?.split(",").map(Number) || [],
      orientations:
        searchParams.get("orientations")?.split(",").map(Number) || [],
      editingStyles:
        searchParams.get("editingStyles")?.split(",").map(Number) || [],
      durations: searchParams.get("durations")?.split(",").map(Number) || [],
      languages: searchParams.get("languages")?.split(",").map(Number) || [],
      status: searchParams.get("status") || undefined,
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || initialState.limit,
    }

    dispatch({ type: "SYNC_WITH_URL", payload: params })
  }, [searchParams])

  return (
    <FilterContext.Provider value={{ state, dispatch, syncWithURL, updateURL }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilter() {
  const context = useContext(FilterContext)
  if (!context) {
    throw new Error("useFilter must be used within a FilterProvider")
  }
  return context
}

// "use client"

// import React, { createContext, useContext, useReducer } from "react"

// interface FilterState {
//   search: string
//   platforms: number[]
//   categories: number[]
//   orientations: number[]
//   editingStyles: number[]
//   durations: number[]
//   languages: number[]
//   page: number
//   limit: number
// }

// type FilterAction =
//   | { type: "SET_SEARCH"; payload: string }
//   | {
//       type: "TOGGLE_FILTER"
//       filterType: keyof Omit<FilterState, "search" | "page" | "limit">
//       id: number
//     }
//   | { type: "CLEAR_FILTERS" }
//   | { type: "SET_PAGE"; payload: number }
//   | { type: "SET_LIMIT"; payload: number }

// const initialState: FilterState = {
//   search: "",
//   platforms: [],
//   categories: [],
//   orientations: [],
//   editingStyles: [],
//   durations: [],
//   languages: [],
//   page: 1,
//   limit: 12,
// }

// function filterReducer(state: FilterState, action: FilterAction): FilterState {
//   switch (action.type) {
//     case "SET_SEARCH":
//       return { ...state, search: action.payload, page: 1 }
//     case "TOGGLE_FILTER": {
//       const currentFilters = state[action.filterType]
//       const newFilters = currentFilters.includes(action.id)
//         ? currentFilters.filter((id) => id !== action.id)
//         : [...currentFilters, action.id]
//       return { ...state, [action.filterType]: newFilters, page: 1 }
//     }
//     case "CLEAR_FILTERS":
//       return { ...initialState, search: state.search }
//     case "SET_PAGE":
//       return { ...state, page: action.payload }
//     case "SET_LIMIT":
//       return { ...state, limit: action.payload, page: 1 }
//     default:
//       return state
//   }
// }

// const FilterContext = createContext<{
//   state: FilterState
//   dispatch: React.Dispatch<FilterAction>
// } | null>(null)

// export function FilterProvider({ children }: { children: React.ReactNode }) {
//   const [state, dispatch] = useReducer(filterReducer, initialState)

//   return (
//     <FilterContext.Provider value={{ state, dispatch }}>
//       {children}
//     </FilterContext.Provider>
//   )
// }

// export function useFilter() {
//   const context = useContext(FilterContext)
//   if (!context) {
//     throw new Error("useFilter must be used within a FilterProvider")
//   }
//   return context
// }
