import type { Gap } from "@/lib/types";

const bufferNote =
  "Shown by default because this curriculum has no mentors, no supplied footage, and sound and VFX have thin brochure-assignment coverage. A first-time solo filmmaker is more likely than not to need the buffer.";

export const gaps: Gap[] = [
  {
    id: "indian-language-craft",
    scope: "global",
    ref: "",
    missing:
      "Zero verified Hindi/Tamil/Telugu/Malayalam/Marathi/Bengali filmmaking-craft channels across three research passes.",
    attempted: [
      "direct-language search queries (batches C, E, and G; the query strings themselves are not in this repo)",
      "named-channel guesses (same passes; the names themselves are not in this repo)",
      "known-person leads (same passes)",
      "near-miss: Kannada director Pawan Kumar's online course, distributed via Facebook/Twitter, not YouTube, so it is not a channel link",
    ],
    note: "Mark this openly as help wanted. The query strings Batch G documented are not in this repo. Revisit via direct YouTube search or community sourcing (Indian filmmaking Facebook/WhatsApp groups) rather than general web search, which under-indexes regional-language content.",
  },
  {
    id: "raw-footage-practice",
    scope: "global",
    ref: "",
    missing: "No verified public-domain or Creative Commons raw dramatic footage for rough-cut practice.",
    attempted: [
      "This research pass did not verify a public-domain or Creative Commons raw dramatic footage source suitable for rough-cut practice.",
    ],
    note: "The fallback is the learner's own camera-test footage from week 7's lighting-setup exercise.",
  },
  {
    id: "india-public-shooting-law",
    scope: "module",
    ref: "2",
    missing:
      "Legal clarity on casual, no-crowd, no-equipment phone shooting in Indian public spaces is thin — only the formal commercial-production system is documented.",
    attempted: [
      "Film-making laws in India (iPleaders)",
      "Film Facilitation Office (FFO) step-by-step guide",
    ],
    note: "The site states practical norms, not verified law: avoid government/defence sites, get verbal consent for identifiable private property.",
  },
  {
    id: "hindi-resolve-sound",
    scope: "module",
    ref: "5",
    missing: "No Hindi-language Resolve or sound-design channel verified.",
    attempted: [],
    note: "The Module 5 gap note states this conclusion and does not list the queries used.",
  },
  {
    id: "hindi-blender-vfx",
    scope: "module",
    ref: "6",
    missing: "No Hindi-language Blender/VFX channel verified.",
    attempted: [],
    note: "The Module 6 gap note states this conclusion and does not list the queries used.",
  },
  {
    id: "extension-week-13",
    scope: "week",
    ref: "13",
    missing:
      "Week 13 has no Watch or Read tasks. Its buffer job is reshoots and pickups for anything missed in weeks 7–8.",
    attempted: [],
    note: bufferNote,
  },
  {
    id: "extension-week-14",
    scope: "week",
    ref: "14",
    missing:
      "Week 14 has no Watch or Read tasks. Its buffer job is a sound re-record and clean-up pass, including a re-check of every audio file's license before public release.",
    attempted: [],
    note: bufferNote,
  },
  {
    id: "extension-week-15",
    scope: "week",
    ref: "15",
    missing:
      "Week 15 has no Watch or Read tasks. Its buffer job is a color-grade polish pass using the CGChannel/Q-DDL CC BY LUT pack as a base.",
    attempted: [],
    note: bufferNote,
  },
  {
    id: "extension-week-16",
    scope: "week",
    ref: "16",
    missing:
      "Week 16 has no Watch or Read tasks. Its buffer job is a feedback screening, acting on that feedback, and additional festival submissions.",
    attempted: [],
    note: bufferNote,
  },
];
