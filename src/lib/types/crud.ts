import { type ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"

export interface BaseLookupItem {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  _count?: {
    resources: number
  }
}

export const getBaseColumns = <T extends BaseLookupItem>(): ColumnDef<T>[] => [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    id: "resources",
    header: "Resources",
    cell: ({ row }) => {
      return row.original._count?.resources || 0
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => format(new Date(row.original.createdAt), "PPP"),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => format(new Date(row.original.updatedAt), "PPP"),
  },
]
