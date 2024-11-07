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
import { format } from "date-fns"
import type { DialogFormData } from "@/components/admin/crud-dialog"

interface PlatformFormData {
  name: string
}

interface Platform {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  _count?: {
    resources: number
  }
}

export default function PlatformsPage() {
  const queryClient = useQueryClient()
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [editPlatform, setEditPlatform] = useState<Platform | null>(null)

  // Fetch platforms
  const { data: platforms, isLoading } = useQuery<Platform[]>({
    queryKey: ["platforms"],
    queryFn: async () => {
      const response = await fetch("/api/admin/platforms")
      if (!response.ok) throw new Error("Failed to fetch platforms")
      return response.json()
    },
  })

  // Create platform
  const createMutation = useMutation({
    mutationFn: async (data: PlatformFormData) => {
      const response = await fetch("/api/admin/platforms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to create platform")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] })
      toast.success("Platform created successfully")
    },
    onError: () => {
      toast.error("Failed to create platform")
    },
  })

  // Update platform
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number
      data: PlatformFormData
    }) => {
      const response = await fetch(`/api/admin/platforms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error("Failed to update platform")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] })
      setEditPlatform(null)
      toast.success("Platform updated successfully")
    },
    onError: () => {
      toast.error("Failed to update platform")
    },
  })

  // Delete platform
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/platforms/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete platform")
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] })
      setDeleteId(null)
      toast.success("Platform deleted successfully")
    },
    onError: () => {
      toast.error("Failed to delete platform")
    },
  })

  const handleCreate = async (formData: DialogFormData) => {
    const platformData: PlatformFormData = {
      name: formData.name,
    }
    await createMutation.mutateAsync(platformData)
  }

  const handleUpdate = async (formData: DialogFormData) => {
    if (!editPlatform) return

    const platformData: PlatformFormData = {
      name: formData.name,
    }

    await updateMutation.mutateAsync({
      id: editPlatform.id,
      data: platformData,
    })
  }

  const columns: ColumnDef<Platform>[] = [
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
    {
      id: "actions",
      cell: ({ row }) => {
        const platform = row.original
        const hasResources = Boolean(platform._count?.resources)

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditPlatform(platform)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setDeleteId(platform.id)}
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
            <h1 className="text-2xl font-bold tracking-tight">Platforms</h1>
            <p className="text-muted-foreground">
              Manage the platforms available in your viral library
            </p>
          </div>
          <CrudDialog
            title="Platform"
            description="Add a new platform to the library"
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

        <DataTable
          columns={columns}
          data={platforms || []}
          searchColumn="name"
        />

        {/* Edit Dialog */}
        {editPlatform && (
          <CrudDialog
            title="Platform"
            description="Update platform details"
            fields={[
              {
                name: "name",
                label: "Name",
                required: true,
              },
            ]}
            initialData={{ name: editPlatform.name }}
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
                platform.
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
