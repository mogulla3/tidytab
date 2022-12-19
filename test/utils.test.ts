import { describe, expect, test } from '@jest/globals';
import { extractTabIds } from "../src/utils";

const buildTab = (props: Pick<chrome.tabs.Tab, "id">): chrome.tabs.Tab => {
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

describe("extractTabIds", () => {
  test("returns ids excluding tab with undefined id", () => {
    const tabs = [
      buildTab({ id: 100 }),
      buildTab({ id: 200 }),
      buildTab({ id: undefined }),
    ];

    expect(extractTabIds(tabs)).toEqual([100, 200]);
  });
});
