import { SortOrder } from "./sortOrder";
import { Options } from "./options";

export class TabSorter {
  private tabs: chrome.tabs.Tab[];
  private options: Options;

  constructor(tabs: chrome.tabs.Tab[], options: Options) {
    this.tabs = tabs;
    this.options = options;
  }

  run(sortOrder: SortOrder): chrome.tabs.Tab[] {
    return this.tabs.sort((tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab) => {
      if (tabA.url === undefined || tabB.url === undefined) {
        return 0;
      }

      const urlA = this.normalizeUrl(tabA.url);
      const urlB = this.normalizeUrl(tabB.url);

      if (sortOrder === SortOrder.ASC) {
        if (urlA < urlB) return -1;
        if (urlA > urlB) return 1;
      }

      if (sortOrder === SortOrder.DESC) {
        if (urlA < urlB) return 1;
        if (urlA > urlB) return -1;
      }

      return 0;
    });
  }

  // Example:
  // normalizeUrl(new URL("https://www.mogulla3.tech:9000/foo/bar/baz?q=100"))
  // => "mogulla3.tech:9000/foo/bar/baz"
  private normalizeUrl(url: string): string {
    const urlObj = new URL(url);

    let host: string;
    if (this.options.ignoreWwwSubdomainOnSorting && urlObj.host.startsWith("www.")) {
      host = urlObj.host.slice(4);
    } else {
      host = urlObj.host;
    }

    return `${host}${urlObj.pathname}`;
  }
}
