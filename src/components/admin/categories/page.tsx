"use client"

import { BaseCrudPage } from "@/components/admin/base-crud-page"
import { BaseLookupItem } from "@/lib/types/crud"

interface Category extends BaseLookupItem {}

export default function CategoriesPage() {
  return (
    <BaseCrudPage<Category>
      title="Categories"
      entityName="Category"
      apiPath="categories"
    />
  )
}
