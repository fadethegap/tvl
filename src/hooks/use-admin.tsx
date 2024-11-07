import { useUser } from "@clerk/nextjs"

export function useAdmin() {
  const { user } = useUser()
  const role = user?.publicMetadata?.role as string

  return {
    isAdmin: role === "admin",
    isStaffAdmin: role === "staff_admin",
    canDelete: role === "admin",
    canApprove: ["admin", "staff_admin"].includes(role),
    role,
  }
}
