const enum SortOrder {
  ASC,
  DESC,
}

// - Remove protocol(http, https).
// - Remove `www.` prefix from hostname.
// - Remove searchParams.
//
// Example:
// normalizeUrl(new URL("https://www.mogulla3.tech:9000/foo/bar/baz?q=100"))
// => "mogulla3.tech:9000/foo/bar/baz"
const normalizeUrl = (url: string): string => {
  const urlObj = new URL(url);
  const host = urlObj.host.startsWith("www.") ? urlObj.host.slice(4) : urlObj.host;

  return `${host}${urlObj.pathname}`;
};

const compareTabs = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab, sortOrder: SortOrder): number => {
  if (tabA.url === undefined || tabB.url === undefined) {
    return 0;
  }

  const urlA = normalizeUrl(tabA.url);
  const urlB = normalizeUrl(tabB.url);

  if (sortOrder === SortOrder.ASC) {
    if (urlA < urlB) return -1;
    if (urlA > urlB) return 1;
  }

  if (sortOrder === SortOrder.DESC) {
    if (urlA < urlB) return 1;
    if (urlA > urlB) return -1;
  }

  return 0;
};

const compareTabsOrderByAsc = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab): number => {
  return compareTabs(tabA, tabB, SortOrder.ASC);
};

const compareTabsOrderByDesc = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab): number => {
  return compareTabs(tabA, tabB, SortOrder.DESC);
};

export const sortTabOrderByAsc = (tabs: chrome.tabs.Tab[]): chrome.tabs.Tab[] => {
  return tabs.sort(compareTabsOrderByAsc);
};

export const sortTabOrderByDesc = (tabs: chrome.tabs.Tab[]): chrome.tabs.Tab[] => {
  return tabs.sort(compareTabsOrderByDesc);
};
