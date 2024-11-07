"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { showToast } from "@/lib/utils/toastUtils"

const editingStyleSchema = z.object({
  name: z.string().min(2, {
    message: "Editing style name must be at least 2 characters.",
  }),
})

type EditingStyleFormValues = z.infer<typeof editingStyleSchema>

export default function AddEditingStyleForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<EditingStyleFormValues>({
    resolver: zodResolver(editingStyleSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(data: EditingStyleFormValues) {
    try {
      setIsLoading(true)

      const response = await fetch(
        "/api/lookups/editing-styles/add-editing-style",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create editing style")
      }

      await response.json()
      showToast("success", "Editing style has been created successfully.")
      form.reset()
    } catch (error) {
      console.error("Error creating editing style:", error)
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to create editing style. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Editing Style</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Editing Style Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter editing style (e.g., 'Vlog', 'Talking Head')"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Editing Style"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
