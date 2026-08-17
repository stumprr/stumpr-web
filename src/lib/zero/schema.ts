import { boolean, createBuilder, createSchema, enumeration, number, relationships, string, table } from "@rocicorp/zero";

export type MATCH_FORMAT = "LIMITED_OVERS" | "TEST";
export type TOSS_DECISION = "BAT" | "BOWL";

export type MATCH_STATUS = "SCHEDULED" | "LIVE" | "COMPLETED" | "ABANDONED" | "CANCELLED";

export type MATCH_RESULT = "WIN" | "TIE" | "NO_RESULT" | "ABANDONED" | "CANCELLED";

export type INNING_STATUS = "NOT_STARTED" | "LIVE" | "COMPLETED" | "DECLARED" | "FORFEITED";

export type DISMISSAL_KIND =
	| "BOWLED"
	| "CAUGHT"
	| "CAUGHT_AND_BOWLED"
	| "RUN_OUT"
	| "STUMPED"
	| "LBW"
	| "HIT_WICKET"
	| "MANKAD"
	| "RETIRED_OUT"
	| "RETIRED_HURT"
	| "OBSTRUCTING_FIELD"
	| "TIMED_OUT"
	| "HIT_BALL_TWICE";

export const userTable = table("user")
	.from("users")
	.columns({
		id: string(),
		name: string(),
		email: string(),
		emailVerified: boolean(),
		image: string().optional(),
		createdAt: number(),
		updatedAt: number(),
	})
	.primaryKey("id");

export const sessionTable = table("session")
	.from("sessions")
	.columns({
		id: string(),
		expiresAt: number(),
		token: string(),
		createdAt: number(),
		updatedAt: number(),
		ipAddress: string().optional(),
		userAgent: string().optional(),
		activeOrganizationId: string().optional(),
		activeTeamId: string().optional(),
		userId: string(),
	})
	.primaryKey("id");

export const accountTable = table("account")
	.from("accounts")
	.columns({
		id: string(),
		accountId: string(),
		providerId: string(),
		userId: string(),
		accessToken: string().optional(),
		refreshToken: string().optional(),
		idToken: string().optional(),
		accessTokenExpiresAt: number().optional(),
		refreshTokenExpiresAt: number().optional(),
		scope: string().optional(),
		password: string().optional(),
		createdAt: number(),
		updatedAt: number(),
	})
	.primaryKey("id");

export const verificationTable = table("verification")
	.from("verifications")
	.columns({
		id: string(),
		identifier: string(),
		value: string(),
		expiresAt: number(),
		createdAt: number(),
		updatedAt: number(),
	})
	.primaryKey("id");

export const organizationTable = table("organization")
	.from("organizations")
	.columns({
		id: string(),
		name: string(),
		slug: string(),
		logo: string().optional(),
		metadata: string().optional(),
		createdAt: number(),
	})
	.primaryKey("id");

export const memberTable = table("member")
	.from("members")
	.columns({
		id: string(),
		role: string(),
		userId: string(),
		organizationId: string(),
		createdAt: number(),
	})
	.primaryKey("id");

export const invitationTable = table("invitation")
	.from("invitations")
	.columns({
		id: string(),
		email: string(),
		role: string().optional(),
		status: string(),
		inviterId: string(),
		organizationId: string(),
		createdAt: number(),
		expiresAt: number(),
	})
	.primaryKey("id");

export const playerTable = table("player")
	.from("players")
	.columns({
		id: string(),
		orgId: string(),
		userId: string().optional(),
		name: string(),
		role: string(),
		image: string().optional(),
		createdAt: number(),
	})
	.primaryKey("id");

export const teamTable = table("team")
	.from("teams")
	.columns({
		id: string(),
		orgId: string(),
		name: string(),
		slug: string(),
		image: string().optional(),
		createdAt: number(),
	})
	.primaryKey("id");

export const matchTable = table("match")
	.from("matches")
	.columns({
		id: string(),
		orgId: string(),
		title: string(),
		format: enumeration<MATCH_FORMAT>(),
		status: enumeration<MATCH_STATUS>(),
		overs: number(),
		teamAId: string(),
		teamBId: string(),
		tossWinnerTeamId: string(),
		tossDecision: enumeration<TOSS_DECISION>(),
		winnerTeamId: string().optional(),
		result: enumeration<MATCH_RESULT>().optional(),
		winMarginRuns: number().optional(),
		winMarginWickets: number().optional(),
		playerOfTheMatchId: string().optional(),
		createdAt: number(),
	})
	.primaryKey("id");

export const matchPlayerTable = table("match_player")
	.from("match_players")
	.columns({
		id: string(),
		orgId: string(),
		matchId: string(),
		teamId: string(),
		playerId: string(),
	})
	.primaryKey("id");

export const inningTable = table("inning")
	.from("innings")
	.columns({
		id: string(),
		orgId: string(),
		matchId: string(),
		number: number(),
		runs: number(),
		wickets: number(),
		legalBalls: number(),
		status: enumeration<INNING_STATUS>(),
		battingTeamId: string(),
		bowlingTeamId: string(),
		oversLimit: number().optional(),
		targetRuns: number().optional(),
		createdAt: number(),
	})
	.primaryKey("id");

export const ballTable = table("ball")
	.from("balls")
	.columns({
		id: string(),
		orgId: string(),
		inningId: string(),
		sequence: number(),
		batterId: string(),
		bowlerId: string(),
		nonStrikerId: string(),
		fielderId: string().optional(),
		secondaryFielderId: string().optional(),
		dismissedPlayerId: string().optional(),
		dismissalKind: enumeration<DISMISSAL_KIND>().optional(),
		runsOffBat: number(),
		wides: number(),
		noBalls: number(),
		byes: number(),
		legByes: number(),
		createdAt: number(),
	})
	.primaryKey("id");

export const userTableRelationships = relationships(userTable, ({ one, many }) => ({
	sessions: many({
		sourceField: ["id"],
		destField: ["userId"],
		destSchema: sessionTable,
	}),
	accounts: many({
		sourceField: ["id"],
		destField: ["userId"],
		destSchema: accountTable,
	}),
	members: many({
		sourceField: ["id"],
		destField: ["userId"],
		destSchema: memberTable,
	}),
	invitations: many({
		sourceField: ["id"],
		destField: ["inviterId"],
		destSchema: invitationTable,
	}),
	player: one({
		sourceField: ["id"],
		destField: ["userId"],
		destSchema: playerTable,
	}),
}));
export const sessionTableRelationships = relationships(sessionTable, ({ one }) => ({
	user: one({
		sourceField: ["userId"],
		destField: ["id"],
		destSchema: userTable,
	}),
}));
export const accountTableRelationships = relationships(accountTable, ({ one }) => ({
	user: one({
		sourceField: ["userId"],
		destField: ["id"],
		destSchema: userTable,
	}),
}));
export const organizationTableRelationships = relationships(organizationTable, ({ many }) => ({
	members: many({
		sourceField: ["id"],
		destField: ["organizationId"],
		destSchema: memberTable,
	}),
	invitations: many({
		sourceField: ["id"],
		destField: ["organizationId"],
		destSchema: invitationTable,
	}),
	players: many({
		sourceField: ["id"],
		destField: ["orgId"],
		destSchema: playerTable,
	}),
	teams: many({
		sourceField: ["id"],
		destField: ["orgId"],
		destSchema: teamTable,
	}),
	matches: many({
		sourceField: ["id"],
		destField: ["orgId"],
		destSchema: matchTable,
	}),
	innings: many({
		sourceField: ["id"],
		destField: ["orgId"],
		destSchema: inningTable,
	}),
	balls: many({
		sourceField: ["id"],
		destField: ["orgId"],
		destSchema: ballTable,
	}),
}));
export const memberTableRelationships = relationships(memberTable, ({ one }) => ({
	user: one({
		sourceField: ["userId"],
		destField: ["id"],
		destSchema: userTable,
	}),
	organization: one({
		sourceField: ["organizationId"],
		destField: ["id"],
		destSchema: organizationTable,
	}),
}));
export const invitationTableRelationships = relationships(invitationTable, ({ one }) => ({
	inviter: one({
		sourceField: ["inviterId"],
		destField: ["id"],
		destSchema: userTable,
	}),
	organization: one({
		sourceField: ["organizationId"],
		destField: ["id"],
		destSchema: organizationTable,
	}),
}));
export const playerTableRelationships = relationships(playerTable, ({ one, many }) => ({
	org: one({
		sourceField: ["orgId"],
		destField: ["id"],
		destSchema: organizationTable,
	}),
	user: one({
		sourceField: ["userId"],
		destField: ["id"],
		destSchema: userTable,
	}),
	potmMatches: many({
		sourceField: ["id"],
		destField: ["playerOfTheMatchId", "orgId"],
		destSchema: matchTable,
	}),
	matchSelections: many({
		sourceField: ["id"],
		destField: ["playerId", "orgId"],
		destSchema: matchPlayerTable,
	}),
	battingBalls: many({
		sourceField: ["id"],
		destField: ["batterId", "orgId"],
		destSchema: ballTable,
	}),
	nonStrikerBalls: many({
		sourceField: ["id"],
		destField: ["nonStrikerId", "orgId"],
		destSchema: ballTable,
	}),
	bowlingBalls: many({
		sourceField: ["id"],
		destField: ["bowlerId", "orgId"],
		destSchema: ballTable,
	}),
	fieldingBalls: many({
		sourceField: ["id"],
		destField: ["fielderId", "orgId"],
		destSchema: ballTable,
	}),
	secondaryFieldingBalls: many({
		sourceField: ["id"],
		destField: ["secondaryFielderId", "orgId"],
		destSchema: ballTable,
	}),
	dismissedBalls: many({
		sourceField: ["id"],
		destField: ["dismissedPlayerId", "orgId"],
		destSchema: ballTable,
	}),
}));
export const teamTableRelationships = relationships(teamTable, ({ one, many }) => ({
	org: one({
		sourceField: ["orgId"],
		destField: ["id"],
		destSchema: organizationTable,
	}),
	matchTeamA: many({
		sourceField: ["id"],
		destField: ["teamAId", "orgId"],
		destSchema: matchTable,
	}),
	matchTeamB: many({
		sourceField: ["id"],
		destField: ["teamBId", "orgId"],
		destSchema: matchTable,
	}),
	tossWonMatches: many({
		sourceField: ["id"],
		destField: ["tossWinnerTeamId", "orgId"],
		destSchema: matchTable,
	}),
	wonMatches: many({
		sourceField: ["id"],
		destField: ["winnerTeamId", "orgId"],
		destSchema: matchTable,
	}),
	battingInnings: many({
		sourceField: ["id"],
		destField: ["battingTeamId", "orgId"],
		destSchema: inningTable,
	}),
	bowlingInnings: many({
		sourceField: ["id"],
		destField: ["bowlingTeamId", "orgId"],
		destSchema: inningTable,
	}),
	matchPlayers: many({
		sourceField: ["id"],
		destField: ["teamId", "orgId"],
		destSchema: matchPlayerTable,
	}),
}));
export const matchTableRelationships = relationships(matchTable, ({ one, many }) => ({
	org: one({
		sourceField: ["orgId"],
		destField: ["id"],
		destSchema: organizationTable,
	}),
	teamA: one({
		sourceField: ["teamAId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: teamTable,
	}),
	teamB: one({
		sourceField: ["teamBId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: teamTable,
	}),
	tossWinnerTeam: one({
		sourceField: ["tossWinnerTeamId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: teamTable,
	}),
	winnerTeam: one({
		sourceField: ["winnerTeamId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: teamTable,
	}),
	playerOfTheMatch: one({
		sourceField: ["playerOfTheMatchId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: playerTable,
	}),
	innings: many({
		sourceField: ["id"],
		destField: ["matchId", "orgId"],
		destSchema: inningTable,
	}),
	players: many({
		sourceField: ["id"],
		destField: ["matchId", "orgId"],
		destSchema: matchPlayerTable,
	}),
}));
export const matchPlayerTableRelationships = relationships(matchPlayerTable, ({ one }) => ({
	match: one({
		sourceField: ["matchId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: matchTable,
	}),
	team: one({
		sourceField: ["teamId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: teamTable,
	}),
	player: one({
		sourceField: ["playerId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: playerTable,
	}),
}));
export const inningTableRelationships = relationships(inningTable, ({ one, many }) => ({
	org: one({
		sourceField: ["orgId"],
		destField: ["id"],
		destSchema: organizationTable,
	}),
	match: one({
		sourceField: ["matchId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: matchTable,
	}),
	battingTeam: one({
		sourceField: ["battingTeamId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: teamTable,
	}),
	bowlingTeam: one({
		sourceField: ["bowlingTeamId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: teamTable,
	}),
	balls: many({
		sourceField: ["id"],
		destField: ["inningId", "orgId"],
		destSchema: ballTable,
	}),
}));
export const ballTableRelationships = relationships(ballTable, ({ one }) => ({
	org: one({
		sourceField: ["orgId"],
		destField: ["id"],
		destSchema: organizationTable,
	}),
	inning: one({
		sourceField: ["inningId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: inningTable,
	}),
	batter: one({
		sourceField: ["batterId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: playerTable,
	}),
	bowler: one({
		sourceField: ["bowlerId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: playerTable,
	}),
	nonStriker: one({
		sourceField: ["nonStrikerId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: playerTable,
	}),
	fielder: one({
		sourceField: ["fielderId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: playerTable,
	}),
	secondaryFielder: one({
		sourceField: ["secondaryFielderId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: playerTable,
	}),
	dismissedPlayer: one({
		sourceField: ["dismissedPlayerId", "orgId"],
		destField: ["id", "orgId"],
		destSchema: playerTable,
	}),
}));
/**
 * The Zero schema object.
 * This type is auto-generated from your Prisma schema definition.
 */
export const schema = createSchema({
	tables: [
		userTable,
		sessionTable,
		accountTable,
		verificationTable,
		organizationTable,
		memberTable,
		invitationTable,
		playerTable,
		teamTable,
		matchTable,
		matchPlayerTable,
		inningTable,
		ballTable,
	],
	relationships: [
		userTableRelationships,
		sessionTableRelationships,
		accountTableRelationships,
		organizationTableRelationships,
		memberTableRelationships,
		invitationTableRelationships,
		playerTableRelationships,
		teamTableRelationships,
		matchTableRelationships,
		matchPlayerTableRelationships,
		inningTableRelationships,
		ballTableRelationships,
	],
});

/**
 * Represents the Zero schema type.
 * This type is auto-generated from your Prisma schema definition.
 */
export type Schema = typeof schema;
/**
 * Represents the ZQL query builder.
 * This type is auto-generated from your Prisma schema definition.
 */
export const zql = createBuilder(schema);

/** Defines the default types for Zero */
declare module "@rocicorp/zero" {
	interface DefaultTypes {
		schema: Schema;
	}
}
