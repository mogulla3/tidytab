import { SortOrder } from "./sortOrder";
import { sortTabs } from "./sortTab";
import { groupTabs, ungroupTabs } from "./groupTab";
import { removeDuplicatedTabs, removeInitialStateTabs, onlyCurrentTab } from "./removeTab";

chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
  switch (message.action) {
    case "sort_asc":
      sortTabs(SortOrder.ASC);
      break;
    case "sort_desc":
      sortTabs(SortOrder.DESC);
      break;
    case "remove_dup":
      removeDuplicatedTabs();
      break;
    case "remove_initial":
      removeInitialStateTabs();
      break;
    case "only_current_tab":
      onlyCurrentTab();
      break;
    case "group_tabs":
      groupTabs();
      break;
    case "ungroup_tabs":
      ungroupTabs();
      break;
    default:
      console.log("default");
  }

  sendResponse({ result: "OK" });
});
