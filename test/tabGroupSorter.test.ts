import { describe, expect, test } from '@jest/globals';
import { TabGroupSorter } from "../src/tabGroupSorter";
import { SortOrder } from "../src/sortOrder";

const buildTabGroup = (title: string): chrome.tabGroups.TabGroup => {
  return {
    id: 1,
    collapsed: true,
    color: "grey",
    title: title,
    windowId: 1,
  }
}

describe("run with SortOrder.ASC argument", () => {
  test("returns tabGroups sorted by title in asc order", () => {
    const tabGroupSorter = new TabGroupSorter(
      [
        buildTabGroup("c.com"),
        buildTabGroup("a.com"),
        buildTabGroup("b.com"),
      ],
    )
    const tabGroups = tabGroupSorter.run(SortOrder.ASC)

    expect(tabGroups[0].title).toBe("a.com")
    expect(tabGroups[1].title).toBe("b.com")
    expect(tabGroups[2].title).toBe("c.com")
  });
});

describe("run with SortOrder.DESC argument", () => {
  test("returns tabGroups sorted by title in desc order", () => {
    const tabGroupSorter = new TabGroupSorter(
      [
        buildTabGroup("c.com"),
        buildTabGroup("a.com"),
        buildTabGroup("b.com"),
      ],
    )
    const tabGroups = tabGroupSorter.run(SortOrder.DESC)

    expect(tabGroups[0].title).toBe("c.com")
    expect(tabGroups[1].title).toBe("b.com")
    expect(tabGroups[2].title).toBe("a.com")
  });
});
