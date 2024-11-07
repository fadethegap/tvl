"use client"

import { BaseCrudPage } from "@/components/admin/base-crud-page"
import { BaseLookupItem } from "@/lib/types/crud"

interface EditingStyle extends BaseLookupItem {}

export default function EditingStylesPage() {
  return (
    <BaseCrudPage<EditingStyle>
      title="Editing Styles"
      entityName="Editing Style"
      apiPath="editing-styles"
    />
  )
}
