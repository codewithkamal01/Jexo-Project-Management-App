"use client";

import { updateSprintStatus } from "@/actions/sprints";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { format, formatDistanceToNow, isAfter, isBefore } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";

export default function SprintManager({
  sprint,
  setSprint,
  sprints,
  projectId,
}) {
  // local status removed; use `sprint.status` directly

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedSprintQuery = searchParams.get("sprint");
  const { fn: updateStatus, loading, error } = useFetch(updateSprintStatus);
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const now = new Date();

  const canStart =
    isBefore(now, endDate) &&
    isAfter(now, startDate) &&
    sprint.status === "PLANNED";
  const canEnd = sprint.status === "ACTIVE";

  const handleSprintChange = (value) => {
    const selectedSprint = sprints.find((s) => s.id === value);

    if (!selectedSprint) return;

    setSprint(selectedSprint);

    router.replace(`/project/${projectId}?sprint=${value}`);
  };

  const handleStatusChange = async (newStatus) => {
    const res = await updateStatus(sprint.id, newStatus);
    if (res?.success) {
      setSprint((prev) => ({ ...prev, status: res.sprint.status }));
    }
  };
  // removed effect that synced `updatedStatus` into local state

  const getStatusText = () => {
    if (sprint.status === "COMPLETED") {
      return "Sprint Ended";
    }
    if (sprint.status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    }
    if (sprint.status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }

    return null;
  };

  useEffect(() => {
    const sprintId = selectedSprintQuery;
    if (!sprintId) return;
    if (sprintId === sprint.id) return;
    const selectedSprint = sprints.find((s) => s.id === sprintId);

    if (!selectedSprint) return;
    setSprint((prev) =>
      prev?.id !== selectedSprint.id ? selectedSprint : prev,
    );

    // rely on parent `sprint` prop for status
  }, [selectedSprintQuery, sprints, sprint.id, setSprint]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-4 ">
        {/* Sprint Selector */}
        <div className="flex-1 bg-slate-950">
          <Select value={sprint.id} onValueChange={handleSprintChange}>
            <SelectTrigger className="bg-slate-950 border-slate-800 h-12 w-full">
              <SelectValue>{sprint?.name}</SelectValue>
            </SelectTrigger>

            <SelectContent
              className="w-[var(--radix-select-trigger-width)] bg-slate-950 border border-slate-800"
              position="popper"
            >
              {sprints.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  <div className="flex flex-col py-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.startDate), "MMM d, yyyy")} →{" "}
                      {format(new Date(item.endDate), "MMM d, yyyy")}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {canStart && (
            <Button
              onClick={() => handleStatusChange("ACTIVE")}
              disabled={loading}
              className="bg-green-700 hover:bg-green-800 text-white h-8 px-4"
            >
              Start Sprint
            </Button>
          )}

          {canEnd && (
            <Button
              onClick={() => handleStatusChange("COMPLETED")}
              disabled={loading}
              variant="destructive"
              className="h-8 px-4"
            >
              End Sprint
            </Button>
          )}
        </div>
      </div>

      {loading && <BarLoader width="100%" className="mt-2" color="#36d7b7" />}
      {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
      {getStatusText() && (
        <Badge className="mt-3 ml-1 self-start">{getStatusText()}</Badge>
      )}
    </>
  );
}
