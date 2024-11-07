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

const durationSchema = z.object({
  name: z.string().min(2, {
    message: "Duration name must be at least 2 characters.",
  }),
})

type DurationFormValues = z.infer<typeof durationSchema>

export default function AddDurationForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<DurationFormValues>({
    resolver: zodResolver(durationSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(data: DurationFormValues) {
    try {
      setIsLoading(true)

      const response = await fetch("/api/lookups/durations/add-duration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create duration")
      }

      await response.json()
      showToast("success", "Duration has been created successfully.")
      form.reset()
    } catch (error) {
      console.error("Error creating duration:", error)
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to create duration. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Duration</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter duration (e.g., '0-30 seconds', '1-3 minutes')"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Duration"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
