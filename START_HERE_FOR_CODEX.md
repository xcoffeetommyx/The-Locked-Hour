# START_HERE_FOR_CODEX.md

## Task

Build a polished static digital story reader for **The Locked Hour** using the included manuscript/reference file.

This is a traditional web novella / virtual book, not a game.

Use the included `MANUSCRIPT.md` as the source of truth for story content, creative direction, visual themes, and chapter/world assignments.

## Core product goal

Create a static website suitable for:
- GitHub Pages
- itch.io HTML upload

The final experience should feel like a professional digital novella:
- readable
- atmospheric
- mobile-first
- elegant
- restrained
- story-focused

Do not make it feel like a game HUD or prototype.

## UI / UX Quality Bar

Act as a senior product designer, UI artist, and frontend engineer. Improve requirements where appropriate. Prioritize hierarchy, readability, spacing, consistency, perceived quality, and emotional tone. Use an 8px spacing system and generous whitespace. Avoid clutter and developer-looking UI. Favor strong typography, restrained color, subtle depth, tasteful transitions, and small microinteractions. Determine the focal point and mood of each screen. Make the interface feel finished, intentional, and publishable.

## Required implementation

Build the project with:

```text
index.html
styles.css
script.js
story.js
README.md
```

Vanilla HTML/CSS/JS preferred.

No external libraries or frameworks unless absolutely necessary.

No external image assets. Use CSS-only textures and styling.

## Story data

Create `story.js` containing an array of page objects.

Suggested shape:

```js
const STORY_PAGES = [
  {
    chapter: "Chapter 1",
    title: "The Girl on the Walk Home",
    world: "normal",
    text: `Page text here...`
  }
];
```

Supported world values:

```js
"normal"
"old"
"mixed"
"after"
```

Use the chapter/world assignments in `MANUSCRIPT.md`.

The manuscript is currently complete enough to implement. Chapter 1 and Chapter 5 are partially described as manuscript direction rather than fully paginated prose. Convert those directions into polished page-style prose consistent with the surrounding chapters. Keep the locked story beats and dialogue intact.

## Reader features

Implement:
- Previous page button
- Next page button
- Keyboard navigation using left/right arrows
- Mobile-friendly tap targets
- Save/resume progress using `localStorage`
- Restart story button
- Chapter title display
- Current page / total page display
- Optional progress bar
- Smooth fade/page transition
- Reduced motion support using `prefers-reduced-motion`
- Responsive portrait-first layout
- Accessible readable text sizes

## Visual themes

### Normal world
Clean traditional book styling:
- warm off-white page
- dark readable text
- elegant serif body font
- restrained UI
- stable page numbers
- calm margins and spacing

### Old world
Aged, cold, old-world styling:
- weathered page color
- darker vignette edges
- subtle CSS noise/grain
- colder accents
- older serif/typewriter-like title accents
- no cheesy horror fonts

### Mixed world
Use for merging worlds:
- readable base layout
- old-world stains creep into normal style
- darker borders/edges
- subtle typography instability
- restrained red/brown accent for Thomas's arm-time motif
- visually contaminated but still readable

### After
Mostly clean again:
- normal-world style
- faint old-world scar/stain remains
- calm final tone

## Critical design constraints

Do:
- Keep the story text as the focus.
- Keep controls minimal.
- Make page transitions feel like a digital book.
- Ensure the site works on phone screens.
- Preserve line breaks and short paragraph rhythm from the manuscript.
- Preserve dialogue exactly where it is locked.
- Keep the world transitions subtle but noticeable.

Do not:
- Add choices.
- Add gameplay.
- Add inventory, stats, puzzles, timers, or combat.
- Add random jump scares.
- Use unreadable horror fonts.
- Use neon arcade/game styling.
- Over-animate the page.

## Suggested visual progression

- Chapters 1, 4, 5: normal
- Chapters 2, 3, 6, 7, 8, 9: old
- Chapters 10, 11, 12, 13, 14, 15: mixed
- Chapter 16: mixed at first, transitioning toward after by the final real-world page
- After: after

## Development notes

Make it easy for the user to replace or edit story pages later.

Avoid minifying.

Use clear comments and simple functions.

Recommended files:
- `index.html`: semantic page shell
- `styles.css`: all visual themes and responsive design
- `script.js`: reader state, rendering, navigation, localStorage
- `story.js`: story content
- `README.md`: how to deploy to GitHub Pages and itch.io

## Git workflow

After implementation:

```bash
git add .
git commit -m "Build Locked Hour digital story reader"
```

## Definition of done

- Opens locally by loading `index.html`
- Story pages render correctly
- Normal/old/mixed/after themes apply per page
- Progress saves and resumes
- Previous/Next controls work
- Keyboard controls work
- Mobile layout is polished
- No console errors
- README explains GitHub Pages and itch.io deployment
