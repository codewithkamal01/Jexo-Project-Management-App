"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createIssue(projectId, data) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found");
  }

  const lastIssue = await db.issue.findFirst({
    where: {
      projectId,
      status: data.status,
    },
    orderBy: {
      order: "desc",
    },
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0;

  const issue = await db.issue.create({
    data: {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      status: data.status,
      priority: data.priority,
      projectId,
      sprintId: data.sprintId || null,
      reporterId: user.id,
      assigneeId: data.assigneeId || null,
      order: newOrder,
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issue;
}

export async function getIssuesForSprint(sprintId) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  const issues = await db.issue.findMany({
    where: { sprintId: sprintId },
    orderBy: [{ status: "asc" }, { order: "asc" }],
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issues;
}

export async function updateIssueOrder(updatedIssues) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  if (!updatedIssues || !updatedIssues.length) {
    throw new Error("No issues provided");
  }

  // Verify all issues belong to current organization
  const issues = await db.issue.findMany({
    where: {
      id: {
        in: updatedIssues.map((issue) => issue.id),
      },
    },
    include: {
      project: true,
    },
  });

  const invalidIssue = issues.find(
    (issue) => issue.project.organizationId !== orgId,
  );

  if (invalidIssue) {
    throw new Error("Unauthorized issue update");
  }

  // Transaction for safe bulk update
  await db.$transaction(
    updatedIssues.map((issue) =>
      db.issue.update({
        where: {
          id: issue.id,
        },
        data: {
          status: issue.status,
          order: issue.order,
        },
      }),
    ),
  );

  return {
    success: true,
  };
}



