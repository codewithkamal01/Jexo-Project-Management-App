"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getOrganization(slug) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const client = await clerkClient();

  let user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  // Auto-create or sync user if missing
  if (!user) {
    const clerkUser = await client.users.getUser(userId);

    user = await db.user.upsert({
      where: {
        email: clerkUser.emailAddresses[0].emailAddress,
      },
      update: {
        clerkUserId: clerkUser.id,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
        imageUrl: clerkUser.imageUrl,
      },
      create: {
        clerkUserId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
        imageUrl: clerkUser.imageUrl,
      },
    });
  }

  // Get organization
  const organization = await client.organizations.getOrganization({
    slug,
  });

  if (!organization) {
    return null;
  }

  // Check membership
  const { data: memberships } =
    await client.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

  const userMembership = memberships.find(
    (member) => member.publicUserData?.userId === userId,
  );

  if (!userMembership) {
    return null;
  }

  return organization;
}


export async function getOrganizationUsers(orgId) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const client = await clerkClient();

  const organizationMemberships =
    await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  const userIds = organizationMemberships.data.map(
    (membership) => membership.publicUserData?.userId,
  );

  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: userIds,
      },
    },
  });

  return users;
}
