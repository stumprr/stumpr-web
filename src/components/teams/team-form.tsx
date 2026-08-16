import { useEffect, useId, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useZero } from "@rocicorp/zero/react";
import { Controller, useForm, type DefaultValues } from "react-hook-form";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/utils";
import { mutators } from "@/lib/zero/mutators";
import { useOrg } from "@/contexts/org-context";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AppDrawer } from "@/components/app-drawer";

import { teamSchema, type TeamSchema } from "./schema";

type TeamFormProps = {
	trigger?: React.ReactElement<"button">;
	defaultValues?: DefaultValues<TeamSchema>;
};

export function TeamForm({ defaultValues, ...props }: TeamFormProps) {
	const formId = useId();
	const [open, setOpen] = useState(false);

	const { org, teams } = useOrg();
	const { mutate } = useZero();

	useEffect(() => {
		form.reset();
	}, [open]);

	const form = useForm<TeamSchema>({
		resolver: zodResolver(teamSchema),
		defaultValues: {
			name: "",
			orgId: org.id,
			...defaultValues,
		},
	});

	async function onSubmit(data: TeamSchema) {
		if (teams.find((team) => team.slug.toLowerCase() === data.slug.toLowerCase())) {
			return form.setError("slug", { message: "Team short name already exisits" });
		}

		const result = mutate(mutators.createTeam({ ...data }));

		try {
			const outcome = await result.server;

			if (outcome.type === "error") {
				return toast.error(getErrorMessage(outcome.error.message, "Could not create team. Please try again."));
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
			header={{ title: "Create Team" }}
			footer={{ submitButton: { children: "Create Team", disabled: !form.formState.isValid } }}
			{...props}
		>
			<form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
				<FieldGroup>
					<Controller
						name="name"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Name</FieldLabel>
								<Input {...field} maxLength={30} autoCapitalize="words" aria-invalid={fieldState.invalid} />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Controller
						name="slug"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Short Name</FieldLabel>
								<Input {...field} maxLength={4} autoCapitalize="characters" className="uppercase" aria-invalid={fieldState.invalid} />
								{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>
				</FieldGroup>
			</form>
		</AppDrawer>
	);
}
