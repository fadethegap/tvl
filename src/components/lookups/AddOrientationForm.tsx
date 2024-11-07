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

const orientationSchema = z.object({
  name: z.string().min(2, {
    message: "Orientation name must be at least 2 characters.",
  }),
})

type OrientationFormValues = z.infer<typeof orientationSchema>

export default function AddOrientationForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<OrientationFormValues>({
    resolver: zodResolver(orientationSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(data: OrientationFormValues) {
    try {
      setIsLoading(true)

      const response = await fetch(
        "/api/lookups/orientations/add-orientation",
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
        throw new Error(errorData.error || "Failed to create orientation")
      }

      await response.json()
      showToast("success", "Orientation has been created successfully.")
      form.reset()
    } catch (error) {
      console.error("Error creating orientation:", error)
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to create orientation. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Orientation</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Orientation Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter duration (e.g., 'Vertical', 'Horizontal')"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Orientation"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
