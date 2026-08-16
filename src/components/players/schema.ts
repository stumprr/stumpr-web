import { z } from "zod";

export const playerSchema = z.object({
	orgId: z.string().nonempty().readonly(),
	name: z.string().nonempty("Enter a valid player name").trim(),
	role: z.string().nonempty("Select player role").trim(),
});

export type PlayerSchema = z.infer<typeof playerSchema>;
