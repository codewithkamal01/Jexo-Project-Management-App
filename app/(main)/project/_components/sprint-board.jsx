"use client";

import { useCallback, useEffect, useState } from "react";
import SprintManager from "./sprint-manager";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import statuses from "@/data/status";
import { Plus } from "lucide-react";
import IssueCreationDrawer from "./create-issue";
import useFetch from "@/hooks/use-fetch";
import { getIssuesForSprint, updateIssueOrder } from "@/actions/issues";
import { BarLoader } from "react-spinners";
import IssueCard from "@/components/issue-card";
import { toast } from "sonner";
import BoardFilters from "./board-filter";

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export default function SprintBoard({ sprints, projectId, orgId }) {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints?.[0] || null,
  );

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [filteredIssues, setFilteredIssues] = useState([]);

  const {
    loading: issuesLoading,
    error: issuesError,
    fn: fetchIssues,
    data: issues,
    setData: setIssues,
  } = useFetch(getIssuesForSprint);

  const { fn: updateIssueOrderFn } = useFetch(updateIssueOrder);

  useEffect(() => {
    if (!currentSprint?.id) return;

    let mounted = true;

    (async () => {
      const res = await fetchIssues(currentSprint.id);
      if (!mounted) return;
      setFilteredIssues(res || []);
    })();

    return () => {
      mounted = false;
    };
  }, [currentSprint?.id, fetchIssues]);

  const handleAddIssue = (status) => {
    setSelectedStatus(status);
    setIsDrawerOpen(true);
  };

  const handleIssueCreated = async () => {
    const freshIssues = await fetchIssues(currentSprint.id);
    setFilteredIssues(freshIssues);
  };

  const handleFilterChange = useCallback((newFilteredIssues) => {
    setFilteredIssues((prev) => {
      if (
        prev &&
        prev.length === newFilteredIssues.length &&
        prev.every((p, i) => p.id === newFilteredIssues[i].id)
      ) {
        return prev;
      }

      return newFilteredIssues;
    });
  }, []);

  const onDragEnd = async (result) => {
    if (currentSprint.status === "PLANNED") {
      toast.warning("Start the sprint to update board");
      return;
    }

    if (currentSprint.status === "COMPLETED") {
      toast.warning("Cannot update board after sprint end");
      return;
    }

    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newOrderedData = [...filteredIssues];

    let sourceList = newOrderedData.filter(
      (issue) => issue.status === source.droppableId,
    );

    let destinationList = newOrderedData.filter(
      (issue) => issue.status === destination.droppableId,
    );

    if (source.droppableId === destination.droppableId) {
      sourceList = reorder(sourceList, source.index, destination.index);
      sourceList.forEach((card, i) => {
        card.order = i;
      });
    } else {
      const [movedCard] = sourceList.splice(source.index, 1);
      movedCard.status = destination.droppableId;
      destinationList.splice(destination.index, 0, movedCard);
      sourceList.forEach((card, i) => {
        card.order = i;
      });
      destinationList.forEach((card, i) => {
        card.order = i;
      });
    }

    const updatedIssues = [
      ...sourceList,
      ...(source.droppableId === destination.droppableId
        ? []
        : destinationList),
    ];

    const untouchedIssues = newOrderedData.filter(
      (issue) =>
        issue.status !== source.droppableId &&
        issue.status !== destination.droppableId,
    );

    const sortedIssues = [...untouchedIssues, ...updatedIssues].sort(
      (a, b) => a.order - b.order,
    );

    setIssues(sortedIssues);
    setFilteredIssues(sortedIssues);

    await updateIssueOrderFn(sortedIssues);
  };

  if (!currentSprint) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        No sprints available. Create a sprint to start.
      </div>
    );
  }

  if (issuesError) {
    return (
      <div className="text-center py-10 text-red-500">Error loading issues</div>
    );
  }

  return (
    <div className="pb-10">
      {/* Sprint Manager */}
      <SprintManager
        sprint={currentSprint}
        setSprint={setCurrentSprint}
        sprints={sprints}
        projectId={projectId}
      />

      <BoardFilters issues={issues || []} onFilterChange={handleFilterChange} />

      {issuesLoading && !issues && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 bg-slate-900 p-4 rounded-lg">
          {statuses.map((column) => (
            <Droppable key={column.key} droppableId={column.key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="space-y-3 min-h-[400px] rounded-lg bg-slate-950 p-3"
                >
                  <h3 className="font-semibold mb-2 text-center">
                    {column.name}
                  </h3>

                  {/* Issues */}
                  {filteredIssues
                    ?.filter((issue) => issue.status === column.key)
                    .map((issue, index) => (
                      <Draggable
                        key={issue.id}
                        draggableId={issue.id}
                        index={index}
                        isDragDisabled={issuesLoading}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <IssueCard
                              issue={issue}
                              onDelete={(deletedId) => {
                                setIssues((prev) =>
                                  prev.filter((i) => i.id !== deletedId),
                                );
                                setFilteredIssues((prev) =>
                                  prev.filter((i) => i.id !== deletedId),
                                );
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}

                  {column.key === "TODO" &&
                    currentSprint.status !== "COMPLETED" && (
                      <Button
                        variant="ghost"
                        className="w-full"
                        onClick={() => handleAddIssue(column.key)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Create Issue
                      </Button>
                    )}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* Issue Drawer */}
      <IssueCreationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sprintId={currentSprint.id}
        status={selectedStatus}
        projectId={projectId}
        onIssueCreated={handleIssueCreated}
        orgId={orgId}
      />
    </div>
  );
}
