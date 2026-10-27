import { lazy } from "react";

/** The 404 route, lazy so its `Button` stays out of the entry graph (R4). Its own module keeps router.tsx lint-clean. */
export const NotFoundRoute = lazy(() => import("@/routes/NotFound").then((m) => ({ default: m.NotFound })));
