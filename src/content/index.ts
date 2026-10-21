import { capstone } from "./capstone";
import { gaps } from "./gaps";
import { resources } from "./resources";
import { tools } from "./tools";
import { weeks } from "./weeks";
import type { Content } from "@/lib/types";

export const content: Content = { resources, weeks, gaps, tools, capstone };
export { resources };
