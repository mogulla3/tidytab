import "./style.css";
import { sortTabOrderByAsc, sortTabOrderByDesc } from "./sort.js";
import { extractTabIds } from "./utils.js";

document.getElementById("sort_asc")?.addEventListener("click", (_event) => {
  chrome.tabs.query({ currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    for (const [index, tabId] of extractTabIds(tabs.sort(sortTabOrderByAsc)).entries()) {
      chrome.tabs.move(tabId, { index: index });
    }
  });
});

document.getElementById("sort_desc")?.addEventListener("click", (_event) => {
  chrome.tabs.query({ currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
    for (const [index, tabId] of extractTabIds(tabs.sort(sortTabOrderByDesc)).entries()) {
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
