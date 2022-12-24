export const groupTabsByDomain = (tabs: chrome.tabs.Tab[]): { [key: string]: chrome.tabs.Tab[] } => {
  return tabs.reduce((result: { [key: string]: chrome.tabs.Tab[] }, tab: chrome.tabs.Tab) => {
    if (tab.url === undefined || tab.id === undefined) {
      return result;
    }

    const url = new URL(tab.url)
    if (url.hostname in result) {
      result[url.hostname].push(tab)
    } else {
      result[url.hostname] = [tab]
    }

    return result;
  }, {})
};
