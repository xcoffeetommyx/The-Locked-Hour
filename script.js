(() => {
  "use strict";

  const STORAGE_KEY = "the-locked-hour-reader-v1";
  const VALID_FONT_SIZES = new Set(["small", "medium", "large"]);
  const state = {
    pageIndex: 0,
    fontSize: "medium",
    hasStarted: false,
    isTurning: false,
  };

  const elements = {
    body: document.body,
    reader: document.querySelector("#reader"),
    cover: document.querySelector("#cover"),
    startButton: document.querySelector("#start-button"),
    startLabel: document.querySelector("#start-label"),
    bookPage: document.querySelector("#book-page"),
    pageContent: document.querySelector("#page-content"),
    chapterLabel: document.querySelector("#chapter-label"),
    pageTitle: document.querySelector("#page-title"),
    headerChapter: document.querySelector("#header-chapter"),
    headerProgress: document.querySelector("#header-progress"),
    progressFill: document.querySelector("#progress-fill"),
    pageStatus: document.querySelector("#page-status"),
    folioChapter: document.querySelector("#folio-chapter"),
    folioNumber: document.querySelector("#folio-number"),
    previousButton: document.querySelector("#previous-button"),
    nextButton: document.querySelector("#next-button"),
    nextLabel: document.querySelector("#next-label"),
    chapterButton: document.querySelector("#chapter-button"),
    settingsButton: document.querySelector("#settings-button"),
    contentsDialog: document.querySelector("#contents-dialog"),
    settingsDialog: document.querySelector("#settings-dialog"),
    chapterList: document.querySelector("#chapter-list"),
    restartButton: document.querySelector("#restart-button"),
    toast: document.querySelector("#toast"),
  };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved) return;

      if (Number.isInteger(saved.pageIndex)) {
        state.pageIndex = Math.max(0, Math.min(saved.pageIndex, STORY_PAGES.length - 1));
      }
      if (VALID_FONT_SIZES.has(saved.fontSize)) state.fontSize = saved.fontSize;
      state.hasStarted = Boolean(saved.hasStarted);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  function saveState() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        pageIndex: state.pageIndex,
        fontSize: state.fontSize,
        hasStarted: state.hasStarted,
      }),
    );
  }

  function escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function inlineMarkdown(value) {
    return escapeHtml(value)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>");
  }

  function renderMarkdown(markdown) {
    const blocks = markdown.trim().split(/\n{2,}/);

    return blocks
      .map((block) => {
        const lines = block.split("\n");

        if (lines.every((line) => line.startsWith(">"))) {
          const quoteLines = lines.map((line) => line.replace(/^>\s?/, ""));
          return `<blockquote>${quoteLines
            .map((line) => `<p>${inlineMarkdown(line)}</p>`)
            .join("")}</blockquote>`;
        }

        if (lines.every((line) => /^-\s/.test(line))) {
          return `<ul>${lines
            .map((line) => `<li>${inlineMarkdown(line.replace(/^-\s/, ""))}</li>`)
            .join("")}</ul>`;
        }

        if (lines[0]?.startsWith("### ")) {
          return `<h2>${inlineMarkdown(lines[0].slice(4))}</h2>`;
        }

        return `<p>${lines.map(inlineMarkdown).join("<br>")}</p>`;
      })
      .join("");
  }

  function chapterLabelFor(page) {
    if (page.chapter === "After") return "After";
    return page.type === "source-note" ? `${page.chapter} · Source text` : page.chapter;
  }

  function renderPage({ focus = false } = {}) {
    const page = STORY_PAGES[state.pageIndex];
    const progress = ((state.pageIndex + 1) / STORY_PAGES.length) * 100;

    elements.body.classList.remove("theme-normal", "theme-old", "theme-mixed", "theme-after");
    elements.body.classList.add(`theme-${page.world}`);
    elements.body.dataset.fontSize = state.fontSize;
    elements.bookPage.dataset.pageType = page.type;
    elements.chapterLabel.textContent = chapterLabelFor(page);
    elements.pageTitle.textContent = page.title;
    elements.headerChapter.textContent = page.chapter === "After" ? "After" : `${page.chapter} — ${page.title}`;
    elements.pageContent.innerHTML = renderMarkdown(page.text);
    elements.headerProgress.textContent = `${state.pageIndex + 1} of ${STORY_PAGES.length}`;
    elements.pageStatus.textContent = `Page ${state.pageIndex + 1} of ${STORY_PAGES.length}`;
    elements.folioChapter.textContent = page.chapter;
    elements.folioNumber.textContent = String(state.pageIndex + 1);
    elements.progressFill.style.width = `${progress}%`;
    elements.previousButton.disabled = state.pageIndex === 0;
    elements.nextButton.disabled = state.pageIndex === STORY_PAGES.length - 1;
    elements.nextLabel.textContent =
      state.pageIndex === STORY_PAGES.length - 1 ? "Finished" : "Next";

    updateChapterList();
    updateFontButtons();
    document.title = `${page.chapter}: ${page.title} — ${STORY_META.title}`;
    window.scrollTo({ top: 0, behavior: "auto" });

    if (focus) elements.pageContent.focus({ preventScroll: true });
  }

  function turnTo(nextIndex) {
    if (
      state.isTurning ||
      nextIndex < 0 ||
      nextIndex >= STORY_PAGES.length ||
      nextIndex === state.pageIndex
    ) {
      return;
    }

    state.isTurning = true;
    const direction = nextIndex > state.pageIndex ? "forward" : "backward";
    elements.bookPage.classList.add(`is-turning-${direction}`);

    window.setTimeout(() => {
      state.pageIndex = nextIndex;
      state.hasStarted = true;
      renderPage({ focus: true });
      saveState();
      elements.bookPage.classList.remove("is-turning-forward", "is-turning-backward");
      elements.bookPage.classList.add("is-arriving");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => elements.bookPage.classList.remove("is-arriving"));
      });
      state.isTurning = false;
    }, motionDuration(170));
  }

  function motionDuration(duration) {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : duration;
  }

  function openBook() {
    state.hasStarted = true;
    elements.reader.removeAttribute("inert");
    elements.body.classList.remove("cover-active");
    elements.cover.classList.add("is-open");
    elements.cover.setAttribute("aria-hidden", "true");
    elements.reader.classList.add("is-visible");
    saveState();
    window.setTimeout(() => elements.pageContent.focus({ preventScroll: true }), motionDuration(450));
  }

  function closeDialog(dialog) {
    if (dialog.open) dialog.close();
  }

  function buildChapterList() {
    const chapterStarts = STORY_PAGES.map((page, index) => ({ page, index })).filter(
      ({ page }) => page.isChapterStart,
    );

    elements.chapterList.innerHTML = chapterStarts
      .map(
        ({ page, index }) => `
          <button type="button" data-page-index="${index}">
            <span class="chapter-list__number">${page.chapter === "After" ? "—" : String(page.chapterNumber).padStart(2, "0")}</span>
            <span class="chapter-list__name">
              <span>${escapeHtml(page.title)}</span>
              <small>Page ${index + 1}</small>
            </span>
            <span class="chapter-list__marker" aria-hidden="true"></span>
          </button>`,
      )
      .join("");
  }

  function updateChapterList() {
    const currentChapter = STORY_PAGES[state.pageIndex].chapterNumber;
    elements.chapterList.querySelectorAll("button").forEach((button) => {
      const buttonPage = STORY_PAGES[Number(button.dataset.pageIndex)];
      const isCurrent = buttonPage.chapterNumber === currentChapter;
      button.classList.toggle("is-current", isCurrent);
      if (isCurrent) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
  }

  function updateFontButtons() {
    document.querySelectorAll(".segmented-control [data-font-size]").forEach((button) => {
      const isSelected = button.dataset.fontSize === state.fontSize;
      button.classList.toggle("is-selected", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });
  }

  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("is-visible");
    window.clearTimeout(showToast.timeout);
    showToast.timeout = window.setTimeout(
      () => elements.toast.classList.remove("is-visible"),
      2200,
    );
  }

  function restartStory() {
    const confirmed = window.confirm("Restart The Locked Hour from the beginning?");
    if (!confirmed) return;

    state.pageIndex = 0;
    state.hasStarted = true;
    closeDialog(elements.settingsDialog);
    renderPage({ focus: true });
    saveState();
    showToast("Progress restarted");
  }

  function handleKeyboard(event) {
    if (elements.contentsDialog.open || elements.settingsDialog.open) return;
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      turnTo(state.pageIndex - 1);
    }
    if (event.key === "ArrowRight" || event.key === " ") {
      event.preventDefault();
      turnTo(state.pageIndex + 1);
    }
  }

  function bindEvents() {
    elements.startButton.addEventListener("click", openBook);
    elements.previousButton.addEventListener("click", () => turnTo(state.pageIndex - 1));
    elements.nextButton.addEventListener("click", () => turnTo(state.pageIndex + 1));
    elements.chapterButton.addEventListener("click", () => elements.contentsDialog.showModal());
    elements.settingsButton.addEventListener("click", () => elements.settingsDialog.showModal());
    elements.restartButton.addEventListener("click", restartStory);

    elements.chapterList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-page-index]");
      if (!button) return;
      closeDialog(elements.contentsDialog);
      turnTo(Number(button.dataset.pageIndex));
    });

    document.querySelectorAll("[data-close-dialog]").forEach((button) => {
      button.addEventListener("click", () => closeDialog(button.closest("dialog")));
    });

    document.querySelectorAll(".segmented-control [data-font-size]").forEach((button) => {
      button.addEventListener("click", () => {
        state.fontSize = button.dataset.fontSize;
        renderPage();
        saveState();
      });
    });

    [elements.contentsDialog, elements.settingsDialog].forEach((dialog) => {
      dialog.addEventListener("click", (event) => {
        if (event.target === dialog) closeDialog(dialog);
      });
    });

    document.addEventListener("keydown", handleKeyboard);

    let touchStartX = 0;
    let touchStartY = 0;
    elements.bookPage.addEventListener(
      "touchstart",
      (event) => {
        touchStartX = event.changedTouches[0].clientX;
        touchStartY = event.changedTouches[0].clientY;
      },
      { passive: true },
    );
    elements.bookPage.addEventListener(
      "touchend",
      (event) => {
        const deltaX = event.changedTouches[0].clientX - touchStartX;
        const deltaY = event.changedTouches[0].clientY - touchStartY;
        if (Math.abs(deltaX) < 72 || Math.abs(deltaX) < Math.abs(deltaY) * 1.25) return;
        turnTo(deltaX < 0 ? state.pageIndex + 1 : state.pageIndex - 1);
      },
      { passive: true },
    );
  }

  function init() {
    if (!window.STORY_PAGES && typeof STORY_PAGES === "undefined") return;
    loadState();
    buildChapterList();
    renderPage();
    bindEvents();

    if (state.hasStarted) {
      elements.startLabel.textContent = "Resume reading";
      elements.cover.classList.add("has-progress");
    }
  }

  init();
})();
