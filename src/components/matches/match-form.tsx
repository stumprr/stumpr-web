import { useId } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useZero } from "@rocicorp/zero/react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { mutators } from "@/lib/zero/mutators";
import type { MATCH_FORMAT, TOSS_DECISION } from "@/lib/zero/schema";
import { useOrg } from "@/contexts/org-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const matchSchema = z.object({
	orgId: z.string().nonempty().readonly(),
	teamA: z.object({
		teamId: z.string().nonempty(),
		playerIds: z.array(z.string().nonempty("Select a valid player")).min(1, "Select at least one player"),
	}),
	teamB: z.object({
		teamId: z.string().nonempty(),
		playerIds: z.array(z.string().nonempty("Select a valid player")).min(1, "Select at least one player"),
	}),
	createdAt: z.number().positive(),
	number: z.string().trim().optional(),
	overs: z.string().nonempty("Enter valid number of overs").trim(),
	format: z.enum(["LIMITED_OVERS", "TEST"], "Select a valid match format"),
	tossWinnerTeamId: z.string().nonempty("Select a valid toss winner"),
	tossDecision: z.enum(["BAT", "BOWL"], { message: "Select a valid toss decision" }),
});

export type MatchSchema = z.infer<typeof matchSchema>;

const MATCH_FORMAT = [
	{ value: "LIMITED_OVERS", label: "Limited Overs" },
	{ value: "TEST", label: "Test" },
];

const TOSS_DECISION = [
	{ value: "BAT", label: "Bat" },
	{ value: "BOWL", label: "Bowl" },
];

export function MatchForm() {
	const formId = useId();
	const { mutate } = useZero();
	const navigate = useNavigate();
	const { orgId } = useParams({ from: "/_auth/$orgId/matches/new" });

	const { teams, players } = useOrg();

	const form = useForm<MatchSchema>({
		resolver: zodResolver(matchSchema),
		mode: "onChange",
		defaultValues: {
			orgId,
			number: "",
			overs: "",
			tossWinnerTeamId: "",
			format: "" as MATCH_FORMAT,
			tossDecision: "" as TOSS_DECISION,
			teamA: {
				teamId: "",
				playerIds: [],
			},
			teamB: {
				teamId: "",
				playerIds: [],
			},
			createdAt: Date.now(),
		},
	});

	const selectedTeamA = form.watch("teamA.teamId");
	const selectedTeamB = form.watch("teamB.teamId");

	const onSubmit = async (data: MatchSchema) => {
		const result = mutate(mutators.createMatch({ ...data }));
		try {
			const outcome = await result.server;
			if (outcome.type === "error") {
				return toast.error(outcome.error.message || "Could not create match.");
			}
			toast.success("Match has been created successfully!");
			navigate({ to: "/$orgId/matches", params: { orgId: orgId } });
		} catch (error) {
			console.error(error);
			toast.error("An unexpected error occurred.");
		}
	};

	return (
		<Card className="mx-auto w-full max-w-4xl [--card-spacing:--spacing(6)]">
			<CardContent>
				<form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
					<CardTitle className="col-span-2">Match Details</CardTitle>

					<Controller
						name="number"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Match Number</FieldLabel>
								<Input {...field} type="number" aria-invalid={fieldState.invalid} />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						name="format"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Match Format</FieldLabel>
								<Select name={field.name} value={field.value} onValueChange={field.onChange} items={MATCH_FORMAT}>
									<SelectTrigger aria-invalid={fieldState.invalid}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="LIMITED_OVERS">Limited Overs</SelectItem>
										<SelectItem value="TEST">Test Match</SelectItem>
									</SelectContent>
								</Select>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						name="overs"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Overs</FieldLabel>
								<Input {...field} type="number" aria-invalid={fieldState.invalid} />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						name="createdAt"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Date</FieldLabel>
								<Popover>
									<PopoverTrigger
										render={
											<Button variant="outline" className="h-9 w-full justify-start border-border text-left font-normal" aria-invalid={fieldState.invalid} />
										}
									>
										{field.value ? format(new Date(field.value), "PPP") : ""}
									</PopoverTrigger>
									<PopoverContent className="w-auto p-0" align="start">
										<Calendar
											mode="single"
											captionLayout="dropdown"
											selected={field.value ? new Date(field.value) : undefined}
											onSelect={(date) => field.onChange(date ? date.getTime() : Date.now())}
										/>
									</PopoverContent>
								</Popover>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<div className="col-span-2 -mx-6 border-t" />

					<CardTitle className="col-span-2">Teams Details</CardTitle>

					<Controller
						name="teamA.teamId"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Select Team A</FieldLabel>
								<Select
									name={field.name}
									value={field.value}
									onValueChange={field.onChange}
									items={teams.map((team) => ({ label: team.name, value: team.id, key: team.id }))}
								>
									<SelectTrigger aria-invalid={fieldState.invalid}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{teams
											.filter((team) => team.id !== selectedTeamB)
											.map((team) => (
												<SelectItem key={team.id} value={team.id}>
													{team.name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						name="teamB.teamId"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Select Team B</FieldLabel>
								<Select
									name={field.name}
									value={field.value}
									onValueChange={field.onChange}
									items={teams.map((team) => ({ label: team.name, value: team.id, key: team.id }))}
								>
									<SelectTrigger aria-invalid={fieldState.invalid}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{teams
											.filter((team) => team.id !== selectedTeamA)
											.map((team) => (
												<SelectItem key={team.id} value={team.id}>
													{team.name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					{selectedTeamA && (
						<Controller
							name="teamA.playerIds"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel className="justify-between">
										Select Team A Players
										{field.value && <Badge>{field.value.length}</Badge>}
									</FieldLabel>
									<Select
										name={field.name}
										value={field.value}
										onValueChange={field.onChange}
										items={players.map((player) => ({ label: player.name, value: player.id, key: player.id }))}
										multiple
									>
										<SelectTrigger aria-invalid={fieldState.invalid}>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{players.map((player) => (
												<SelectItem key={player.id} value={player.id}>
													{player.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
					)}

					{selectedTeamB && (
						<Controller
							name="teamB.playerIds"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel className="justify-between">
										Select Team B Players
										{field.value && <Badge>{field.value.length}</Badge>}
									</FieldLabel>
									<Select
										name={field.name}
										value={field.value}
										onValueChange={field.onChange}
										items={players.map((player) => ({ label: player.name, value: player.id, key: player.id }))}
										multiple
									>
										<SelectTrigger aria-invalid={fieldState.invalid}>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{players.map((player) => (
												<SelectItem key={player.id} value={player.id}>
													{player.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
					)}

					{selectedTeamA && selectedTeamB && (
						<>
							<div className="col-span-2 -mx-6 border-t" />

							<CardTitle className="col-span-2">Toss Details</CardTitle>

							<Controller
								name="tossWinnerTeamId"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Who Won the Toss?</FieldLabel>
										<Select
											name={field.name}
											value={field.value}
											onValueChange={field.onChange}
											items={teams.map((team) => ({ label: team.name, value: team.id, key: team.id }))}
										>
											<SelectTrigger aria-invalid={fieldState.invalid}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value={selectedTeamA}>{teams.find((team) => team.id === selectedTeamA)?.name}</SelectItem>
												<SelectItem value={selectedTeamB}>{teams.find((team) => team.id === selectedTeamB)?.name}</SelectItem>
											</SelectContent>
										</Select>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>

							<Controller
								name="tossDecision"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Toss Winner Chose To</FieldLabel>
										<Select name={field.name} value={field.value} onValueChange={field.onChange} items={TOSS_DECISION}>
											<SelectTrigger aria-invalid={fieldState.invalid}>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="BAT">Bat</SelectItem>
												<SelectItem value="BOWL">Bowl</SelectItem>
											</SelectContent>
										</Select>
										{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
									</Field>
								)}
							/>
						</>
					)}
				</form>
			</CardContent>

			<CardFooter className="justify-end gap-3">
				<Button type="button" variant="outline" onClick={() => navigate({ to: ".." })}>
					Cancel
				</Button>
				<Button type="submit" form={formId} disabled={!form.formState.isValid}>
					Start Match
				</Button>
			</CardFooter>
		</Card>
	);
}
