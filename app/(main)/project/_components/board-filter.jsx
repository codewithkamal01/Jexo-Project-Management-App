"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const priorities = ["LOW", "MEDIUM", "HIGH", "URGENT"];

export default function BoardFilters({ issues = [], onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [selectedPriority, setSelectedPriority] = useState("");
  const prevFilteredRef = useRef();

  // Unique assignees (safe)
  const assignees = issues
    .map((issue) => issue.assignee)
    .filter(Boolean)
    .filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id),
    );

  useEffect(() => {
    const filteredIssues = issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedAssignees.length === 0 ||
          selectedAssignees.includes(issue.assignee?.id)) &&
        (selectedPriority === "" || issue.priority === selectedPriority),
    );

    const prev = prevFilteredRef.current;
    const isEqual =
      prev &&
      prev.length === filteredIssues.length &&
      prev.every((p, i) => p.id === filteredIssues[i].id);

    if (!isEqual) {
      prevFilteredRef.current = filteredIssues;
      onFilterChange(filteredIssues);
    }
  }, [searchTerm, selectedAssignees, selectedPriority, issues, onFilterChange]);

  const toggleAssignee = (assigneeId) => {
    setSelectedAssignees((prev) =>
      prev.includes(assigneeId)
        ? prev.filter((id) => id !== assigneeId)
        : [...prev, assigneeId],
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedAssignees([]);
    setSelectedPriority("");
  };

  const isFiltersApplied =
    searchTerm || selectedAssignees.length > 0 || selectedPriority;

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 mt-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        {/* Search */}
        <Input
          className="w-full lg:w-72 bg-slate-900"
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Assignees */}
        <div className="flex items-center gap-2 flex-wrap">
          {assignees.map((assignee, i) => {
            const selected = selectedAssignees.includes(assignee.id);

            return (
              <button
                type="button"
                key={assignee.id}
                className={`rounded-full transition ring-2 ${
                  selected ? "ring-blue-500 scale-105" : "ring-transparent"
                } ${i > 0 ? "-ml-2" : ""}`}
                style={{ zIndex: assignees.length - i }}
                onClick={() => toggleAssignee(assignee.id)}
              >
                <Avatar className="h-10 w-10 border border-slate-800">
                  <AvatarImage src={assignee.imageUrl} />
                  <AvatarFallback>{assignee.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </button>
            );
          })}
        </div>

        {/* Priority */}
        <Select value={selectedPriority} onValueChange={setSelectedPriority}>
          <SelectTrigger className="w-full lg:w-52 bg-slate-900">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>

          <SelectContent>
            {priorities.map((priority) => (
              <SelectItem key={priority} value={priority}>
                {priority}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Clear */}
        {isFiltersApplied && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="flex items-center"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
