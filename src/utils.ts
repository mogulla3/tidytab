export const extractTabIds = (tabs: chrome.tabs.Tab[]): number[] => {
    return tabs.map((tab) => tab.id).filter((tabId): tabId is number => tabId !== undefined);
};
