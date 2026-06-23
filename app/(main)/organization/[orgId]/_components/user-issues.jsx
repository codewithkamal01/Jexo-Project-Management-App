import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUserIssues } from "@/actions/issues";
import IssueCard from "@/components/issue-card";

export default async function UserIssues({ userId }) {
  const issues = await getUserIssues(userId);

  if (!issues?.length) {
    return null;
  }

  const assignedIssues = issues.filter(
    (issue) => issue.assignee?.clerkUserId === userId,
  );

  const reportedIssues = issues.filter(
    (issue) => issue.reporter?.clerkUserId === userId,
  );

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold gradient-title">My Issues</h1>
      </div>
      <Tabs defaultValue="assigned" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="assigned">
            Assigned to me ({assignedIssues.length})
          </TabsTrigger>

          <TabsTrigger value="reported">
            Reported by me ({reportedIssues.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="assigned">
          <IssueGrid issues={assignedIssues} />
        </TabsContent>

        <TabsContent value="reported">
          <IssueGrid issues={reportedIssues} />
        </TabsContent>
      </Tabs>
    </section>
  );
}

function IssueGrid({ issues }) {
  if (!issues.length) {
    return (
      <div className="text-center py-10 text-muted-foreground border border-dashed rounded-lg">
        No issues found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} showStatus />
      ))}
    </div>
  );
}
