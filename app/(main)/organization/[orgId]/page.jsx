import { getOrganization } from "@/actions/organization";
import OrgSwitcher from "@/components/org-switcher";
import ProjectList from "./_components/project-list";

export default async function Organization({ params }) {
  const { orgId } = await params;
  const organization = await getOrganization(orgId);

  if (!organization) {
    return <div className="container mx-auto px-4">Organization not found</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start gap-4">
        <h1 className="text-5xl font-bold gradient-title pb-2">
          {organization.name}&rsquo;s Projects
        </h1>
        <OrgSwitcher />
      </div>
      <div className="mb-4">
        <ProjectList orgId={organization.id} />
      </div>
    </div>
  );
}
