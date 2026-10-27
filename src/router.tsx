import { lazy, Suspense, type LazyExoticComponent } from "react";
import { createBrowserRouter, Link, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { parseWeekParam } from "@/lib/route-week";
import { TOTAL_WEEKS } from "@/lib/week";
import { Root } from "@/routes/Root";

const Home = lazy(() => import("@/routes/Dashboard").then((m) => ({ default: m.Home })));
const Plan = lazy(() => import("@/routes/Plan").then((m) => ({ default: m.Plan })));
const Week = lazy(() => import("@/routes/Week").then((m) => ({ default: m.Week })));
const Library = lazy(() => import("@/routes/Library").then((m) => ({ default: m.Library })));
const Capstone = lazy(() => import("@/routes/Capstone").then((m) => ({ default: m.Capstone })));
const Toolkit = lazy(() => import("@/routes/Toolkit").then((m) => ({ default: m.Toolkit })));
const About = lazy(() => import("@/routes/About").then((m) => ({ default: m.About })));
const Contact = lazy(() => import("@/routes/Contact").then((m) => ({ default: m.Contact })));
const Privacy = lazy(() => import("@/routes/Privacy").then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import("@/routes/Terms").then((m) => ({ default: m.Terms })));
const ThankYou = lazy(() => import("@/routes/ThankYou").then((m) => ({ default: m.ThankYou })));
const NotFound = lazy(() => import("@/routes/NotFound").then((m) => ({ default: m.NotFound })));

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="visually-hidden">Loading</span>
      {/* Shaped like the page it stands in for: a square header band, a title, lines, a pop button (radius-sm). */}
      <Skeleton className="route-fallback__band" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <Skeleton className="h-4 w-5/6 max-w-lg" />
      <Skeleton className="route-fallback__button" />
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Lazy page={Home} /> },
      { path: "plan", element: <Lazy page={Plan} /> },
      { path: "week/:n", element: <WeekRoute /> },
      { path: "library", element: <Lazy page={Library} /> },
      { path: "capstone", element: <Lazy page={Capstone} /> },
      { path: "toolkit", element: <Lazy page={Toolkit} /> },
      { path: "about", element: <Lazy page={About} /> },
      { path: "contact", element: <Lazy page={Contact} /> },
      { path: "privacy", element: <Lazy page={Privacy} /> },
      { path: "terms", element: <Lazy page={Terms} /> },
      { path: "thank-you", element: <Lazy page={ThankYou} /> },
      { path: "*", element: <Lazy page={NotFound} /> },
    ],
  },
]);
