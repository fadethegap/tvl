"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Loader2 } from "lucide-react"

interface FormField {
  name: string
  label: string
  type?: string
  required?: boolean
}

interface FormData {
  [key: string]: string
}

export type DialogFormData = {
  [key: string]: string
}

interface CrudDialogProps {
  title: string
  description: string
  fields: FormField[]
  onSubmit: (data: DialogFormData) => Promise<void>
  trigger?: React.ReactNode
  initialData?: DialogFormData
}

export function CrudDialog({
  title,
  description,
  fields,
  onSubmit,
  trigger,
  initialData,
}: CrudDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialData || {})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
      setOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add {title}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {initialData ? `Edit ${title}` : `Add ${title}`}
            </DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div
                key={field.name}
                className="grid grid-cols-4 items-center gap-4"
              >
                <Label htmlFor={field.name} className="text-right">
                  {field.label}
                </Label>
                <Input
                  id={field.name}
                  type={field.type || "text"}
                  required={field.required}
                  className="col-span-3"
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      [field.name]: e.target.value,
                    }))
                  }
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
