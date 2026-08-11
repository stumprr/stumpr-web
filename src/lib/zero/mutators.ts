import { defineMutator, defineMutators } from "@rocicorp/zero";

import { createId } from "@/lib/utils";
import { playerSchema } from "@/components/players/player-form";
import { teamSchema } from "@/components/teams/team-form";

export const mutators = defineMutators({
	createPlayer: defineMutator(playerSchema, async ({ args, tx }) => {
		return await tx.mutate.Player.insert({ ...args, id: createId(), createdAt: Date.now() });
	}),
	createTeam: defineMutator(teamSchema, async ({ args, tx }) => {
		return await tx.mutate.Team.insert({ ...args, slug: args.slug.toUpperCase(), id: createId(), createdAt: Date.now() });
	}),
});
