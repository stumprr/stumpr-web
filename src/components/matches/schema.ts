import { z } from "zod";

export const matchSchema = z
	.object({
		orgId: z.string().nonempty().readonly(),
		title: z.string().trim().nonempty(),
		createdAt: z.number().positive(),
		overs: z.string().trim().nonempty("Enter valid number of overs"),
		format: z.enum(["LIMITED_OVERS", "TEST"], "Select a valid match format"),
		tossWinnerTeamId: z.string().trim().nonempty("Select a valid toss winner"),
		tossDecision: z.enum(["BAT", "BOWL"], { message: "Select a valid toss decision" }),
		teamA: z.object({
			teamId: z.string().trim().nonempty(),
			playerIds: z.array(z.string().nonempty("Select a valid player")).min(1, "Select at least one player"),
		}),
		teamB: z.object({
			teamId: z.string().trim().nonempty(),
			playerIds: z.array(z.string().nonempty("Select a valid player")).min(1, "Select at least one player"),
		}),
	})
	.superRefine((data, ctx) => {
		if (data.teamA.teamId === data.teamB.teamId) {
			ctx.addIssue({ code: "custom", path: ["teamB", "teamId"], message: "Select two different teams" });
		}

		const teamArray = [data.teamA.teamId, data.teamB.teamId];
		if (!teamArray.includes(data.tossWinnerTeamId)) {
			ctx.addIssue({ code: "custom", path: ["tossWinnerTeamId"], message: "Choose toss winner from selected teams" });
		}
	});

export type MatchSchema = z.infer<typeof matchSchema>;
