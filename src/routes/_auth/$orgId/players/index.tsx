import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";

import { useOrg } from "@/contexts/org-context";
import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { AdminAccess } from "@/components/dashboard/admin-access";
import { DashboardLayout } from "@/components/dashboard/layout";
import { PlayerAvatar } from "@/components/players/player-avatar";
import { PlayerForm } from "@/components/players/form";

export const Route = createFileRoute("/_auth/$orgId/players/")({
	component: PlayersRoute,
});

function PlayersRoute() {
	const { players } = useOrg();

	return (
		<DashboardLayout
			title="Players"
			actions={
				<AdminAccess>
					<PlayerForm
						trigger={
							<Button>
								<PlusIcon />
								Add player
							</Button>
						}
					/>
				</AdminAccess>
			}
		>
			<section className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
				{players.map((player) => (
					<Item key={player.id} variant="outline">
						<PlayerAvatar src={player.image} alt={player.name} />
						<ItemContent className="gap-0">
							<ItemTitle>{player.name}</ItemTitle>
							<ItemDescription>{player.role}</ItemDescription>
						</ItemContent>
					</Item>
				))}
			</section>
		</DashboardLayout>
	);
}
