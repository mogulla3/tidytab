export {}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    "id": "tidytab-context-menu",
    "title": "tidytab Context Menu",
    "contexts": ["page"],
    "type": "normal",
  });
});
