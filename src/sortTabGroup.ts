import { SortOrder } from "./sortOrder";

const compareTabGroups = (tabGroupA: chrome.tabGroups.TabGroup, tabGroupB: chrome.tabGroups.TabGroup, sortOrder: SortOrder): number => {
  if (tabGroupA.title === undefined || tabGroupB.title === undefined) {
    return 0;
  }

  const titleA = tabGroupA.title
  const titleB = tabGroupB.title

  if (sortOrder === SortOrder.ASC) {
    if (titleA < titleB) return -1;
    if (titleA > titleB) return 1;
  }

  if (sortOrder === SortOrder.DESC) {
    if (titleA < titleB) return 1;
    if (titleA > titleB) return -1;
  }

  return 0;
};

const compareTabGroupsOrderByAsc = (tabGroupA: chrome.tabGroups.TabGroup, tabGroupB: chrome.tabGroups.TabGroup): number => {
  return compareTabGroups(tabGroupA, tabGroupB, SortOrder.ASC);
};

const compareTabGroupsOrderByDesc = (tabGroupA: chrome.tabGroups.TabGroup, tabGroupB: chrome.tabGroups.TabGroup): number => {
  return compareTabGroups(tabGroupA, tabGroupB, SortOrder.DESC);
};

export const sortTabGroupsOrderByAsc = (tabGroups: chrome.tabGroups.TabGroup[]): chrome.tabGroups.TabGroup[] => {
  return tabGroups.sort(compareTabGroupsOrderByAsc);
};

export const sortTabGroupsOrderByDesc = (tabGroups: chrome.tabGroups.TabGroup[]): chrome.tabGroups.TabGroup[] => {
  return tabGroups.sort(compareTabGroupsOrderByDesc);
};
