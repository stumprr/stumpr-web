import { useOrg } from "@/contexts/org-context";

export function AdminAccess({ children }: React.PropsWithChildren) {
  const { isAdmin } = useOrg();

  if (!isAdmin) return;

  return children;
}
