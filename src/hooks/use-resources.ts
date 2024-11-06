import useSWR from "swr"
import { Resource } from "@prisma/client"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useResources() {
  const { data, error, mutate } = useSWR<Resource[]>("/api/resources", fetcher)

  return {
    resources: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export function useResource(id: number) {
  const { data, error, mutate } = useSWR<Resource>(
    id ? `/api/resources/${id}` : null,
    fetcher
  )

  return {
    resource: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}

export function useUserResources(userId: string) {
  const { data, error, mutate } = useSWR<Resource[]>(
    userId ? `/api/resources?userId=${userId}` : null,
    fetcher
  )

  return {
    resources: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  }
}
