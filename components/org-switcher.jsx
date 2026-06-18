"use client";

import { usePathname } from "next/navigation";
import { OrganizationSwitcher, useOrganization, useUser } from "@clerk/nextjs";

export default function OrgSwitcher() {
  const pathname = usePathname();

  const { isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();

  if (pathname === "/") return null;

  if (!isOrgLoaded || !isUserLoaded) return null;

  return (
    <div className="flex justify-end mt-1">
      <OrganizationSwitcher
        hidePersonal
        createOrganizationMode={
          pathname === "/onboarding" ? "navigation" : "modal"
        }
        afterCreateOrganizationUrl="/organization/:slug"
        afterSelectOrganizationUrl="/organization/:slug"
        createOrganizationUrl="/onboarding"
        appearance={{
          elements: {
            organizationSwitcherTrigger:
              "border border-gray-700 bg-gray-900 rounded-lg px-5 py-2 hover:bg-gray-800 transition-colors",
            organizationSwitcherTriggerIcon: "text-gray-300",
          },
        }}
      />
    </div>
  );
}
