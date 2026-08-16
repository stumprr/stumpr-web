import { z } from "zod";

export const teamSchema = z.object({
	orgId: z.string().nonempty().readonly(),
	name: z.string().nonempty("Enter a valid team name").trim(),
	slug: z.string().nonempty("Enter a valid team short name").max(4, "Team short name can only contain 4 charaters").trim(),
});

export type TeamSchema = z.infer<typeof teamSchema>;
