"use client"

import { BaseCrudPage } from "@/components/admin/base-crud-page"
import { BaseLookupItem } from "@/lib/types/crud"

interface Language extends BaseLookupItem {}

export default function LanguagesPage() {
  return (
    <BaseCrudPage<Language>
      title="Languages"
      entityName="Language"
      apiPath="languages"
    />
  )
}
