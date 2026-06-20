"use client"
import { useState } from "react";
import SprintManager from "./sprint-manager";

export default function SprintBoard({ sprints, projectId, orgId }) {
  const [currentSprint, setCurrentSprint] = useState(
    sprints.find((spr) => spr.status === "ACTIVE") || sprints[0],
  );
  return (
    <div>
        {/* sprint manager */}
        <SprintManager
         sprint={currentSprint}
         setSprint={setCurrentSprint}
         sprints={sprints}
         projectId={projectId}
         />

        {/* Karban Board */}
    </div>
  )
}
