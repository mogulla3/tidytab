import { extractTabIds } from "./utils";

export const removeDuplicatedTabs = async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true });
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
};

export const removeInitialStateTabs = async () => {
  const tabs = await chrome.tabs.query({ url: "chrome://newtab/", currentWindow: true });
  chrome.tabs.remove(extractTabIds(tabs));
};

export const onlyCurrentTab = async () => {
  const tabs = await chrome.tabs.query({ active: false, currentWindow: true });
  chrome.tabs.remove(extractTabIds(tabs));
};
