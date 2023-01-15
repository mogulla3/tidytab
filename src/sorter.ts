import { SortOrder } from "./sortOrder";
import { TabSorter } from "./tabSorter";
import { TabGroupSorter } from "./tabGroupSorter";
import { extractTabIds, extractTabGroupIds } from "./utils";
import { Options } from "./options";

export class Sorter {
  async run(sortOrder: SortOrder) {
    const tabs = await this.getTabs();
    const pinnedTabs = await this.getPinnedTabs();
    const tabGroups = await this.getTabGroups();
    const options = (await chrome.storage.sync.get()) as Options;

    const tabSorter = new TabSorter(tabs, options);
    const tabGroupSorter = new TabGroupSorter(tabGroups);

    const sortedTabs = tabSorter.run(sortOrder);
    const sortedTabGroups = tabGroupSorter.run(sortOrder);

    // tabGroup を move する際、内包するタブの件数を考慮して index を指定する必要がある.
    // tabGroup からタブの件数を取るのは面倒なため、先頭に移動させる `index = 0` を逆順に適用することでソートしている
    if (options.preferTagGroupToTabOnSorting) {
      this.rearrangeTabs(sortedTabs, pinnedTabs);
      this.rearrangeTabGroups(sortedTabGroups, pinnedTabs);
    } else {
      this.rearrangeTabGroups(sortedTabGroups, pinnedTabs);
      this.rearrangeTabs(sortedTabs, pinnedTabs);
    }
  }

  private rearrangeTabs(sortedTabs: chrome.tabs.Tab[], pinnedTabs: chrome.tabs.Tab[]) {
    const tabIds = extractTabIds(sortedTabs);
    for (const [index, tabId] of tabIds.entries()) {
      chrome.tabs.move(tabId, { index: index + pinnedTabs.length });
    }
  }

  private rearrangeTabGroups(sortedTabGroups: chrome.tabGroups.TabGroup[], pinnedTabs: chrome.tabs.Tab[]) {
    const tabGroupIds = extractTabGroupIds(sortedTabGroups);
    for (const tabGroupId of tabGroupIds.reverse()) {
      chrome.tabGroups.move(tabGroupId, { index: 0 + pinnedTabs.length });
    }
  }

  private getTabs() {
    return chrome.tabs.query({ currentWindow: true, groupId: chrome.tabGroups.TAB_GROUP_ID_NONE, pinned: false });
  }

  private getPinnedTabs() {
    return chrome.tabs.query({ currentWindow: true, groupId: chrome.tabGroups.TAB_GROUP_ID_NONE, pinned: true });
  }

  private getTabGroups() {
    return chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT });
  }
}
