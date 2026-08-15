import { useId, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn, useServerFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { auth } from "@/lib/auth";
import { validateAuthMiddleware } from "@/lib/auth/validations";
import { createId, getErrorMessage } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_auth/new")({
	component: NewOrgRoute,
});

const organizationSchema = z.object({
	name: z.string().trim().min(3, "Name must be atleast 3 characters").max(50, "Name must be 50 characters or fewer."),
});

type OrganizationSchema = z.infer<typeof organizationSchema>;

const createOrganization = createServerFn({ method: "POST" })
	.middleware([validateAuthMiddleware])
	.validator(organizationSchema)
	.handler(async ({ data }) => {
		const organization = await auth.api.createOrganization({
			headers: getRequestHeaders(),
			body: { name: data.name, slug: createId() },
		});

		return { orgId: organization.id };
	});

function NewOrgRoute() {
	const formId = useId();
	const navigate = Route.useNavigate();
	const [isPending, startTransition] = useTransition();

	const createOrganizationFn = useServerFn(createOrganization);

	const form = useForm<OrganizationSchema>({
		resolver: zodResolver(organizationSchema),
		mode: "onSubmit",
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = (data: OrganizationSchema) => {
		startTransition(async () => {
			try {
				const { orgId } = await createOrganizationFn({ data });
				navigate({ to: "/$orgId/home", params: { orgId } });
			} catch (error) {
				toast.error(getErrorMessage(error, "Something went wrong, please try again"));
			}
		});
	};

	return (
		<main className="container mx-auto flex min-h-dvh items-center justify-center">
			<Card className="w-full max-w-sm md:max-w-md">
				<CardHeader>
					<CardTitle>Create Organization</CardTitle>
				</CardHeader>

				<CardContent>
					<form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="block">
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field data-invalid={fieldState.invalid}>
									<FieldLabel>Name</FieldLabel>
									<Input {...field} aria-invalid={fieldState.invalid} />
									{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
								</Field>
							)}
						/>
					</form>
				</CardContent>

				<CardFooter className="justify-end gap-2">
					<Button type="button" variant="outline" disabled={isPending} onClick={() => navigate({ to: ".." })}>
						Cancel
					</Button>
					<Button type="submit" form={formId} disabled={isPending || !form.formState.isValid}>
						Create
					</Button>
				</CardFooter>
			</Card>
		</main>
	);
}
