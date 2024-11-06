import { z } from "zod"

export const resourceSchema = z.object({
  creatorName: z.string().min(1, "Creator name is required"),
  postingDate: z.string().transform((str) => new Date(str)),
  tags: z.string().optional(),
  contentLink: z.string().url("Must be a valid URL"),
  contentDescription: z.string().optional(),
  totalViews: z.number().default(0),
  totalFollowers: z.number().default(0),
  initialSubscriberCount: z.number().default(0),
  platformId: z.number().min(1, "Platform is required"),
  orientationId: z.number().min(1, "Orientation is required"),
  editingStyleId: z.number().min(1, "Editing style is required"),
  categoryId: z.number().min(1, "Category is required"),
  durationId: z.number().min(1, "Duration is required"),
  languageId: z.number().min(1, "Language is required"),
})

export type ResourceFormData = z.infer<typeof resourceSchema>

export const favoriteSchema = z.object({
  resourceId: z.number(),
  userId: z.string(),
})

export type FavoriteFormData = z.infer<typeof favoriteSchema>
