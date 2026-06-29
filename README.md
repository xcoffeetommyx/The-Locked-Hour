# The Locked Hour

A static, book-like digital edition of **The Locked Hour** by **xCoffeeTommyx**.

The reader is built with plain HTML, CSS, and JavaScript. It has no runtime dependencies, external fonts, image assets, analytics, or network requests.

## Read locally

Open `index.html` directly in a modern browser. A local server is optional:

```powershell
node tools/serve.mjs 8080
```

Then visit `http://localhost:8080`.

## Reader features

- 215 pages in manuscript order
- Normal, old-world, mixed, and after visual treatments
- Previous/next controls, arrow keys, Space, and touch swipe navigation
- Chapter contents panel
- Automatic progress saving with `localStorage`
- Resume and restart controls
- Three readable text sizes
- Responsive phone, tablet, and desktop layouts
- Reduced-motion support

Chapter 5 remains direction-based in the source manuscript. It is included verbatim as a source-text page; the reader does not invent or rewrite story prose.

## Manuscript workflow

`MANUSCRIPT.md` is the source of truth. `story.js` is generated data and should not be edited by hand.

After changing page content or structure in the manuscript, rebuild the data:

```powershell
node tools/build-story.mjs
```

The generator preserves chapter and page order, assigns stable IDs, and applies the theme progression defined by the story bible. Chapter 16 page 14 transitions to the `after` treatment.

## GitHub Pages

All publishable files live at the repository root, and `.nojekyll` prevents Jekyll processing.

1. Push the repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select the publishing branch (usually `main`) and the `/ (root)` folder.
5. Save. GitHub will provide the public URL after deployment.

No base-path configuration is needed because all asset links are relative.

## itch.io

Create the upload ZIP on Windows:

```powershell
powershell -ExecutionPolicy Bypass -File tools/package-itch.ps1
```

This creates `the-locked-hour-itch.zip` with `index.html` at the archive root.

On itch.io:

1. Create a new project and choose **HTML** as the project type.
2. Upload `the-locked-hour-itch.zip`.
3. Select **This file will be played in the browser**.
4. Use the fullscreen launch option, or an embedded viewport of at least `960 × 720`.
5. Enable mobile support.

## Project files

```text
index.html                 Semantic reader shell
styles.css                 Layout, responsive design, and world themes
script.js                  Reader state, navigation, rendering, and persistence
story.js                   Generated manuscript page data
MANUSCRIPT.md              Final source content and story bible
tools/build-story.mjs      Manuscript-to-page-data generator
tools/package-itch.ps1     itch.io ZIP packager
```
