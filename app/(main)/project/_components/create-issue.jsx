"use client";

import { createIssue } from "@/actions/issues";
import { getOrganizationUsers } from "@/actions/organization";
import { issueSchema } from "@/app/lib/validators";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { toast } from "sonner";

export default function IssueCreationDrawer({
  isOpen,
  onClose,
  sprintId,
  status,
  projectId,
  onIssueCreated,
  orgId,
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(issueSchema),
    defaultValues: {
      title: "",
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    },
  });

  const {
    loading: createIssueLoading,
    fn: createIssueFn,
    error,
    data: newIssue,
  } = useFetch(createIssue);

  const {
    loading: usersLoading,
    fn: fetchUsers,
    data: users,
  } = useFetch(getOrganizationUsers);

  useEffect(() => {
    if (isOpen && orgId) {
      fetchUsers(orgId);
    }
  }, [isOpen, orgId]);

  useEffect(() => {
    if (!newIssue) return;

    reset({
      title: "",
      priority: "MEDIUM",
      description: "",
      assigneeId: "",
    });

    onClose();
    onIssueCreated();
    toast.success("Issue created successfully");
  }, [newIssue]);

  useEffect(() => {
    return () => {
      document.body.style.pointerEvents = "";
      document.body.style.overflow = "";
    };
  }, []);

  const handleClose = () => {
    document.body.style.pointerEvents = "";
    document.body.style.overflow = "";
    onClose();
  };

  const onSubmit = async (data) => {
    await createIssueFn(projectId, {
      ...data,
      status,
      sprintId,
    });
  };

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DrawerContent className="h-[96vh] max-w-6xl mx-auto flex flex-col">
        {/* Header */}
        <DrawerHeader className="border-b border-slate-800 px-6 py-4 shrink-0">
          <DrawerTitle className="text-xl font-semibold">
            Create New Issue
          </DrawerTitle>
        </DrawerHeader>

        {usersLoading && <BarLoader width={"100%"} color="#36d7b7" />}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>

              <Input
                id="title"
                {...register("title")}
                placeholder="What needs to be done?"
                className="h-11 bg-slate-950"
              />

              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            {/* Assignee + Priority */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assignee */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Assignee</label>

                <Controller
                  name="assigneeId"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 bg-slate-950">
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>

                      <SelectContent
                        position="popper"
                        sideOffset={6}
                        className="bg-slate-950 border border-slate-800"
                      >
                        {!users || users.length === 0 ? (
                          <div className="px-2 py-1.5 text-sm text-slate-400">
                            No assignees available
                          </div>
                        ) : (
                          users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.assigneeId && (
                  <p className="text-red-500 text-sm">
                    {errors.assigneeId.message}
                  </p>
                )}
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>

                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || "MEDIUM"}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="h-11 bg-slate-950">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>

                      <SelectContent
                        position="popper"
                        sideOffset={6}
                        className="bg-slate-950 border border-slate-800"
                      >
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="URGENT">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.priority && (
                  <p className="text-red-500 text-sm">
                    {errors.priority.message}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>

              <div
                data-color-mode="dark"
                className="rounded-lg overflow-hidden border border-slate-800"
              >
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <MDEditor
                      value={field.value}
                      onChange={field.onChange}
                      height={280}
                    />
                  )}
                />
              </div>

              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}
            </div>

            {error && <p className="text-red-500 text-sm">{error.message}</p>}
          </div>

          {/* Fixed Footer */}
          <div className="border-t border-slate-800 px-6 py-4 flex justify-end gap-3 shrink-0 bg-slate-950">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={createIssueLoading}
              className="px-6"
            >
              {createIssueLoading ? "Creating..." : "Create Issue"}
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
