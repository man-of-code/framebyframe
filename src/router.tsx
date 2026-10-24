import { lazy, Suspense, type LazyExoticComponent } from "react";
import { createBrowserRouter, Link, useOutletContext, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { parseWeekParam } from "@/lib/route-week";
import { TOTAL_WEEKS } from "@/lib/week";
import { Dashboard } from "@/routes/Dashboard";
import { Root, type ShellOutletContext } from "@/routes/Root";

const Landing = lazy(() => import("@/routes/Landing").then((m) => ({ default: m.Landing })));
const Plan = lazy(() => import("@/routes/Plan").then((m) => ({ default: m.Plan })));
const Week = lazy(() => import("@/routes/Week").then((m) => ({ default: m.Week })));
const Library = lazy(() => import("@/routes/Library").then((m) => ({ default: m.Library })));
const Capstone = lazy(() => import("@/routes/Capstone").then((m) => ({ default: m.Capstone })));
const Toolkit = lazy(() => import("@/routes/Toolkit").then((m) => ({ default: m.Toolkit })));
const About = lazy(() => import("@/routes/About").then((m) => ({ default: m.About })));

function RouteFallback() {
  return (
    <div className="route-fallback" aria-hidden="true">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-48" />
    </div>
  );
}

function Lazy({ page: Page }: { page: LazyExoticComponent<() => React.JSX.Element> }) {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Page />
    </Suspense>
  );
}

function Home() {
  const { progress } = useOutletContext<ShellOutletContext>();
  if (!progress.startDate) return <Lazy page={Landing} />;
  return <Dashboard />;
}

function WeekRoute() {
  const { n } = useParams();
  const week = parseWeekParam(n);
  if (week === null) {
    return (
      <article>
        <p className="eyebrow">Week</p>
        <h1>Week not found</h1>
        <p>Weeks run from 1 to {TOTAL_WEEKS}.</p>
        <Link className="text-link" to="/plan">
          Back to the plan
        </Link>
      </article>
    );
  }
  return <Lazy page={Week} />;
}

function NotFound() {
  return (
    <article>
      <p className="eyebrow">Missing</p>
      <h1>Page not found</h1>
      <Link className="text-link" to="/">
        Back to today
      </Link>
    </article>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "plan", element: <Lazy page={Plan} /> },
      { path: "week/:n", element: <WeekRoute /> },
      { path: "library", element: <Lazy page={Library} /> },
      { path: "capstone", element: <Lazy page={Capstone} /> },
      { path: "toolkit", element: <Lazy page={Toolkit} /> },
      { path: "about", element: <Lazy page={About} /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
