import React from "react";
const ProjectPage = React.lazy(() => import("@/pages/ProjectPage/ProjectPage"));
// import ProjectPage from "@/pages/ProjectPage/ProjectPage";

export default function ProjectId() {
  return (
    <ProjectPage />
  )
}
