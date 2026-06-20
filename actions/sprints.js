"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function createSprint(projectId, data) {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  if (!projectId) {
    throw new Error("Project ID is required");
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found");
  }

  const sprint = await db.sprint.create({
    data: {
      name: data.name.trim(),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      status: "PLANNED",
      projectId,
    },
  });

  return sprint;
}

export async function updateSprintStatus(sprintId, newStatus) {
  const { userId, orgId, orgRole } = await auth();

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    const sprint = await db.sprint.findUnique({
      where: {
        id: sprintId,
      },
      include: {
        project: true,
      },
    });

    if (!sprint) {
      throw new Error("Sprint not found");
    }

    if (sprint.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    if (orgRole !== "org:admin") {
      throw new Error("Only admins can make this change");
    }

    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    // Sprint can only be activated within its date range
    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Cannot start sprint outside of its date range");
    }

    // Sprint can only be completed if currently active
    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Can only complete an active sprint");
    }

    const updatedSprint = await db.sprint.update({
      where: {
        id: sprintId,
      },
      data: {
        status: newStatus,
      },
    });

    return {
      success: true,
      sprint: updatedSprint,
    };
  } catch (error) {
    throw new Error(error.message);
  }
}
