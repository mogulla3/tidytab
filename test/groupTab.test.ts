import { describe, expect, test } from '@jest/globals';
import { groupTabsByDomain } from "../src/groupTab";

const buildTab = (props: Pick<chrome.tabs.Tab, "url">): chrome.tabs.Tab => {
  return Object.assign(
    {
      id: 1,
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

describe("groupTabsByDomain", () => {
  test("returns tabs grouped by domain", () => {
    const tabA1 = buildTab({ url: "https://a.com" });
    const tabA2 = buildTab({ url: "https://a.com/1" });
    const tabA3 = buildTab({ url: "https://a.com:80/1" });
    const tabB1 = buildTab({ url: "https://b.com/1/2/3" });
    const tabB2 = buildTab({ url: "https://b.com/4/5/6" });
    const tabC1 = buildTab({ url: "https://www.c.com" });

    const tabs = groupTabsByDomain([tabA1, tabA2, tabA3, tabB1, tabB2, tabC1]);

    expect(tabs).toHaveProperty(["a.com"], [tabA1, tabA2, tabA3]);
    expect(tabs).toHaveProperty(["b.com"], [tabB1, tabB2]);
    expect(tabs).toHaveProperty(["c.com"], [tabC1]);
  });
});
