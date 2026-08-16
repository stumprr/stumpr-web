import { useEffect, useId, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useZero } from "@rocicorp/zero/react";
import { Controller, useForm, type DefaultValues } from "react-hook-form";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/utils";
import { mutators } from "@/lib/zero/mutators";
import { useOrg } from "@/contexts/org-context";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppDrawer } from "@/components/app-drawer";

import { playerSchema, type PlayerSchema } from "./schema";

const playerRoles = ["Batsman", "Bowler", "All Ronder", "Wicket Keeper"] as const;

type PlayerFormProps = {
	trigger?: React.ReactElement<"button">;
	defaultValues?: DefaultValues<PlayerSchema>;
};

export function PlayerForm({ defaultValues, ...props }: PlayerFormProps) {
	const formId = useId();
	const [open, setOpen] = useState(false);

	const { org, players } = useOrg();
	const { mutate } = useZero();

	useEffect(() => {
		form.reset();
	}, [open]);

	const form = useForm<PlayerSchema>({
		resolver: zodResolver(playerSchema),
		defaultValues: {
			name: "",
			role: "",
			orgId: org.id,
			...defaultValues,
		},
	});

	async function onSubmit(data: PlayerSchema) {
		if (players.find((player) => player.name.toLowerCase() === data.name.toLowerCase())) {
			return form.setError("name", { message: "Player name already exisits" });
		}

		const result = mutate(mutators.createPlayer({ ...data }));

		try {
			const outcome = await result.server;

			if (outcome.type === "error") {
				return toast.error(getErrorMessage(outcome.error, "Could not create player. Please try again."));
			}

			toast.success("Player has been created");
			setOpen(false);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<AppDrawer
			open={open}
			formId={formId}
			onOpenChange={setOpen}
			header={{ title: "Create Player" }}
			footer={{ submitButton: { children: "Create Player", disabled: !form.formState.isValid } }}
			{...props}
		>
			<form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
				<FieldGroup>
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Player Name</FieldLabel>
								<Input {...field} aria-invalid={fieldState.invalid} />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						name="role"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldContent>
									<FieldLabel>Player Role</FieldLabel>
								</FieldContent>
								<Select name={field.name} value={field.value} onValueChange={field.onChange}>
									<SelectTrigger aria-invalid={fieldState.invalid}>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{playerRoles.map((role) => (
											<SelectItem key={role} value={role}>
												{role}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
				</FieldGroup>
			</form>
		</AppDrawer>
	);
}
