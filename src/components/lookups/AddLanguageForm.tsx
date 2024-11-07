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

const languageSchema = z.object({
  name: z.string().min(2, {
    message: "Language name must be at least 2 characters.",
  }),
})

type LanguageFormValues = z.infer<typeof languageSchema>

export default function AddLanguageForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      name: "",
    },
  })

  async function onSubmit(data: LanguageFormValues) {
    try {
      setIsLoading(true)

      const response = await fetch("/api/lookups/languages/add-language", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to create language")
      }

      await response.json()
      showToast("success", "Language has been created successfully.")
      form.reset()
    } catch (error) {
      console.error("Error creating language:", error)
      showToast(
        "error",
        error instanceof Error
          ? error.message
          : "Failed to create language. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Language</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter language name (e.g., 'English', 'Spanish')"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Language"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
