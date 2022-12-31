import { SortOrder } from "./sortOrder";
import { extractTabIds, extractTabGroupIds } from "./utils";
import { sortTabGroupsOrderByAsc, sortTabGroupsOrderByDesc } from "./sortTabGroup";

// Example:
// normalizeUrl(new URL("https://www.mogulla3.tech:9000/foo/bar/baz?q=100"))
// => "mogulla3.tech:9000/foo/bar/baz"
const normalizeUrl = (url: string): string => {
  const urlObj = new URL(url);
  const host = urlObj.host.startsWith("www.") ? urlObj.host.slice(4) : urlObj.host;

  return `${host}${urlObj.pathname}`;
};

const compareTabs = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab, sortOrder: SortOrder): number => {
  if (tabA.url === undefined || tabB.url === undefined) {
    return 0;
  }

  const urlA = normalizeUrl(tabA.url);
  const urlB = normalizeUrl(tabB.url);

  if (sortOrder === SortOrder.ASC) {
    if (urlA < urlB) return -1;
    if (urlA > urlB) return 1;
  }

  if (sortOrder === SortOrder.DESC) {
    if (urlA < urlB) return 1;
    if (urlA > urlB) return -1;
  }

  return 0;
};

const compareTabsOrderByAsc = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab): number => {
  return compareTabs(tabA, tabB, SortOrder.ASC);
};

const compareTabsOrderByDesc = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab): number => {
  return compareTabs(tabA, tabB, SortOrder.DESC);
};

export const sortTabsOrderByAsc = (tabs: chrome.tabs.Tab[]): chrome.tabs.Tab[] => {
  return tabs.sort(compareTabsOrderByAsc);
};

export const sortTabsOrderByDesc = (tabs: chrome.tabs.Tab[]): chrome.tabs.Tab[] => {
  return tabs.sort(compareTabsOrderByDesc);
};

export const sortTabs = async (sortOrder: SortOrder) => {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    groupId: chrome.tabGroups.TAB_GROUP_ID_NONE,
    pinned: false,
  });
  const pinnedTabs = await chrome.tabs.query({
    currentWindow: true,
    groupId: chrome.tabGroups.TAB_GROUP_ID_NONE,
    pinned: true,
  });
  const tabGroups = await chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT });

  let sortedTabs: chrome.tabs.Tab[] = [];
  let sortedTabGroups: chrome.tabGroups.TabGroup[] = [];

  if (sortOrder === SortOrder.ASC) {
    sortedTabs = sortTabsOrderByAsc(tabs);
    sortedTabGroups = sortTabGroupsOrderByAsc(tabGroups);
  } else if (sortOrder === SortOrder.DESC) {
    sortedTabs = sortTabsOrderByDesc(tabs);
    sortedTabGroups = sortTabGroupsOrderByDesc(tabGroups);
  }

  const tabIds = extractTabIds(sortedTabs);
  for (const [index, tabId] of tabIds.entries()) {
    chrome.tabs.move(tabId, { index: index + pinnedTabs.length });
  }

  // tabGroup を move する際、内包するタブの件数を考慮して index を指定する必要がある.
  // tabGroup からタブの件数を取るのは面倒なため、先頭に移動させる `index = 0` を逆順に適用することでソートしている
  const tabGroupIds = extractTabGroupIds(sortedTabGroups);
  for (const tabGroupId of tabGroupIds.reverse()) {
    chrome.tabGroups.move(tabGroupId, { index: 0 + pinnedTabs.length });
  }
};
