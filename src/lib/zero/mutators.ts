import { defineMutator, defineMutators } from "@rocicorp/zero";

import { createId } from "@/lib/utils";
import { playerSchema } from "@/components/players/player-form";

export const mutators = defineMutators({
	createPlayer: defineMutator(playerSchema, async ({ args, tx }) => {
		return await tx.mutate.Player.insert({ ...args, id: createId(), createdAt: Date.now() });
	}),
});
