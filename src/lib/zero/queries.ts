import { defineQueries, defineQuery } from "@rocicorp/zero";
import { z } from "zod";

import { zql } from "@/lib/zero/schema";

const userIdSchema = z.object({ userId: z.string().nonempty() });
const orgIdSchema = z.object({ orgId: z.string().nonempty() });

const userOrgSchema = userIdSchema.extend(orgIdSchema.shape);

export const queries = defineQueries({
  joinedOrgsByUser: defineQuery(userIdSchema, ({ args }) => {
    return zql.organization
      .whereExists("members", (member) => member.where("userId", args.userId))
      .orderBy("name", "asc");
  }),
  getOrgMember: defineQuery(userOrgSchema, ({ args }) => {
    return zql.member.where("organizationId", args.orgId).where("userId", args.userId).one();
  }),
  getOrgPlayers: defineQuery(orgIdSchema, ({ args }) => {
    return zql.player.where("orgId", args.orgId).orderBy("name", "asc");
  }),
  getOrgTeams: defineQuery(orgIdSchema, ({ args }) => {
    return zql.team.where("orgId", args.orgId).orderBy("name", "asc");
  }),
  getOrgMatches: defineQuery(orgIdSchema, ({ args }) => {
    return zql.match
      .where("orgId", args.orgId)
      .orderBy("createdAt", "desc")
      .related("teamA")
      .related("teamB")
      .related("innings", (q) => q.orderBy("number", "asc"));
  }),
});
