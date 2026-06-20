import { Suspense } from "react";
import { BarLoader } from "react-spinners";

export default async function ProjectLayout({ children }) {
  return (
    <div className="mx-auto">
      <Suspense fallback={<span>Loading projects...</span>}>
        {children}
      </Suspense>
    </div>
  );
}
