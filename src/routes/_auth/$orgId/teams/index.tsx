import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

import { useOrg } from "@/contexts/org-context";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item";
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
				<TeamForm
					trigger={
						<Button>
							<PlusIcon />
							Add team
						</Button>
					}
				/>
			}
		>
			<section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
				{teams.map((team) => (
					<Item key={team.id} variant="outline">
						<ItemMedia variant="image">
							<PlayerAvatar src={team.image} alt={team.name} />
						</ItemMedia>
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
