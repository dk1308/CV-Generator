/**
 * Paged.js custom handler — tags each rendered page with sidebar presence.
 *
 * Phase 03b: The sidebar is a `float: left` 60mm column that fragments across
 * pages 1..K. Pages K+1..N contain no `.sidebar-content` fragment — those
 * should render without the orange/photo background and with main-content
 * spanning the full 210mm canvas.
 *
 * Native CSS Paged Media can't conditionally style pages based on their
 * dynamic content, so we piggy-back on Paged.js's `afterPageLayout` hook:
 *
 *   1. Inspect the finished page for `.sidebar-content`.
 *   2. Add class `page-has-sidebar` or `page-no-sidebar` to the page element.
 *   3. On no-sidebar pages, override `.main-content` inline styles so
 *      `margin-left` is removed and left-padding restored (otherwise the
 *      global `margin-left: 60mm` rule in print.css leaves a blank strip).
 *
 * Script order: this file loads BEFORE `paged.polyfill.js` in cv-layout.astro.
 * `Paged.Handler` + `Paged.registerHandlers` are exposed by the polyfill via
 * a window global; the polyfill's DOMContentLoaded IIFE fires pagination
 * AFTER this registration call, so our handler is invoked on every page.
 *
 * No user input, no eval, no remote fetch — safe to run client-side.
 */

class SidebarPageTagger extends Paged.Handler {
  constructor(chunker, polisher, caller) {
    super(chunker, polisher, caller);
    this.sidebarPageIndex = 0;
  }

  afterPageLayout(pageEl) {
    const sidebar = pageEl.querySelector(".sidebar-content");
    const hasSidebar = !!sidebar;
    pageEl.classList.add(hasSidebar ? "page-has-sidebar" : "page-no-sidebar");

    if (hasSidebar) {
      this.sidebarPageIndex++;
      if (this.sidebarPageIndex > 1) {
        // Continuation pages: re-apply top gap to clear photo+logo region
        // of sidebar.png (which repeats on every sidebar page via @page bg).
        sidebar.style.setProperty("padding-top", "65mm", "important");
      }
    }

    if (!hasSidebar) {
      pageEl.querySelectorAll(".main-content").forEach((el) => {
        el.style.setProperty("margin-left", "0", "important");
        el.style.setProperty("padding-left", "15mm", "important");
      });
    }
  }
}


Paged.registerHandlers(SidebarPageTagger);
