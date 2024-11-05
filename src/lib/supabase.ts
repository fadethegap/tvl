// lib/supabase.ts

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Database } from "../../database.types"

// For server-side operations
export const supabase = createSupabaseClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_KEY || ""
)

// For client-side operations
export const createBrowserClient = () => {
  return createClientComponentClient<Database>()
}

// For admin operations with service role
export const getServiceSupabase = () =>
  createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_KEY || ""
  )

// Creates a signed URL for accessing private files temporarily
export const getSignedUrl = async (path: string, expiresIn: number) => {
  const { data, error } = await supabase.storage
    .from("images")
    .createSignedUrl(path, expiresIn)

  if (error) throw new Error(`Error creating signed URL: ${error.message}`)
  return data?.signedUrl // Access data.signedUrl correctly
}

// Fetches a public URL for a file, ideal for displaying publicly accessible files
export const getPublicUrlForDisplay = (path: string) => {
  const { data } = supabase.storage.from("videos").getPublicUrl(path)

  if (!data) throw new Error("Error fetching public URL.")
  return data.publicUrl // Access data.publicUrl correctly
}
