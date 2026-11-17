import { cn, type ClassValue } from "cnfast";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

type AppDrawerProps = React.ComponentProps<typeof Drawer> & {
  formId?: string;
  className?: ClassValue;
  children?: React.ReactNode;
  trigger?: React.ReactElement<"button">;
  header?: {
    title?: string;
    desciption?: string;
    className?: ClassValue;
  } | null;
  footer?: {
    className?: ClassValue;
    submitButton?: React.ComponentProps<typeof Button> | null;
    cancelButton?: React.ComponentProps<typeof Button> | null;
  } | null;
};

export function AppDrawer({
  header = {},
  footer = {},
  trigger,
  formId,
  className,
  children,
  ...props
}: AppDrawerProps) {
  const isMobile = useIsMobile();
  const swipeDirection = isMobile ? "down" : "right";

  return (
    <Drawer showSwipeHandle={isMobile} swipeDirection={swipeDirection} {...props}>
      {trigger && <DrawerTrigger render={trigger} />}
      <DrawerContent>
        {header !== null && (
          <DrawerHeader className={cn("pt-2 md:border-b md:pt-4 md:pb-4", header.className)}>
            {header.title && <DrawerTitle>{header.title}</DrawerTitle>}
            {header.desciption && <DrawerDescription>{header.desciption}</DrawerDescription>}
          </DrawerHeader>
        )}
        <div
          className={cn("flex w-full scroll-fade-y flex-col gap-3 overflow-auto p-4", className)}
        >
          {children}
        </div>
        {footer !== null && (
          <DrawerFooter className={cn("mt-0 grid grid-cols-2", footer.className)}>
            {footer.cancelButton !== null && (
              <DrawerClose
                render={(props) => (
                  <Button type="button" variant="outline" {...props} {...footer.cancelButton}>
                    {footer.cancelButton?.children ?? "Cancel"}
                  </Button>
                )}
              />
            )}
            {footer.submitButton !== null && (
              <Button type="submit" variant="default" form={formId} {...footer.submitButton}>
                {footer.submitButton?.children ?? "Submit"}
              </Button>
            )}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
