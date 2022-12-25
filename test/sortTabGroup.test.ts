import { describe, expect, test } from '@jest/globals';
import { sortTabGroupsOrderByAsc, sortTabGroupsOrderByDesc } from "../src/sortTabGroup";

const buildTabGroup = (title: string): chrome.tabGroups.TabGroup => {
  return {
    id: 1,
    collapsed: true,
    color: "grey",
    title: title,
    windowId: 1,
  }
}

describe("sortTabGroupsOrderByAsc", () => {
  test("returns tabGroups sorted by title in asc order", () => {
    const tabGroups = sortTabGroupsOrderByAsc([
      buildTabGroup("c.com"),
      buildTabGroup("a.com"),
      buildTabGroup("b.com"),
    ]);

    expect(tabGroups[0].title).toBe("a.com")
    expect(tabGroups[1].title).toBe("b.com")
    expect(tabGroups[2].title).toBe("c.com")
  });
});

describe("sortTabGroupsOrderByDesc", () => {
  test("returns tabGroups sorted by title in desc order", () => {
    const tabGroups = sortTabGroupsOrderByDesc([
      buildTabGroup("c.com"),
      buildTabGroup("a.com"),
      buildTabGroup("b.com"),
    ]);

    expect(tabGroups[0].title).toBe("c.com")
    expect(tabGroups[1].title).toBe("b.com")
    expect(tabGroups[2].title).toBe("a.com")
  });
});
