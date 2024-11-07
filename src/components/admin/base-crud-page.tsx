"use client"

import { useState } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { DataTable } from "@/components/admin/data-table/data-table"
import { CrudDialog } from "@/components/admin/crud-dialog"
import { type ColumnDef } from "@tanstack/react-table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { BaseLookupItem, getBaseColumns } from "@/lib/types/crud"
import type { DialogFormData } from "@/components/admin/crud-dialog"

interface BaseCrudPageProps<T extends BaseLookupItem> {
  title: string
  entityName: string
  apiPath: string
  additionalColumns?: ColumnDef<T>[]
}

export function BaseCrudPage<T extends BaseLookupItem>({
  title,
  entityName,
  apiPath,
  additionalColumns = [],
}: BaseCrudPageProps<T>) {
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editItem, setEditItem] = useState<T | null>(null)

  // Fetch items
  const { data: items, isLoading } = useQuery<T[]>({
    queryKey: [apiPath],
    queryFn: async () => {
      const response = await fetch(`/api/admin/${apiPath}`)
      if (!response.ok) throw new Error(`Failed to fetch ${entityName}`)
      return response.json()
    },
  })

  // Create item
  const createMutation = useMutation({
    mutationFn: async (data: { name: string }) => {
      const response = await fetch(`/api/admin/${apiPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`Failed to create ${entityName}`)
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiPath] })
      toast.success(`${entityName} created successfully`)
    },
    onError: () => {
      toast.error(`Failed to create ${entityName}`)
    },
  })

  // Update item
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: { name: string }
    }) => {
      const response = await fetch(`/api/admin/${apiPath}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(`Failed to update ${entityName}`)
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiPath] })
      setEditItem(null)
      toast.success(`${entityName} updated successfully`)
    },
    onError: () => {
      toast.error(`Failed to update ${entityName}`)
    },
  })

  // Delete item
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/${apiPath}/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error(`Failed to delete ${entityName}`)
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [apiPath] })
      setDeleteId(null)
      toast.success(`${entityName} deleted successfully`)
    },
    onError: () => {
      toast.error(`Failed to delete ${entityName}`)
    },
  })

  const handleCreate = async (formData: DialogFormData) => {
    const itemData = {
      name: formData.name,
    }
    await createMutation.mutateAsync(itemData)
  }

  const handleUpdate = async (formData: DialogFormData) => {
    if (!editItem) return

    const itemData = {
      name: formData.name,
    }

    await updateMutation.mutateAsync({
      id: editItem.id,
      data: itemData,
    })
  }

  const columns: ColumnDef<T>[] = [
    ...getBaseColumns<T>(),
    ...additionalColumns,
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original
        const hasResources = Boolean(item._count?.resources)

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditItem(item)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteId(item.id)}
                disabled={hasResources}
                className={
                  hasResources ? "text-muted-foreground" : "text-red-600"
                }
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
                {hasResources && " (Has resources)"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">
              Manage the {entityName.toLowerCase()}s available in your viral
              library
            </p>
          </div>
          <CrudDialog
            title={entityName}
            description={`Add a new ${entityName.toLowerCase()} to the library`}
            fields={[
              {
                name: "name",
                label: "Name",
                required: true,
              },
            ]}
            onSubmit={handleCreate}
          />
        </div>

        <DataTable columns={columns} data={items || []} searchColumn="name" />

        {/* Edit Dialog */}
        {editItem && (
          <CrudDialog
            title={entityName}
            description={`Update ${entityName.toLowerCase()} details`}
            fields={[
              {
                name: "name",
                label: "Name",
                required: true,
              },
            ]}
            initialData={{ name: editItem.name }}
            onSubmit={handleUpdate}
            trigger={null}
          />
        )}

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                {entityName.toLowerCase()}.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteId && deleteMutation.mutate(deleteId)}
                className="bg-red-600 hover:bg-red-700"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-2 h-4 w-4" />
                )}
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  )
}
