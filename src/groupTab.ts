import { extractTabIds } from "./utils";
import { Options } from "./options";

export const groupTabsByDomain = (tabs: chrome.tabs.Tab[], options: Options): { [key: string]: chrome.tabs.Tab[] } => {
  return tabs.reduce((result: { [key: string]: chrome.tabs.Tab[] }, tab: chrome.tabs.Tab) => {
    if (tab.url === undefined || tab.id === undefined) {
      return result;
    }

    let hostname: string;
    const url = new URL(tab.url);
    if (options.removeWwwSubdomainFromTabGroupName && url.hostname.startsWith("www.")) {
      hostname = url.hostname.slice(4);
    } else {
      hostname = url.hostname;
    }

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
  const options = (await chrome.storage.sync.get()) as Options;
  const tabsGroupByDomain = groupTabsByDomain(tabs, options);

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
