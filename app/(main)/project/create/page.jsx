"use client";

import OrgSwitcher from "@/components/org-switcher";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/app/lib/validators";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createProject } from "@/actions/project";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

export default function CreateProjectPage() {
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const isAdmin = isOrgLoaded && isUserLoaded && membership?.role === "org:admin";

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  const {
    loading,
    error,
    data: project,
    fn: createProjectFn,
  } = useFetch(createProject);

  const onSubmit = async (data) => {
    if (!isAdmin) {
      toast.error("Only organization admins can create projects");
      return;
    }

    await createProjectFn(data);
  };

  // derive `isAdmin` directly from organization membership

  useEffect(() => {
    if (project) {
      toast.success("Project created successfully");
      router.push(`/project/${project.id}`);
    }
  }, [project, router]);

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col gap-2 items-center">
          <span className="text-4xl gradient-title">
            Oops! Only Admins can create projects.
          </span>
          <OrgSwitcher />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <h1 className="gradient-title text-6xl text-center font-bold mb-8">
        Create New Project
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <div>
          <Input
            id="name"
            {...register("name")}
            className="bg-slate-950"
            placeholder="Project Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Input
            id="key"
            {...register("key")}
            className="bg-slate-950"
            placeholder="Project Key (Ex: JEXO)"
          />
          {errors.key && (
            <p className="text-red-500 text-sm mt-1">
              {errors.key.message}
            </p>
          )}
        </div>

        <div>
          <Textarea
            id="description"
            {...register("description")}
            className="bg-slate-950 h-28"
            placeholder="Project Description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {loading && (
          <BarLoader
            className="mb-4"
            width="100%"
            color="#36d7b7"
          />
        )}

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="bg-blue-500 text-white"
        >
          {loading ? "Creating..." : "Create Project"}
        </Button>

        {error && (
          <p className="text-red-500 mt-2">
            {error.message}
          </p>
        )}
      </form>
    </div>
  );
}