import { createContext, use } from "react";
import { useQuery } from "@rocicorp/zero/react";

import type { Organization, Player, Team } from "@/lib/types";
import { queries } from "@/lib/zero/queries";

type OrgContextProps = {
  isAdmin: boolean;
  org: Organization;
  teams: Team[];
  players: Player[];
};

const OrgContext = createContext<OrgContextProps | null>(null);

export function OrgProvider({
  org,
  isAdmin,
  ...props
}: React.PropsWithChildren<{ org: Organization; isAdmin: boolean }>) {
  const [teams] = useQuery(queries.getOrgTeams({ orgId: org.id }));
  const [players] = useQuery(queries.getOrgPlayers({ orgId: org.id }));

  const contextValue: OrgContextProps = { isAdmin, org, teams, players };

  return <OrgContext.Provider value={contextValue} {...props} />;
}

export function useOrg() {
  const context = use(OrgContext);
  if (!context) {
    throw new Error("useOrg must be used within a OrgProvider.");
  }

  return context;
}
