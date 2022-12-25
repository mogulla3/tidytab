export const extractTabIds = (tabs: chrome.tabs.Tab[]): number[] => {
  return tabs.map((tab) => tab.id).filter((tabId): tabId is number => tabId !== undefined);
};

export const extractTabGroupIds = (tabGroups: chrome.tabGroups.TabGroup[]): number[] => {
  return tabGroups.map((tabGroup) => tabGroup.id);
};
