"use client"

import { BaseCrudPage } from "@/components/admin/base-crud-page"
import { BaseLookupItem } from "@/lib/types/crud"

interface Orientation extends BaseLookupItem {}

export default function OrientationsPage() {
  return (
    <BaseCrudPage<Orientation>
      title="Orientations"
      entityName="Orientation"
      apiPath="orientations"
    />
  )
}
