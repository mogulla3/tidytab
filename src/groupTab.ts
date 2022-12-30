import { extractTabIds } from "./utils";

export const groupTabsByDomain = (tabs: chrome.tabs.Tab[]): { [key: string]: chrome.tabs.Tab[] } => {
  return tabs.reduce((result: { [key: string]: chrome.tabs.Tab[] }, tab: chrome.tabs.Tab) => {
    if (tab.url === undefined || tab.id === undefined) {
      return result;
    }

    const url = new URL(tab.url);
    const hostname = url.hostname.startsWith("www.") ? url.hostname.slice(4) : url.hostname;
    if (hostname in result) {
      result[hostname].push(tab);
    } else {
      result[hostname] = [tab];
    }

    return result;
  }, {});
};

export const groupTabs = async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const tabsGroupByDomain = groupTabsByDomain(tabs);

  for (const [domain, tabs] of Object.entries(tabsGroupByDomain)) {
    if (2 > tabs.length) {
      continue;
    }

    chrome.tabs.group({ tabIds: extractTabIds(tabs) }, (groupId: number) => {
      chrome.tabGroups.update(groupId, { title: domain, collapsed: true });
    });
  }
};

export const ungroupTabs = async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  chrome.tabs.ungroup(extractTabIds(tabs));
};
