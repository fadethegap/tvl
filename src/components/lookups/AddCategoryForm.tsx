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
import { showToast } from "../../lib/toastUtils"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

// Zod schema for form validation
const categorySchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
})

type CategoryFormValues = z.infer<typeof categorySchema>

export default function AddCategoryForm() {
  const [isLoading, setIsLoading] = useState(false)

  // Initialize form with react-hook-form and zod validation
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(data: CategoryFormValues) {
    try {
      setIsLoading(true)

      const response = await fetch("/api/lookups/categories/add-category", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Failed to create category")
      }

      const result = await response.json()

      showToast("success", "Category has been created successfully.")

      // Reset form
      form.reset()
    } catch (error) {
      console.error("Error creating category:", error)
      showToast("error", "Failed to create category. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Category</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter duration (e.g., 'Comedy', 'Animals')"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Category"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
