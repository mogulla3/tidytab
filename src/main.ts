import "./style.css";

const actions: string[] = [
  "sort_asc",
  "sort_desc",
  "remove_dup",
  "remove_initial",
  "only_current_tab",
  "group_tabs",
  "ungroup_tabs",
];

for (const action of actions) {
  document.getElementById(action)?.addEventListener("click", async (_event) => {
    await chrome.runtime.sendMessage({ action: action });
  });
}
