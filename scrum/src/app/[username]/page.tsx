import React, { Suspense } from "react";
const UserProjects = React.lazy(() => import("@/pages/UserProjects/UserProjects"));
const Loader = React.lazy(() => import("@/widgets/Loader/Loader"));

export default function MainPage() {
  return (
    <Suspense fallback={<Loader />}>
      <UserProjects />
    </Suspense>
  );
}
