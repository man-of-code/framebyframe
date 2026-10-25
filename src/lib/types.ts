export type Resource = {
  id: string;
  title: string;
  url: string;
  type:
    | "youtube"
    | "repo"
    | "subreddit"
    | "article"
    | "course"
    | "book"
    | "tool"
    | "short-film"
    | "podcast"
    | "forum"
    | "template"
    | "festival"
    | "community"
    | "service"
    | "platform"
    | "grant"
    | "docs"
    | "spec"
    | "aggregator"
    | "reading";
  topics: string[];
  weeks: number[];
  level: "beginner" | "intermediate" | "advanced";
  cost: "free" | "freemium" | "paid";
  language: string;
  why: string;
  verified: string;
  grayArea?: boolean;
  benchmarkOnly?: boolean;
  experimental?: boolean;
  emailGated?: boolean;
  licenseNote?: string;
};

export type Task = {
  id: string;
  kind: "watch" | "read" | "do";
  text: string;
  resourceIds: string[];
  minutes: number;
  core: boolean;
};

export type Gap = {
  id: string;
  scope: "week" | "module" | "global";
  ref: string;
  missing: string;
  attempted: string[];
  note: string;
};

export type Week = {
  n: number;
  module: number;
  title: string;
  topics: string[];
  tasks: Task[];
  assignment: {
    id: string;
    brochureNo?: number;
    text: string;
    checks: string[];
  };
  capstoneStage?: string;
  extension?: boolean;
  community: string;
  communityCaveat?: string;
  heavy?: boolean;
  gapIds?: string[];
};

export type Progress = {
  version: 1;
  done: Record<string, boolean>;
  notes: Record<string, string>;
  capstone: Record<string, "todo" | "doing" | "done">;
  startDate?: string;
  weekOverride?: number;
  theme?: "dark" | "light" | "system";
  ceremonySeen?: boolean;
};

export type Tool = {
  id: string;
  name: string;
  purpose: string;
  license: string;
  url: string;
  firstWeek: number;
  experimental?: boolean;
  limitations?: string[];
};

export type CapstoneStage = {
  id: string;
  label: string;
  order: number;
  weeks: number[];
  criteria: string[];
};

export type Content = {
  resources: Resource[];
  weeks: Week[];
  gaps: Gap[];
  tools: Tool[];
  capstone: CapstoneStage[];
};
