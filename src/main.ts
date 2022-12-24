import "./style.css";
import { sortTabsOrderByAsc, sortTabsOrderByDesc } from "./sortTab";
import { groupTabsByDomain } from "./groupTab";
import { extractTabIds } from "./utils";

document.getElementById("sort_asc")?.addEventListener("click", (_event) => {
  chrome.tabs.query({ currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    for (const [index, tabId] of extractTabIds(sortTabsOrderByAsc(tabs)).entries()) {
      chrome.tabs.move(tabId, { index: index });
    }
  });
});

document.getElementById("sort_desc")?.addEventListener("click", (_event) => {
  chrome.tabs.query({ currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    for (const [index, tabId] of extractTabIds(sortTabsOrderByDesc(tabs)).entries()) {
      chrome.tabs.move(tabId, { index: index });
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
    const tabsGroupByDomain = groupTabsByDomain(tabs)

    for (const [domain, tabs] of Object.entries(tabsGroupByDomain)) {
      if (2 > tabs.length) {
        continue;
      }

      chrome.tabs.group({ tabIds: extractTabIds(tabs) }, (groupId: number) => {
        chrome.tabGroups.update(groupId, { title: domain, collapsed: true })
      });
    }
  });
});
