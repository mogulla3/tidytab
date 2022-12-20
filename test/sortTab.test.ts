import { describe, expect, test } from '@jest/globals';
import { sortTabOrderByAsc, sortTabOrderByDesc } from "../src/sortTab";

const buildTab = (props: Pick<chrome.tabs.Tab, "url">): chrome.tabs.Tab => {
  return Object.assign(
    {
      index: 1,
      windowId: 1,
      groupId: 1,
      pinned: false,
      highlighted: false,
      active: false,
      incognito: false,
      selected: false,
      discarded: false,
      autoDiscardable: false,
    },
    props,
  );
}

describe("sortTabOrderByAsc", () => {
  test("returns tabs sorted by URL in asc order", () => {
    const tabs = sortTabOrderByAsc([
      buildTab({ url: "https://b.com" }),
      buildTab({ url: "https://c.com/2" }),
      buildTab({ url: "https://c.com/1" }),
      buildTab({ url: "https://a.com" }),
    ]);

    expect(tabs[0].url).toBe("https://a.com")
    expect(tabs[1].url).toBe("https://b.com")
    expect(tabs[2].url).toBe("https://c.com/1")
    expect(tabs[3].url).toBe("https://c.com/2")
  });

  describe("when a tab with URL containing `www` subdomain exists", () => {
    test("returns tabs sorted by URL in asc order ignoring www subdomain", () => {
      const tabs = sortTabOrderByAsc([
        buildTab({ url: "https://b.com" }),
        buildTab({ url: "https://www.a.com" }),
      ]);

      expect(tabs[0].url).toBe("https://www.a.com")
      expect(tabs[1].url).toBe("https://b.com")
    });
  });

  describe("when a tab with URL containing `http` scheme exists", () => {
    test("returns tabs sorted by URL in asc order ignoring schemes", () => {
      const tabs = sortTabOrderByAsc([
        buildTab({ url: "http://b.com" }),
        buildTab({ url: "https://a.com" }),
      ]);

      expect(tabs[0].url).toBe("https://a.com")
      expect(tabs[1].url).toBe("http://b.com")
    });
  });
});

describe("sortTabOrderByDesc", () => {
  test("returns tabs sorted by URL in desc order", () => {
    const tabs = sortTabOrderByDesc([
      buildTab({ url: "https://b.com" }),
      buildTab({ url: "https://c.com/2" }),
      buildTab({ url: "https://c.com/1" }),
      buildTab({ url: "https://a.com" }),
    ]);

    expect(tabs[0].url).toBe("https://c.com/2")
    expect(tabs[1].url).toBe("https://c.com/1")
    expect(tabs[2].url).toBe("https://b.com")
    expect(tabs[3].url).toBe("https://a.com")
  });

  describe("when a tab with URL containing `www` subdomain exists", () => {
    test("returns tabs sorted by URL in desc order ignoring www subdomain", () => {
      const tabs = sortTabOrderByDesc([
        buildTab({ url: "https://b.com" }),
        buildTab({ url: "https://www.a.com" }),
      ]);

      expect(tabs[0].url).toBe("https://b.com")
      expect(tabs[1].url).toBe("https://www.a.com")
    });
  });

  describe("when a tab with URL containing `http` scheme exists", () => {
    test("returns tabs sorted by URL in desc order ignoring schemes", () => {
      const tabs = sortTabOrderByDesc([
        buildTab({ url: "http://b.com" }),
        buildTab({ url: "https://a.com" }),
      ]);

      expect(tabs[0].url).toBe("http://b.com")
      expect(tabs[1].url).toBe("https://a.com")
    });
  });
});
