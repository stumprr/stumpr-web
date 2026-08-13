import { defineMutator, defineMutators } from "@rocicorp/zero";
import { z } from "zod";

import { createId } from "@/lib/utils";
import { matchSchema } from "@/components/matches/match-form";
import { playerSchema } from "@/components/players/player-form";
import { teamSchema } from "@/components/teams/team-form";

const orgIdSchema = z.object({ orgId: z.string().nonempty() });

export const mutators = defineMutators({
	createPlayer: defineMutator(playerSchema, async ({ args, tx }) => {
		return await tx.mutate.Player.insert({ ...args, id: createId(), createdAt: Date.now() });
	}),
	createTeam: defineMutator(teamSchema, async ({ args, tx }) => {
		return await tx.mutate.Team.insert({ ...args, slug: args.slug.toUpperCase(), id: createId(), createdAt: Date.now() });
	}),
	createMatch: defineMutator(matchSchema, async ({ args, tx }) => {
		const matchId = createId();

		await tx.mutate.Match.insert({
			id: matchId,
			orgId: args.orgId,
			number: Number(args.number),
			format: args.format,
			status: "LIVE",
			overs: Number(args.overs),
			teamAId: args.teamA.teamId,
			teamBId: args.teamB.teamId,
			tossWinnerTeamId: args.tossWinnerTeamId,
			tossDecision: args.tossDecision,
			createdAt: args.createdAt,
		});

		for (const playerId of args.teamA.playerIds) {
			await tx.mutate.MatchPlayer.insert({
				id: createId(),
				orgId: args.orgId,
				matchId: matchId,
				teamId: args.teamA.teamId,
				playerId: playerId,
			});
		}

		for (const playerId of args.teamB.playerIds) {
			await tx.mutate.MatchPlayer.insert({
				id: createId(),
				orgId: args.orgId,
				matchId: matchId,
				teamId: args.teamB.teamId,
				playerId: playerId,
			});
		}
	}),
});
