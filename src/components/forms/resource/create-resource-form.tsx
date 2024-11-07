"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod" // not resolver/zod
import * as z from "zod"
import { Platform } from "@prisma/client"
import { platformRegistry } from "@/lib/platforms/registry"
import { ResourceEmbed } from "../../resources/resource-embed"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Link as LinkIcon } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const resourceSchema = z.object({
  contentLink: z.string().url("Please enter a valid URL"),
  platformId: z.string().min(1, "Please select a platform"),
  creatorName: z.string().min(1, "Creator name is required"),
  // Add other fields as needed
})

type ResourceFormData = z.infer<typeof resourceSchema>

interface ResourceFormProps {
  platforms: Platform[]
  onSubmit: (data: ResourceFormData) => Promise<void>
}

export function ResourceForm({ platforms, onSubmit }: ResourceFormProps) {
  const { toast } = useToast()
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(
    null
  )
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false)

  const form = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      contentLink: "",
      platformId: "",
      creatorName: "",
    },
  })

  const handleUrlValidation = async (url: string, platformId: string) => {
    const platform = platforms.find((p) => p.id.toString() === platformId)
    if (!platform) {
      setIsValidUrl(false)
      return
    }

    try {
      const isValid = platformRegistry.validateUrl(platform.name, url)
      setIsValidUrl(isValid)
      if (!isValid) {
        toast({
          title: "Invalid URL",
          description: `This URL is not a valid ${platform.name} URL`,
          variant: "destructive",
        })
      }
    } catch (error) {
      setIsValidUrl(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="platformId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value)
                  const platform = platforms.find(
                    (p) => p.id.toString() === value
                  )
                  setSelectedPlatform(platform || null)
                  // Revalidate URL when platform changes
                  const url = form.getValues("contentLink")
                  if (url) handleUrlValidation(url, value)
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a platform" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem
                      key={platform.id}
                      value={platform.id.toString()}
                    >
                      {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contentLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content URL</FormLabel>
              <FormControl>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    {...field}
                    className="pl-10"
                    placeholder="Paste content URL here"
                    onChange={(e) => {
                      field.onChange(e)
                      const platformId = form.getValues("platformId")
                      if (platformId)
                        handleUrlValidation(e.target.value, platformId)
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Preview */}
        {isValidUrl && selectedPlatform && form.watch("contentLink") && (
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium mb-2">Preview</h3>
            <ResourceEmbed
              url={form.watch("contentLink")}
              platform={selectedPlatform}
              className="rounded-md overflow-hidden"
            />
          </div>
        )}

        {/* Add other fields like creatorName, etc. */}

        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !isValidUrl}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit Resource"
          )}
        </Button>
      </form>
    </Form>
  )
}
