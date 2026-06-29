import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const manuscript = readFileSync(join(root, "MANUSCRIPT.md"), "utf8").replace(/\r\n/g, "\n");
const storyStart = manuscript.indexOf("# Chapter 1 ");

if (storyStart === -1) {
  throw new Error("Could not find Chapter 1 in MANUSCRIPT.md.");
}

const storySource = manuscript.slice(storyStart).trim();
const chapterMatches = [...storySource.matchAll(/^# (Chapter (\d+) — (.+)|After)$/gm)];
const pages = [];

function normalizeWorld(rawWorld, chapterNumber, pageNumber, isAfter) {
  if (isAfter) return "after";
  if (chapterNumber === 16 && pageNumber === 14) return "after";
  if (rawWorld.includes("mixed") || rawWorld.includes("→")) return "mixed";
  return rawWorld.trim().toLowerCase();
}

for (let chapterIndex = 0; chapterIndex < chapterMatches.length; chapterIndex += 1) {
  const chapterMatch = chapterMatches[chapterIndex];
  const nextChapter = chapterMatches[chapterIndex + 1];
  const chapterBlock = storySource
    .slice(chapterMatch.index, nextChapter ? nextChapter.index : storySource.length)
    .trim();

  const isAfter = chapterMatch[1] === "After";
  const chapterNumber = isAfter ? 17 : Number(chapterMatch[2]);
  const chapter = isAfter ? "After" : `Chapter ${chapterNumber}`;
  const title = isAfter ? "After" : chapterMatch[3].trim();
  const rawWorld = chapterBlock.match(/^\*\*World:\*\*\s*(.+)$/m)?.[1]?.trim() ?? "normal";
  const sectionMatches = [...chapterBlock.matchAll(/^## (Page (\d+)|Manuscript direction)$/gm)];

  for (let sectionIndex = 0; sectionIndex < sectionMatches.length; sectionIndex += 1) {
    const sectionMatch = sectionMatches[sectionIndex];
    const nextSection = sectionMatches[sectionIndex + 1];
    const sectionBody = chapterBlock
      .slice(
        sectionMatch.index + sectionMatch[0].length,
        nextSection ? nextSection.index : chapterBlock.length,
      )
      .replace(/\n---\s*$/, "")
      .trim();
    const isDirection = sectionMatch[1] === "Manuscript direction";
    const pageNumber = isDirection ? 1 : Number(sectionMatch[2]);
    const world = normalizeWorld(rawWorld, chapterNumber, pageNumber, isAfter);

    pages.push({
      id: isAfter
        ? `after-p${String(pageNumber).padStart(2, "0")}`
        : `ch${String(chapterNumber).padStart(2, "0")}-p${String(pageNumber).padStart(2, "0")}`,
      chapter,
      chapterNumber,
      title,
      world,
      pageNumber,
      isChapterStart: pageNumber === 1,
      type: isDirection ? "source-note" : "prose",
      text: sectionBody,
    });
  }
}

const output = `// Generated verbatim from MANUSCRIPT.md by tools/build-story.mjs.
// Edit the manuscript, then run: node tools/build-story.mjs
// Do not edit story prose in this file by hand.

const STORY_META = Object.freeze({
  title: "The Locked Hour",
  author: "xCoffeeTommyx",
  pageCount: ${pages.length},
});

const STORY_PAGES = Object.freeze(${JSON.stringify(pages, null, 2)});
`;

writeFileSync(join(root, "story.js"), output, "utf8");
console.log(`Generated story.js with ${pages.length} pages.`);
