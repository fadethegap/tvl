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

const platformSchema = z.object({
  name: z.string().min(2, {
    message: "Platform name must be at least 2 characters.",
  }),
})

type PlatformFormValues = z.infer<typeof platformSchema>

export default function AddPlatformForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<PlatformFormValues>({
    resolver: zodResolver(platformSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(data: PlatformFormValues) {
    try {
      setIsLoading(true)

      const response = await fetch("/api/lookups/platforms/add-platform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create platform")
      }

      await response.json()
      showToast("success", "Platform has been created successfully.")
      form.reset()
    } catch (error) {
      console.error("Error creating platform:", error)
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to create platform. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Platform</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter duration (e.g., 'Instagram Reels', 'Tiktok')"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Platform"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
