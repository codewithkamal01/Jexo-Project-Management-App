"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "@daypicker/react";
import { format, addDays } from "date-fns";
import { sprintSchema } from "@/app/lib/validators";
import useFetch from "@/hooks/use-fetch";
import { createSprint } from "@/actions/sprints";
import "@daypicker/react/style.css";
import { toast } from "sonner";

export default function SprintCreationForm({
  projectTitle,
  projectKey,
  projectId,
  sprintKey,
}) {
  const [showForm, setShowForm] = useState(false);

  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: addDays(new Date(), 14),
  });

  const router = useRouter();

  const { loading: createSprintLoading, fn: createSprintFn } =
    useFetch(createSprint);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sprintSchema),
    defaultValues: {
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    },
  });

  useEffect(() => {
    reset({
      name: `${projectKey}-${sprintKey}`,
      startDate: dateRange.from,
      endDate: dateRange.to,
    });
  }, [sprintKey, projectKey, reset]);

  const onSubmit = async (data) => {
    await createSprintFn(projectId, {
      ...data,
      startDate: dateRange.from,
      endDate: dateRange.to,
    });

    const newRange = {
      from: new Date(),
      to: addDays(new Date(), 14),
    };

    setDateRange(newRange);

    reset({
      name: "",
      startDate: newRange.from,
      endDate: newRange.to,
    });

    setShowForm(false);
    router.refresh();
    toast.success("Sprint created successfully");
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-5xl font-bold mb-8 gradient-title">
          {projectTitle}
        </h1>

        <Button
          className="mt-2"
          onClick={() => setShowForm(!showForm)}
          variant={!showForm ? "default" : "destructive"}
        >
          {!showForm ? "Create New Sprint" : "Cancel"}
        </Button>
      </div>

      {showForm && (
        <Card className="pt-4 mb-4">
          <CardContent>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex gap-4 items-end"
            >
              {/* Sprint Name */}
              <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Sprint Name
                </label>

                <Input
                  id="name"
                  {...register("name")}
                  className="bg-slate-950"
                />

                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Sprint Duration */}
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  Sprint Duration
                </label>

                <Controller
                  control={control}
                  name="startDate"
                  render={({ field }) => (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={`w-full justify-start text-left font-normal bg-slate-950 ${
                            !dateRange?.from ? "text-muted-foreground" : ""
                          }`}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />

                          {dateRange.from && dateRange.to ? (
                            `${format(
                              dateRange.from,
                              "LLL dd, y",
                            )} - ${format(dateRange.to, "LLL dd, y")}`
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-auto bg-slate-900"
                        align="start"
                      >
                        <DayPicker
                          mode="range"
                          selected={dateRange}
                          disabled={[{ before: new Date() }]}
                          classNames={{
                            chevron: "fill-blue-500",
                            range_start: "bg-blue-700",
                            range_end: "bg-blue-700",
                            range_middle: "bg-blue-400",
                            day_button: "border-none",
                            today: "border-2 border-blue-700",
                          }}
                          onSelect={(range) => {
                            if (range?.from && range?.to) {
                              setDateRange(range);

                              field.onChange(range.from);
                              setValue("endDate", range.to);
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                />

                {(errors.startDate || errors.endDate) && (
                  <p className="text-red-500 text-sm mt-1">
                    Invalid sprint date range
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" disabled={createSprintLoading}>
                {createSprintLoading ? "Creating..." : "Create Sprint"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
