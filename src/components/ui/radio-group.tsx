import { useId } from "react";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Radio } from "@/components/ui/radio";

function RadioGroup({
  side = "left",
  className,
  ...props
}: RadioGroupPrimitive.Props & { side?: "left" | "right" }) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      data-side={side}
      className={cn("group/radio-group grid", className)}
      {...props}
    />
  );
}

const radioItemVariants = cva(
  "group/radio-item flex w-full cursor-pointer flex-wrap items-center gap-2.5 rounded-md border px-3 py-2 text-sm transition-colors duration-100 hover:bg-muted",
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

type RadioGroupItemProps = React.ComponentProps<typeof Radio> &
  VariantProps<typeof radioItemVariants> & {
    label: React.ReactNode;
    description?: React.ReactNode;
  };

function RadioGroupItem({
  label,
  description,
  variant,
  className,
  children,
  ...props
}: RadioGroupItemProps) {
  const id = useId();
  return (
    <label
      data-slot="radio-group-item"
      htmlFor={id}
      className={cn(radioItemVariants({ variant }), className)}
    >
      <Radio id={id} className="group-data-[side=right]/radio-group:order-last" {...props} />
      {children}
      <div className="flex flex-1 flex-col">
        <p className="line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium">
          {label}
        </p>
        <p className="line-clamp-2 text-left text-xs leading-normal font-normal text-muted-foreground">
          {description}
        </p>
      </div>
    </label>
  );
}

export { RadioGroup, RadioGroupItem };
