import { Suspense, lazy } from "react";
import {
  Outlet,
  createBrowserRouter,
  isRouteErrorResponse,
  useRouteError,
} from "react-router-dom";
import MainLayout from "../layouts/main-layout";
import Splash from "../components/loading/Splash";
import PageLoader from "../components/loading/PageLoader";
import Auth from "@/pages/auth";
import DashboardForStudentUser from "@/pages/student/DashboardForStudentUser";

const App = lazy(() => import("../App"));
const Dashboard = lazy(() => import("../pages/admin/dashboard"));

function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data}</p>
      </div>
    );
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Splash />}>
        <App />
      </Suspense>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        element: (
          <MainLayout>
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </MainLayout>
        ),
        errorElement: <ErrorBoundary />,
        children: [
          {
            index: true,
            element: <Dashboard />,
            errorElement: <ErrorBoundary />,
          },
          {
            path: "admin/sign-in",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Auth userType="admin" />
              </Suspense>
            ),
            errorElement: <ErrorBoundary />,
          },
          {
            path: "student/sign-in",
            element: (
              <Suspense fallback={<PageLoader />}>
                <Auth userType="students" />
              </Suspense>
            ),
            errorElement: <ErrorBoundary />,
          },
          {
            path: "student/dashboard",
            element: (
              <Suspense fallback={<PageLoader />}>
                <DashboardForStudentUser />
              </Suspense>
            ),
            errorElement: <ErrorBoundary />,
          },
        ],
      },
    ],
  },
]);

export default router;
