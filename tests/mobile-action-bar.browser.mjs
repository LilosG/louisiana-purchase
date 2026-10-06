// Optional browser regression check; uses an existing Playwright installation.
// LP_PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node tests/mobile-action-bar.browser.mjs
import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
const { chromium } = await import(
  process.env.LP_PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.LP_BASE_URL || "http://127.0.0.1:4322";
const browser = await chromium.launch({
  channel: process.env.LP_BROWSER_CHANNEL || "chrome",
  headless: true,
});
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
await context.route("https://**", (route) => route.abort());
await context.addInitScript(() =>
  localStorage.setItem(
    "lilos-privacy-v1",
    JSON.stringify({ optOut: false, ts: 1 }),
  ),
);
const page = await context.newPage();
const evidence = { browser: browser.version(), keyboard: [], sizes: [] };
const screenshot = async (name) =>
  page.screenshot({
    path: `docs/mobile-action-bar/${name}.png`,
    animations: "disabled",
  });
const isInert = () =>
  page.locator(".mobile-action-bar").evaluate((el) => el.inert);
const focusedBarLink = () =>
  page.evaluate(() =>
    document.activeElement.closest(".mobile-action-bar")
      ? document.activeElement.textContent.trim()
      : null,
  );

async function openMenu() {
  await page.locator("#nav-mobile-toggle").focus();
  await page.keyboard.press("Enter");
  assert.equal(await isInert(), true);
  assert.equal(
    await page.locator("#nav-mobile-toggle").getAttribute("aria-expanded"),
    "true",
  );
}

async function checkRestored(path) {
  assert.equal(await isInert(), false, path);
  await page.locator("footer a").last().focus();
  await page.keyboard.press("Tab");
  assert.equal(await focusedBarLink(), "Reserve", path);
  await page.keyboard.press("Tab");
  assert.equal(await focusedBarLink(), "Call Us", path);
  evidence.keyboard.push({ closePath: path, reserveAndCallReachable: true });
}

try {
  await page.goto(`${base}/contact/`);
  await openMenu();
  await page.evaluate(() => {
    window.barFocusCount = 0;
    document.addEventListener("focusin", (e) => {
      if (e.target.closest(".mobile-action-bar")) window.barFocusCount++;
    });
  });
  // Traverse the full document more than once, both directions, using real keys.
  for (const key of ["Tab", "Shift+Tab"]) {
    for (let i = 0; i < 70; i++) {
      await page.keyboard.press(key);
      assert.equal(
        await focusedBarLink(),
        null,
        `obscured focus during ${key}`,
      );
    }
  }
  assert.equal(await page.evaluate(() => window.barFocusCount), 0);
  await page.locator("#nav-mobile-toggle").focus();
  await page.keyboard.press("Enter");
  await checkRestored("toggle");
  await openMenu();
  await page.keyboard.press("Escape");
  await checkRestored("Escape");
  await openMenu();
  await page.locator('#nav-mobile-drawer a[href="/menu"]').focus();
  await page.keyboard.press("Enter");
  await page.waitForURL(/\/menu\/?$/);
  await checkRestored("navigation");
  await openMenu();
  await page.setViewportSize({ width: 1280, height: 844 });
  await page.waitForFunction(
    () =>
      document
        .getElementById("nav-mobile-toggle")
        .getAttribute("aria-expanded") === "false",
  );
  assert.equal(await page.locator(".mobile-action-bar").isVisible(), false);
  await page.setViewportSize({ width: 320, height: 740 });
  await checkRestored("desktop and back to mobile");

  // Finish existing page transitions before measuring each text-size change.
  await page.addStyleTag({
    content: "* { transition: none !important; animation: none !important; }",
  });

  for (const width of [320, 375, 390, 430]) {
    await page.setViewportSize({ width, height: 844 });
    for (const percent of [100, 200, 300, 400]) {
      await page.evaluate(
        (percent) => (document.documentElement.style.fontSize = `${percent}%`),
        percent,
      );
      await page.evaluate(() => document.fonts.ready);
      const metrics = await page.evaluate(() => {
        const bar = document.querySelector(".mobile-action-bar");
        const actions = [...bar.querySelectorAll("a")];
        return {
          width: innerWidth,
          font: getComputedStyle(actions[0]).fontSize,
          height: bar.getBoundingClientRect().height,
          reserve: parseFloat(getComputedStyle(document.body).paddingBottom),
          widths: actions.map((a) => a.getBoundingClientRect().width),
          labelsInside: actions.every((a) => {
            const label = a.querySelector("span").getBoundingClientRect(),
              rect = a.getBoundingClientRect();
            return label.top >= rect.top && label.bottom <= rect.bottom;
          }),
          overflow:
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
        };
      });
      assert.ok(
        Math.abs(metrics.height - metrics.reserve) < 1,
        JSON.stringify(metrics),
      );
      assert.equal(metrics.widths[0], metrics.widths[1]);
      assert.equal(metrics.labelsInside, true, JSON.stringify(metrics));
      // Existing page headings can overflow at extreme text sizes; the bar's
      // own bounds and labels are checked at every size above.
      if (percent === 100)
        assert.equal(metrics.overflow, false, JSON.stringify(metrics));
      if (percent === 100) {
        assert.equal(metrics.font, "12px");
        assert.equal(metrics.height, 56);
      }
      evidence.sizes.push({ percent, ...metrics });
    }
  }
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(`${base}/contact/`);
  await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
  await page.locator(".mobile-action-bar__reserve").focus();
  await page.evaluate(() => scrollTo({ top: 0, left: 0, behavior: "instant" }));
  await screenshot("enlarged-text-320");
  await page.evaluate(() => (document.documentElement.style.fontSize = "100%"));
  for (const width of [1279, 1280, 1440]) {
    await page.setViewportSize({ width, height: 844 });
    assert.equal(
      await page.locator(".mobile-action-bar").isVisible(),
      width < 1280,
    );
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${base}/`);
  await page.evaluate(() => document.fonts.ready);
  await screenshot("home-390");
  await openMenu();
  await page.waitForFunction(
    () =>
      getComputedStyle(document.getElementById("nav-mobile-drawer")).opacity ===
      "1",
  );
  await screenshot("menu-390");
  await page.keyboard.press("Escape");
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  assert.ok(
    await page.evaluate(
      () =>
        document.querySelector("footer").getBoundingClientRect().bottom <=
        document.querySelector(".mobile-action-bar").getBoundingClientRect()
          .top +
          1,
    ),
  );
  await screenshot("footer-390");
  await page.goto(`${base}/contact/`);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.evaluate(() => document.fonts.ready);
  await screenshot("contact-375");
  await page.setViewportSize({ width: 390, height: 844 });
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setSafeAreaInsetsOverride", {
    insets: { bottom: 34, left: 0, right: 0, top: 0 },
  });
  evidence.safeArea = await page.evaluate(() => ({
    height: document.querySelector(".mobile-action-bar").getBoundingClientRect()
      .height,
    reserve: parseFloat(getComputedStyle(document.body).paddingBottom),
  }));
  assert.equal(evidence.safeArea.height, 90);
  assert.equal(evidence.safeArea.reserve, 90);
  await screenshot("safe-area-390");
  await cdp.send("Emulation.setSafeAreaInsetsOverride", {
    insets: { bottom: 0, left: 0, right: 0, top: 0 },
  });
  await cdp.detach();
  await page.setViewportSize({ width: 320, height: 740 });
  await context.clearCookies();
  await page.evaluate(() => localStorage.removeItem("lilos-privacy-v1"));
  // Init script sets privacy on navigation, so show the existing notice for its screenshot.
  await page.evaluate(
    () => (document.getElementById("lilos-consent-banner").hidden = false),
  );
  await screenshot("consent-320");

  const analyticsSource = await readFile(
    "src/components/layout/Analytics.astro",
    "utf8",
  );
  const analyticsScript = analyticsSource.match(
    /<script[^>]*>([\s\S]*?)<\/script>/,
  )[1];
  evidence.analytics = [];
  for (const path of ["/contact/", "/menu/", "/contact/"]) {
    await page.goto(base + path);
    await page.evaluate((script) => {
      window.GA_ID = "G-TEST000000";
      (0, eval)(script);
      document.addEventListener("click", (e) => {
        if (e.target.closest(".mobile-action-bar a")) e.preventDefault();
      });
    }, analyticsScript);
    await page.locator("footer a").last().focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Enter");
    const events = await page.evaluate(() =>
      dataLayer.map((a) => Array.from(a)).filter((a) => a[0] === "event"),
    );
    assert.deepEqual(
      events.map((event) => event[1]),
      ["reservation_click", "phone_click"],
    );
    assert.ok(
      events.every((event) => event[2].cta_location === "mobile_bottom_bar"),
    );
    evidence.analytics.push({ path, events });
  }
  const noJs = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 740 },
    isMobile: true,
  });
  const plainPage = await noJs.newPage();
  await plainPage.goto(`${base}/contact/`);
  assert.equal(
    await plainPage.locator(".mobile-action-bar").getAttribute("inert"),
    null,
  );
  assert.equal(await plainPage.locator(".mobile-action-bar a").count(), 2);
  await plainPage.screenshot({
    path: "docs/mobile-action-bar/no-js-320.png",
    animations: "disabled",
  });
  await noJs.close();
  await writeFile(
    "/private/tmp/lp-corrections-browser.json",
    JSON.stringify(evidence, null, 2),
  );
  console.log(
    JSON.stringify({
      keyboard: evidence.keyboard,
      sizesChecked: evidence.sizes.length,
      safeArea: evidence.safeArea,
      analyticsNavigations: evidence.analytics.length,
    }),
  );
} finally {
  await browser.close();
}
