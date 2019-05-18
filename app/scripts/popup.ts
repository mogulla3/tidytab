// Enable chromereload by uncommenting this line:
// import 'chromereload/devonly'

const sortAscBtn: HTMLElement = document.getElementById('sort_asc')!
const sortDescBtn: HTMLElement = document.getElementById('sort_desc')!
const removeDupBtn: HTMLElement = document.getElementById('remove_dup')!
const removeInitialBtn: HTMLElement = document.getElementById('remove_initial')!

const sortTab = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab, order: string): number => {
    if (tabA.url === undefined || tabB.url === undefined) {
        return 0
    }

    const tabAUrl: URL = new URL(tabA.url)
    const tabBUrl: URL = new URL(tabB.url)
    const domainAndPathA: string = `${tabAUrl.hostname}${tabAUrl.pathname}`
    const domainAndPathB: string = `${tabBUrl.hostname}${tabBUrl.pathname}`

    if (order === 'asc') {
        if (domainAndPathA < domainAndPathB) return -1
        if (domainAndPathA > domainAndPathB) return 1
    } else if (order === 'desc') {
        if (domainAndPathA < domainAndPathB) return 1
        if (domainAndPathA > domainAndPathB) return -1
    }

    return 0
}

const sortTabOrderByAsc = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab): number => {
    return sortTab(tabA, tabB, 'asc')
}

const sortTabOrderByDesc = (tabA: chrome.tabs.Tab, tabB: chrome.tabs.Tab): number => {
    return sortTab(tabA, tabB, 'desc')
}

sortAscBtn.addEventListener('click', (_event) => {
    chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
        tabs.sort(sortTabOrderByAsc)
        tabs.filter((tab: chrome.tabs.Tab) => tab.id !== undefined).forEach((tab: chrome.tabs.Tab, i: number) => {
            chrome.tabs.move(tab.id!, { index: i })
        })
    })
})

sortDescBtn.addEventListener('click', (_event) => {
    chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
        tabs.sort(sortTabOrderByDesc)
        tabs.filter((tab: chrome.tabs.Tab) => tab.id !== undefined).forEach((tab: chrome.tabs.Tab, i: number) => {
            chrome.tabs.move(tab.id!, { index: i })
        })
    })
})

removeDupBtn.addEventListener('click', (_event) => {
    chrome.tabs.query({}, (tabs: chrome.tabs.Tab[]) => {
        tabs.sort(sortTabOrderByAsc)

        const checkedUrls: Array<string> = []
        const duplicatedTabIds: Array<number> = []
        tabs.forEach((tab: chrome.tabs.Tab) => {
            if (checkedUrls.includes(tab.url!)) {
                duplicatedTabIds.push(tab.id!)
            } else {
                checkedUrls.push(tab.url!)
            }
        })

        chrome.tabs.remove(duplicatedTabIds)
    })
})

removeInitialBtn.addEventListener('click', (_event) => {
    chrome.tabs.query({ url: 'chrome://newtab/' }, (tabs: chrome.tabs.Tab[]) => {
        chrome.tabs.remove(tabs.map((tab: chrome.tabs.Tab) => tab.id!))
    })
})
