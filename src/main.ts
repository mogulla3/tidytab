import "./style.css";

const sortAscBtn = document.getElementById("sort_asc")!;
const sortDescBtn = document.getElementById("sort_desc")!;
const removeDupBtn = document.getElementById("remove_dup")!;
const removeInitialBtn = document.getElementById("remove_initial")!;
const onlyCurrentTabBtn = document.getElementById("only_current_tab")!;

const enum SortOrder {
    ASC,
    DESC,
}

const sortTab = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab, sortOrder: SortOrder): number => {
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

const sortTabOrderByAsc = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab): number => {
    return sortTab(tabA, tabB, SortOrder.ASC);
};

const sortTabOrderByDesc = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab): number => {
    return sortTab(tabA, tabB, SortOrder.DESC);
};

// - Remove protocol(http, https).
// - Remove `www.` prefix from hostname.
// - Remove searchParams.
//
// Example:
// normalizeUrl("https://www.mogulla3.tech:9000/foo/bar/baz?q=100")
// => "mogulla3.tech:9000/foo/bar/baz"
const normalizeUrl = (urlStr: string): string => {
    const url: URL = new URL(urlStr);
    const host = url.host.startsWith("www.") ? url.host.slice(4) : url.host;

    return `${host}${url.pathname}`;
};

const extractTabIds = (tabs: chrome.tabs.Tab[]): number[] => {
    return tabs.map((tab) => tab.id).filter((tabId): tabId is number => tabId !== undefined);
};

sortAscBtn.addEventListener("click", (_event) => {
    chrome.tabs.query({ currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        for (const [index, tabId] of extractTabIds(tabs.sort(sortTabOrderByAsc)).entries()) {
            chrome.tabs.move(tabId, { index: index });
        }
    });
});

sortDescBtn.addEventListener("click", (_event) => {
    chrome.tabs.query({ currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        for (const [index, tabId] of extractTabIds(tabs.sort(sortTabOrderByDesc)).entries()) {
            chrome.tabs.move(tabId, { index: index });
        }
    });
});

removeDupBtn.addEventListener("click", (_event) => {
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

removeInitialBtn.addEventListener("click", (_event) => {
    chrome.tabs.query({ url: "chrome://newtab/", currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        chrome.tabs.remove(extractTabIds(tabs));
    });
});

onlyCurrentTabBtn.addEventListener("click", (_event) => {
    chrome.tabs.query({ active: false, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        chrome.tabs.remove(extractTabIds(tabs));
    });
});
