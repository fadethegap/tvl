"use client"

import { BaseCrudPage } from "@/components/admin/base-crud-page"
import { BaseLookupItem } from "@/lib/types/crud"

interface Duration extends BaseLookupItem {}

export default function DurationsPage() {
  return (
    <BaseCrudPage<Duration>
      title="Durations"
      entityName="Duration"
      apiPath="durations"
    />
  )
}
