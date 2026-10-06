import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import vm from "node:vm";

const source = await readFile(
  new URL("../src/components/layout/Analytics.astro", import.meta.url),
  "utf8",
);
const script = source.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1];
const venue = JSON.parse(
  await readFile(
    new URL("../src/content/venueSettings/settings.json", import.meta.url),
  ),
);

function analytics({
  optOut = false,
  gpc = false,
  blockedStorage = false,
} = {}) {
  const handlers = [];
  const records = new Map(
    optOut ? [["lilos-privacy-v1", JSON.stringify({ optOut, ts: 1 })]] : [],
  );
  class Element {
    constructor(href, location) {
      this.href = href;
      this.dataset = location ? { ctaLocation: location } : {};
    }
    closest(selector) {
      return selector.includes("tel:") || selector.includes("opentable.com")
        ? this
        : null;
    }
  }
  const context = vm.createContext({
    GA_ID: "G-TEST000000",
    Element,
    navigator: { globalPrivacyControl: gpc },
    localStorage: {
      getItem(key) {
        if (blockedStorage) throw new Error("storage blocked");
        return records.get(key) ?? null;
      },
      setItem(key, value) {
        records.set(key, value);
      },
    },
    document: {
      createElement: () => ({}),
      head: { appendChild() {} },
      addEventListener(name, handler) {
        if (name === "click") handlers.push(handler);
      },
    },
  });
  context.window = context;
  context.location = { pathname: "/" };
  const activate = (href, location = "mobile_bottom_bar") => {
    const target = new Element(href, location);
    for (const handler of handlers) handler({ target });
  };
  const events = () =>
    (context.dataLayer ?? [])
      .map((args) => Array.from(args))
      .filter((args) => args[0] === "event");
  vm.runInContext(script, context);
  return { context, activate, events };
}

test("one business event per activation, including repeated initialization and page changes", () => {
  const { context, activate, events } = analytics();
  for (const pathname of ["/", "/contact/", "/private-events/", "/"]) {
    context.location.pathname = pathname;
    vm.runInContext(script, context);
    activate(venue.reservationsUrl);
    activate(`tel:${venue.phoneFallback}`);
  }
  assert.equal(events().length, 8);
  for (let i = 0; i < 8; i += 2) {
    assert.equal(events()[i][1], "reservation_click");
    assert.equal(events()[i][2].reservation_system, "opentable");
    assert.equal(events()[i][2].link_url, venue.reservationsUrl);
    assert.equal(events()[i + 1][1], "phone_click");
    assert.equal(events()[i + 1][2].link_url, `tel:${venue.phoneFallback}`);
    assert.equal(events()[i][2].cta_location, "mobile_bottom_bar");
    assert.equal(events()[i + 1][2].cta_location, "mobile_bottom_bar");
  }
});

test("existing reservation placements keep their parameters without a bar location", () => {
  const { activate, events } = analytics();
  activate(venue.reservationsUrl, null);
  assert.equal(events()[0][2].reservation_system, "opentable");
  assert.equal(events()[0][2].cta_location, undefined);
});

test("privacy opt out and GPC suppress clicks, including opt out after initialization", () => {
  for (const options of [{ optOut: true }, { gpc: true }]) {
    const { activate, events } = analytics(options);
    activate(venue.reservationsUrl);
    activate(`tel:${venue.phoneFallback}`);
    assert.equal(events().length, 0);
  }
  const { context, activate, events } = analytics();
  context.lilosPrivacy.optOut();
  activate(venue.reservationsUrl);
  activate(`tel:${venue.phoneFallback}`);
  assert.equal(events().length, 0);
});

test("unavailable or throwing analytics never throws during activation", () => {
  const { context, activate } = analytics();
  for (const gtag of [
    undefined,
    () => {
      throw new Error("analytics blocked");
    },
  ]) {
    context.gtag = gtag;
    assert.doesNotThrow(() => activate(venue.reservationsUrl));
    assert.doesNotThrow(() => activate(`tel:${venue.phoneFallback}`));
  }
});

test("every built public HTML route has one bar and canonical destinations", async (t) => {
  const root = new URL("../dist/client/", import.meta.url);
  let files;
  try {
    files = await readdir(root, { recursive: true });
  } catch {
    t.skip("Run npm run build first to verify rendered routes.");
    return;
  }
  const pages = files.filter((file) => file.endsWith(".html"));
  assert.ok(pages.length > 20);
  for (const file of pages) {
    const html = await readFile(new URL(file, root), "utf8");
    const bars = [
      ...html.matchAll(
        /<nav\b[^>]*class="mobile-action-bar"[^>]*>([\s\S]*?)<\/nav>/g,
      ),
    ];
    assert.equal(bars.length, 1, file);
    const destinations = [...bars[0][1].matchAll(/href="([^"]+)"/g)].map(
      (match) => match[1].replaceAll("&amp;", "&"),
    );
    assert.deepEqual(
      destinations,
      [venue.reservationsUrl, `tel:${venue.phoneFallback}`],
      file,
    );
  }
});
