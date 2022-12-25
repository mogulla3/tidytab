import "./style.css";
import { sortTabsOrderByAsc, sortTabsOrderByDesc } from "./sortTab";
import { sortTabGroupsOrderByAsc, sortTabGroupsOrderByDesc } from "./sortTabGroup";
import { groupTabsByDomain } from "./groupTab";
import { extractTabIds, extractTabGroupIds } from "./utils";

document.getElementById("sort_asc")?.addEventListener("click", (_event) => {
  chrome.tabs.query({ currentWindow: true, groupId: chrome.tabGroups.TAB_GROUP_ID_NONE }, (tabs: chrome.tabs.Tab[]) => {
    const tabIds = extractTabIds(sortTabsOrderByAsc(tabs));
    for (const [index, tabId] of tabIds.entries()) {
      chrome.tabs.move(tabId, { index: index });
    }
  });

  chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabGroups: chrome.tabGroups.TabGroup[]) => {
    const tabGroupIds = extractTabGroupIds(sortTabGroupsOrderByAsc(tabGroups));
    // tabGroup を move する際、内包するタブの件数を考慮して index を指定する必要がある.
    // tabGroup からタブの件数を取るのは面倒なため、先頭に移動させる `index = 0` を逆順に適用することでソートしている
    for (const tabGroupId of tabGroupIds.reverse()) {
      chrome.tabGroups.move(tabGroupId, { index: 0 });
    }
  });
});

document.getElementById("sort_desc")?.addEventListener("click", (_event) => {
  chrome.tabs.query({ currentWindow: true, groupId: chrome.tabGroups.TAB_GROUP_ID_NONE }, (tabs: chrome.tabs.Tab[]) => {
    const tabIds = extractTabIds(sortTabsOrderByDesc(tabs));
    for (const [index, tabId] of tabIds.entries()) {
      chrome.tabs.move(tabId, { index: index });
    }
  });

  chrome.tabGroups.query({ windowId: chrome.windows.WINDOW_ID_CURRENT }, (tabGroups: chrome.tabGroups.TabGroup[]) => {
    const tabGroupIds = extractTabGroupIds(sortTabGroupsOrderByDesc(tabGroups));
    for (const tabGroupId of tabGroupIds.reverse()) {
      chrome.tabGroups.move(tabGroupId, { index: 0 });
    }
  });
});

document.getElementById("remove_dup")?.addEventListener("click", (_event) => {
  chrome.tabs.query({ currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    const urls: string[] = [];
    const duplicatedTabIds: number[] = [];

    for (const tab of tabs) {
      if (tab.id === undefined || tab.url === undefined) {
        continue;
      }

      if (urls.includes(tab.url)) {
        duplicatedTabIds.push(tab.id);
        continue;
      }

      urls.push(tab.url);
    }

    chrome.tabs.remove(duplicatedTabIds);
  });
});

document.getElementById("remove_initial")?.addEventListener("click", (_event) => {
  chrome.tabs.query({ url: "chrome://newtab/", currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    chrome.tabs.remove(extractTabIds(tabs));
  });
});

document.getElementById("only_current_tab")?.addEventListener("click", (_event) => {
  chrome.tabs.query({ active: false, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    chrome.tabs.remove(extractTabIds(tabs));
  });
});

document.getElementById("group_tabs")?.addEventListener("click", (_event) => {
  chrome.tabs.query({ currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    const tabsGroupByDomain = groupTabsByDomain(tabs);

    for (const [domain, tabs] of Object.entries(tabsGroupByDomain)) {
      if (2 > tabs.length) {
        continue;
      }

      chrome.tabs.group({ tabIds: extractTabIds(tabs) }, (groupId: number) => {
        chrome.tabGroups.update(groupId, { title: domain, collapsed: true });
      });
    }
  });
});

document.getElementById("ungroup_tabs")?.addEventListener("click", (_event) => {
  chrome.tabs.query({ currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    chrome.tabs.ungroup(extractTabIds(tabs));
  });
});
