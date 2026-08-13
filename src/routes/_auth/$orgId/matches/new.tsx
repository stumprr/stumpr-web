import { createFileRoute } from "@tanstack/react-router";

import { DashboardLayout } from "@/components/dashboard/layout";
import { MatchForm } from "@/components/matches/match-form";

export const Route = createFileRoute("/_auth/$orgId/matches/new")({
	component: NewMatchRoute,
});

function NewMatchRoute() {
	return (
		<DashboardLayout title="New Match">
			<MatchForm />
		</DashboardLayout>
	);
}
