import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

import { useOrg } from "@/contexts/org-context";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { AdminAccess } from "@/components/dashboard/admin-access";
import { DashboardLayout } from "@/components/dashboard/layout";
import { PlayerAvatar } from "@/components/players/player-avatar";
import { TeamForm } from "@/components/teams/team-form";

export const Route = createFileRoute("/_auth/$orgId/teams/")({
	component: TeamsRoute,
});

function TeamsRoute() {
	const { teams } = useOrg();

	return (
		<DashboardLayout
			title="Teams"
			actions={
				<AdminAccess>
					<TeamForm
						trigger={
							<Button>
								<PlusIcon />
								Add team
							</Button>
						}
					/>
				</AdminAccess>
			}
		>
			<section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
				{teams.map((team) => (
					<Item key={team.id} variant="outline">
						<PlayerAvatar src={team.image} alt={team.name} />
						<ItemContent className="gap-0">
							<ItemTitle>{team.name}</ItemTitle>
							<ItemDescription>{team.slug}</ItemDescription>
						</ItemContent>
					</Item>
				))}
			</section>
		</DashboardLayout>
	);
}
