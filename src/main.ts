import "./style.css";

const sortAscBtn = document.getElementById("sort_asc")!;
const sortDescBtn = document.getElementById("sort_desc")!;
const removeDupBtn = document.getElementById("remove_dup")!;
const removeInitialBtn = document.getElementById("remove_initial")!;
const onlyCurrentTabBtn = document.getElementById("only_current_tab")!;

const sortTab = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab, order: string): number => {
    if (tabA.url === undefined || tabB.url === undefined) {
        return 0;
    }

    const urlA = normalizeUrl(tabA.url);
    const urlB = normalizeUrl(tabB.url);

    if (order === "asc") {
        if (urlA < urlB) return -1;
        if (urlA > urlB) return 1;
    } else if (order === "desc") {
        if (urlA < urlB) return 1;
        if (urlA > urlB) return -1;
    }

    return 0;
};

// protocol (http, https) を削る
// host の prefix `www.` を削る
// searchParams を削る
//
// Example:
// normalizeUrl("https://www.mogulla3.tech:9000/foo/bar/baz?q=100")
// => "mogulla3.tech:9000/foo/bar/baz"
const normalizeUrl = (urlStr: string): string => {
    const url: URL = new URL(urlStr);
    const host = url.host.startsWith("www.") ? url.host.slice(4) : url.host;

    return `${host}${url.pathname}`;
};

const sortTabOrderByAsc = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab): number => {
    return sortTab(tabA, tabB, "asc");
};

const sortTabOrderByDesc = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab): number => {
    return sortTab(tabA, tabB, "desc");
};

sortAscBtn.addEventListener("click", (_event) => {
    chrome.tabs.query({ currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        tabs.sort(sortTabOrderByAsc);
        tabs.filter((tab: chrome.tabs.Tab) => tab.id !== undefined).forEach((tab: chrome.tabs.Tab, i: number) => {
            chrome.tabs.move(tab.id!, { index: i });
        });
    });
});

sortDescBtn.addEventListener("click", (_event) => {
    chrome.tabs.query({ currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        tabs.sort(sortTabOrderByDesc);
        tabs.filter((tab: chrome.tabs.Tab) => tab.id !== undefined).forEach((tab: chrome.tabs.Tab, i: number) => {
            chrome.tabs.move(tab.id!, { index: i });
        });
    });
});

removeDupBtn.addEventListener("click", (_event) => {
    chrome.tabs.query({ currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        tabs.sort(sortTabOrderByAsc);

        const checkedUrls: Array<string> = [];
        const duplicatedTabIds: Array<number> = [];
        tabs.forEach((tab: chrome.tabs.Tab) => {
            if (checkedUrls.includes(tab.url!)) {
                duplicatedTabIds.push(tab.id!);
            } else {
                checkedUrls.push(tab.url!);
            }
        });

        chrome.tabs.remove(duplicatedTabIds);
    });
});

removeInitialBtn.addEventListener("click", (_event) => {
    chrome.tabs.query({ url: "chrome://newtab/", currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        chrome.tabs.remove(tabs.map((tab: chrome.tabs.Tab) => tab.id!));
    });
});

onlyCurrentTabBtn.addEventListener("click", (_event) => {
    chrome.tabs.query({ active: false, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        chrome.tabs.remove(tabs.map((tab: chrome.tabs.Tab) => tab.id!));
    });
});
