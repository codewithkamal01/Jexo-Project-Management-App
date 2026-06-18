"use client";

import { OrganizationList, useOrganization } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Onboarding() {
  const { organization, isLoaded } = useOrganization();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && organization?.slug) {
      router.push(`/organization/${organization.slug}`);
    }
  }, [isLoaded, organization, router]);

  if (!isLoaded) return null;

  return (
    <div className="flex justify-center py-10">
      <OrganizationList
        hidePersonal
        afterCreateOrganizationUrl="/organization/:slug"
        afterSelectOrganizationUrl="/organization/:slug"
      />
    </div>
  );
}
