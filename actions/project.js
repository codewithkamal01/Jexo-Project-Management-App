"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function createProject(data) {
  const { userId, orgId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!orgId) {
    throw new Error("No organization selected");
  }

  const client = await clerkClient();

  // Get organization membership list
  const { data: membershipList } =
    await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  // Check current user membership
  const userMembership = membershipList.find(
    (membership) => membership.publicUserData?.userId === userId,
  );

  // Only admins can create projects
  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization admins can create projects");
  }

  try {
    const project = await db.project.create({
      data: {
        name: data.name.trim(),
        key: data.key.trim().toUpperCase(),
        description: data.description?.trim() || null,
        organizationId: orgId,
      },
    });

    return project;
  } catch (error) {
    throw new Error("Error creating project: " + error.message);
  }
}

export async function getProjects(orgId) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const projects = await db.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" },
  });
  return projects;
}
