import { SortOrder } from "./sortOrder";
import { actions, ActionType } from "./actions";
import { Sorter } from "./Sorter";
import { groupTabs, ungroupTabs } from "./groupTab";
import { removeDuplicatedTabs, removeInitialStateTabs, onlyCurrentTab } from "./removeTab";

type Message = {
  action: ActionType;
};

const handleAction = async (action: ActionType) => {
  switch (action) {
    case "sort-asc": {
      const sorter = new Sorter();
      sorter.run(SortOrder.ASC);
      break;
    }
    case "sort-desc": {
      const sorter = new Sorter();
      sorter.run(SortOrder.DESC);
      break;
    }
    case "remove-dup":
      removeDuplicatedTabs();
      break;
    case "remove-initial":
      removeInitialStateTabs();
      break;
    case "only-current-tab":
      onlyCurrentTab();
      break;
    case "group-tabs":
      groupTabs();
      break;
    case "ungroup-tabs":
      ungroupTabs();
      break;
    default:
      console.log(`ERROR: "${action}" is an unknown action.`);
  }
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create(
    {
      id: "tidytab-context-menu",
      title: "tidytab",
      contexts: ["page"],
      type: "normal",
    },
    () => {
      for (const [action, description] of actions.entries()) {
        chrome.contextMenus.create({
          parentId: "tidytab-context-menu",
          id: action,
          title: description,
          contexts: ["page"],
          type: "normal",
        });
      }
    }
  );
});

chrome.runtime.onMessage.addListener(async (message: Message, _sender, sendResponse) => {
  handleAction(message.action);
  sendResponse({ result: "OK" });
});

chrome.contextMenus.onClicked.addListener((info, _tab) => {
  handleAction(info.menuItemId as ActionType);
});
