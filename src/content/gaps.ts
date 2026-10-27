import type { Gap } from "@/lib/types";

const bufferNote =
  "These four weeks are spare time for catching up. They are shown by default because this course has no mentors and no supplied footage, and sound and effects have fewer ready-made exercises. Most first-time solo filmmakers need them.";

export const gaps: Gap[] = [
  {
    id: "indian-language-craft",
    scope: "global",
    ref: "",
    missing:
      "We could not find good filmmaking channels in Hindi, Tamil, Telugu, Malayalam, Marathi or Bengali.",
    attempted: [],
    note: "If you know a good one, please tell us through the Contact page. The closest we found is Kannada director Pawan Kumar's online course, which is shared on Facebook and Twitter rather than YouTube. Searching YouTube in your own language, or asking in Indian filmmaking groups on Facebook and WhatsApp, usually turns up more than a general web search.",
  },
  {
    id: "raw-footage-practice",
    scope: "global",
    ref: "",
    missing: "We could not find free, openly licensed raw dramatic footage to practice editing with.",
    attempted: [],
    note: "Use your own footage from weeks 7 and 8 instead.",
  },
  {
    id: "india-public-shooting-law",
    scope: "module",
    ref: "2",
    missing:
      "It is hard to find clear legal guidance on casually filming with a phone in public places in India. Only the rules for professional productions are written down.",
    attempted: [],
    note: "This site gives common-sense advice, not legal advice: avoid government and defense sites, and get verbal permission before filming identifiable private property.",
  },
  {
    id: "hindi-resolve-sound",
    scope: "module",
    ref: "5",
    missing: "We could not find a Hindi-language channel for DaVinci Resolve or sound design.",
    attempted: [],
    note: "If you know one, please tell us through the Contact page.",
  },
  {
    id: "hindi-blender-vfx",
    scope: "module",
    ref: "6",
    missing: "We could not find a Hindi-language channel for Blender or visual effects.",
    attempted: [],
    note: "If you know one, please tell us through the Contact page.",
  },
  {
    id: "extension-week-13",
    scope: "week",
    ref: "13",
    missing:
      "Week 13 has no videos or reading. It is a spare week for reshoots and pickups of anything you missed in weeks 7–8.",
    attempted: [],
    note: bufferNote,
  },
  {
    id: "extension-week-14",
    scope: "week",
    ref: "14",
    missing:
      "Week 14 has no videos or reading. It is a spare week to re-record or clean up your sound and double-check the license of every audio file before you release your film.",
    attempted: [],
    note: bufferNote,
  },
  {
    id: "extension-week-15",
    scope: "week",
    ref: "15",
    missing:
      "Week 15 has no videos or reading. It is a spare week to polish your color grade, starting from the free CGChannel/Q-DDL color presets.",
    attempted: [],
    note: bufferNote,
  },
  {
    id: "extension-week-16",
    scope: "week",
    ref: "16",
    missing:
      "Week 16 has no videos or reading. It is a spare week to show your film to others, act on their feedback, and send more festival submissions.",
    attempted: [],
    note: bufferNote,
  },
];
