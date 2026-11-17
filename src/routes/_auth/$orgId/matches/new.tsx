import { createFileRoute } from "@tanstack/react-router";

import { useOrg } from "@/contexts/org-context";
import { DashboardLayout } from "@/components/dashboard/layout";
import { MatchForm } from "@/components/matches/form";

export const Route = createFileRoute("/_auth/$orgId/matches/new")({
  component: NewMatchRoute,
});

function NewMatchRoute() {
  const { isAdmin } = useOrg();

  if (!isAdmin) {
    throw Route.redirect({ to: "/$orgId/matches" });
  }

  return (
    <DashboardLayout title="New Match">
      <MatchForm />
    </DashboardLayout>
  );
}
