import { SortOrder } from "./sortOrder";

export class TabGroupSorter {
  private tabGroups: chrome.tabGroups.TabGroup[];

  constructor(tabGroups: chrome.tabGroups.TabGroup[]) {
    this.tabGroups = tabGroups;
  }

  run(sortOrder: SortOrder): chrome.tabGroups.TabGroup[] {
    return this.tabGroups.sort((tabGroupA: chrome.tabGroups.TabGroup, tabGroupB: chrome.tabGroups.TabGroup) => {
      if (tabGroupA.title === undefined || tabGroupB.title === undefined) {
        return 0;
      }

      const titleA = tabGroupA.title;
      const titleB = tabGroupB.title;

      if (sortOrder === SortOrder.ASC) {
        if (titleA < titleB) return -1;
        if (titleA > titleB) return 1;
      }

      if (sortOrder === SortOrder.DESC) {
        if (titleA < titleB) return 1;
        if (titleA > titleB) return -1;
      }

      return 0;
    });
  }
}
