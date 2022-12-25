export const groupTabsByDomain = (tabs: chrome.tabs.Tab[]): { [key: string]: chrome.tabs.Tab[] } => {
  return tabs.reduce((result: { [key: string]: chrome.tabs.Tab[] }, tab: chrome.tabs.Tab) => {
    if (tab.url === undefined || tab.id === undefined) {
      return result;
    }

    const url = new URL(tab.url)
    const hostname = url.hostname.startsWith("www.") ? url.hostname.slice(4) : url.hostname;
    if (hostname in result) {
      result[hostname].push(tab)
    } else {
      result[hostname] = [tab]
    }

    return result;
  }, {})
};
