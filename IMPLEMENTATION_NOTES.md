# Implementation Notes

## Important

This is not a game. Build a virtual book.

## Content conversion

The manuscript has most chapters fully paginated. Chapter 1 and Chapter 5 contain locked manuscript directions. Convert those into polished page prose before implementation or create placeholder pages that clearly indicate they need final prose.

## Recommended story page fields

```js
{
  id: "ch02-p01",
  chapter: "Chapter 2",
  title: "Snow Without Roads",
  world: "old",
  text: `I woke up freezing.`
}
```

Optional extra fields:
- `className`
- `chapterNumber`
- `pageNumber`
- `isChapterStart`
- `accent`

## Deployment

GitHub Pages:
- Put final files at repo root.
- Enable Pages from main branch.

itch.io:
- Zip the final static files.
- Make sure `index.html` is at the ZIP root.
- Upload as an HTML project.
