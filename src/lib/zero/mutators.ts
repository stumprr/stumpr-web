import { defineMutator, defineMutators } from "@rocicorp/zero";

import { createId } from "@/lib/utils";
import { matchSchema } from "@/components/matches/schema";
import { playerSchema } from "@/components/players/schema";
import { teamSchema } from "@/components/teams/schema";

export const mutators = defineMutators({
	createPlayer: defineMutator(playerSchema, async ({ args, tx }) => {
		return await tx.mutate.player.insert({ ...args, id: createId(), createdAt: Date.now() });
	}),
	createTeam: defineMutator(teamSchema, async ({ args, tx }) => {
		return await tx.mutate.team.insert({ ...args, slug: args.slug.toUpperCase(), id: createId(), createdAt: Date.now() });
	}),
	createMatch: defineMutator(matchSchema, async ({ args, tx }) => {
		const orgId = args.orgId;
		const matchId = createId();

		const tossLoserTeamId = args.tossWinnerTeamId === args.teamA.teamId ? args.teamB.teamId : args.teamA.teamId;

		const tossWinnerBatsFirst = args.tossDecision === "BAT";
		const firstBattingTeamId = tossWinnerBatsFirst ? args.tossWinnerTeamId : tossLoserTeamId;
		const firstBowlingTeamId = tossWinnerBatsFirst ? tossLoserTeamId : args.tossWinnerTeamId;

		await tx.mutate.match.insert({
			orgId,
			id: matchId,
			title: args.title,
			format: args.format,
			status: "LIVE",
			overs: Number(args.overs),
			teamAId: args.teamA.teamId,
			teamBId: args.teamB.teamId,
			tossWinnerTeamId: args.tossWinnerTeamId,
			tossDecision: args.tossDecision,
			createdAt: args.createdAt,
		});

		const inningsCount = args.format === "TEST" ? 4 : 2;
		const innings = Array.from({ length: inningsCount }, (_, index) => {
			const isFirstTeamBatting = index % 2 === 0;
			return {
				matchId,
				orgId,
				runs: 0,
				wickets: 0,
				legalBalls: 0,
				number: index + 1,
				status: index === 0 ? "LIVE" : "NOT_STARTED",
				battingTeamId: isFirstTeamBatting ? firstBattingTeamId : firstBowlingTeamId,
				bowlingTeamId: isFirstTeamBatting ? firstBowlingTeamId : firstBattingTeamId,
			} as const;
		});

		for (const inning of innings) {
			await tx.mutate.inning.insert({ ...inning, id: createId(), createdAt: Date.now() });
		}

		const allPlayers = [
			...args.teamA.playerIds.map((playerId) => ({ teamId: args.teamA.teamId, playerId })),
			...args.teamB.playerIds.map((playerId) => ({ teamId: args.teamB.teamId, playerId })),
		];

		for (const player of allPlayers) {
			await tx.mutate.match_player.insert({ ...player, orgId, matchId, id: createId() });
		}
	}),
});
