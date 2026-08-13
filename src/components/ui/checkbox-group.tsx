import { useId } from "react";
import { CheckboxGroup as CheckboxGroupPrimitive } from "@base-ui/react/checkbox-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

function CheckboxGroup({ className, ...props }: CheckboxGroupPrimitive.Props) {
	return <CheckboxGroupPrimitive data-slot="checkbox-group" className={cn("group/checkbox-group grid", className)} {...props} />;
}

const checkboxItemVariants = cva(
	"group/checkbox-item flex w-full cursor-pointer flex-wrap items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors duration-100 hover:bg-muted",
	{
		variants: {
			variant: {
				default: "border-transparent",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

type CheckboxGroupItemProps = React.ComponentProps<typeof Checkbox> &
	VariantProps<typeof checkboxItemVariants> & {
		label: React.ReactNode;
		description?: React.ReactNode;
	};

function CheckboxGroupItem({ label, description, variant, className, children, ...props }: CheckboxGroupItemProps) {
	const id = useId();
	return (
		<label data-slot="checkbox-group-item" htmlFor={id} className={cn(checkboxItemVariants({ variant }), className)}>
			{children}
			<div className="flex flex-1 flex-col">
				<p className="line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium">{label}</p>
				<p className="line-clamp-2 text-left text-xs leading-normal font-normal text-muted-foreground">{description}</p>
			</div>
			<Checkbox id={id} className="" {...props} />
		</label>
	);
}

export { CheckboxGroup, CheckboxGroupItem };
