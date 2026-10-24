import { content } from "@/content";
import { validateContent } from "@/lib/schema";

const issues = validateContent(content);

if (issues.length > 0) {
  for (const issue of issues) {
    console.error(`${issue.kind} · ${issue.where} · ${issue.message}`);
  }
  process.exit(1);
}

console.log(`resources: ${content.resources.length}`);
console.log(`weeks: ${content.weeks.length}`);
console.log(`gaps: ${content.gaps.length}`);
console.log(`tools: ${content.tools.length}`);
console.log(`stages: ${content.capstone.length}`);
