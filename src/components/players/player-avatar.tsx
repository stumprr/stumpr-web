import { UserIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type PlayerAvatarProps = React.ComponentProps<typeof Avatar> & {
  src?: string | null;
  alt?: string;
};

export function PlayerAvatar({ src, alt, ...props }: PlayerAvatarProps) {
  return (
    <Avatar {...props}>
      {src && <AvatarImage src={src} alt={alt} width={40} height={40} />}
      <AvatarFallback>
        <UserIcon className="size-1/2" />
      </AvatarFallback>
    </Avatar>
  );
}
